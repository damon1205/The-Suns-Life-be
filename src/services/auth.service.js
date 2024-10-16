const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../config/roles');
const OTP = require("../modules/otpVerification/model");
const Invitation = require('../modules/invitation/invitation.modal');
const Profile = require('../modules/userProfiles/userProfile.modal');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, phoneNumber, isAdmin) => {

  let user = null;
  if (email) {
    user = await userService.getUserByEmail(email);
  } else {
    user = await userService.getUserByPhoneNumber(phoneNumber);
  }

  if (user && !(user.role == 'user')) return {user:null,msg: 'User is not authorized'} ;
  if (!user || !(await user.isPasswordMatch(password))) {
    // throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    return {user:null,msg:'Incorrect email or password'} 
  }
  let currentTimeStamp = new Date()
  console.log("currentTimeStamp :",currentTimeStamp)
  utc = currentTimeStamp.getTime() + (currentTimeStamp.getTimezoneOffset() * 60000);
  let singaporeTime = new Date(utc + (3600000*"+8"));
  console.log("The local time in Singapore is " + singaporeTime);
  let res = await userService.updateUserById(user.id, {currentLoginTimeStamp:singaporeTime})
  if(res) user = res
  return {user};
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminLoginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (user && !adminRoles.includes(user.role)) throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    const { user, userProfileId } = await tokenService.verifyToken(token, 'refresh');
    const userData = await User.findOne({ _id: mongoose.Types.ObjectId(user), active: true });
    let profileData = null;
    if (userProfileId) {
      profileData = await Profile.findOne({ _id: mongoose.Types.ObjectId(userProfileId), active: true });
    }
    return { userData, profileData, status: true, statusCode: 200 };
  } catch (error) {
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
    return { userData: null, profileData: null, isError: 'getCurrentUser failed', status: false, statusCode: 500 }

  }
};

/**
 * getCurrentUser
 * @param {string} InviteToken
 * @returns {Promise}
 */
const getCurrentInvite = async (token) => {
  try {
    const { sub } = await tokenService.justVerifyToken(token, 'profileinvite');

    console.log("current 2", sub);
    const inviteData = await Invitation.findOne({ _id: mongoose.Types.ObjectId(sub), active: true });
    console.log("current 3", inviteData);
    return inviteData;
  } catch (error) {
    console.log("current 4", error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Get Current Invite Failed');
  }
};

/**
 * Verify OTP
 * @param {number} otp
 * @returns {Promise}
 */
const verifyOTP = async ({ otp, email, phoneNumber }) => {
  try {
    let getUser = null;
    if (email) {
      getUser = await OTP.findOne({ email:email, type: 'forget' }).sort({ _id: -1 }) || null;
    } else if(phoneNumber){
      getUser = await OTP.findOne({ phoneNumber: phoneNumber, type: 'forget' }).sort({ _id: -1 }) || null;
    }else{
      return { user: null, errorMsg: "Please Provide Email or Phone" }
    }
    if (!getUser && email) {
      return { user: null, errorMsg: "No OTP found for the email service" }
    }
    if (!getUser && phoneNumber) {
      return { user: null, errorMsg: "No OTP found for the Phone Number" }
    }
    // console.log("getUser", getUser, otp, email, phoneNumber);
    if (otp == getUser.otp) {
      let resObj = await tokenService.generateResetPasswordToken(getUser.userId)
      await OTP.deleteOne({ _id: mongoose.Types.ObjectId(getUser._id) })
      return { user: resObj.user, resetPasswordToken: resObj.resetPasswordToken }
    } else {
      return { user: null, errorMsg: "Incorrect OTP" }
    }
  } catch (error) {
    // console.log("error", error);
    return { user: null, errorMsg: error.message }
  }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    /* TODO : CHECK FOR EXPIRY */
    /*   const newuser = await OTP.findOne({ userId: mongoose.Types.ObjectId(user._id), type: 'forget' }).sort({ createdAt: -1 });
      console.log('new user::', newuser) */
    if (user) {
      if(user.profileStatus === "pending"){
      await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user.id), active: true }, { profileStatus:"activated", password: newPassword }, { new: true })
      }
      if(user.profileStatus === "activated"){
        await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user.id), active: true }, { password: newPassword }, { new: true })
      }
       await OTP.deleteOne({ user: mongoose.Types.ObjectId(user.id) });
      // console.log(add123, '@@@@@@@@@@@@@@@@@@@@@@')
      return { message: "Password successfully reset" }
    } else {
      return { error: "OTP verification Failed" }
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const getProfileInviteToken = async (userId) => {
  const result = await tokenService.generateProfileInviteToken(userId);
  return result
}

/**
 * Login with username and password
 * @param {string} email
 * @returns {Promise<User>}
 */
const loginUserWithGoogleEmail = async (email) => {
  const user = await userService.getUserByEmail(email);
  return user;
};

/**
 * Login with username and password
 * @param {string} facebookId
 * @returns {Promise<User>}
 */
 const loginUserWithFaceBookName = async (facebookId) => {
  const user = await userService.getFbUserByFacebookId(facebookId);
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  adminLoginUserWithEmailAndPassword,
  getCurrentUser,
  verifyOTP,
  resetPassword,
  getProfileInviteToken,
  getCurrentInvite,
  loginUserWithGoogleEmail,
  loginUserWithFaceBookName
};
