const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const pick = require('../utils/pick');
const referralService = require("../modules/referral/referral.service");
const { signUpOtpEmail, signUpWelcomeEmail } = require('../utils/emailservice');
const Otp = require("../modules/otpVerification/model")
const moment = require('moment');
const { signUpOtpMessage } = require('../utils/messageService');

function randomStringForUsername(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const register = catchAsync(async (req, res) => {

  try {
    const { email, password, fName, lName, role, username } = req.body;
    let roleOfUser = role ? role : 'user';

    let userObj = {
      email,
      password,
      fName: fName,
      lName: lName,
      role: roleOfUser,
      username,
    };
    const isEmailAvailable = await userService.isEmailAvailable(req.body.email)
    if (isEmailAvailable) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, 'Email already taken');

    }

    const user = await userService.createUser(userObj);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    console.error("Error in registration", error);
  }

});


const referral = catchAsync(async (req, res) => {
  try {
    const { referalCode } = req.body;
    const referalAvailable = await referralService.fetchReferralByCode(referalCode);
    if (referalAvailable) {
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        data: referalAvailable,

      });
    }
    else {
      res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        data: "Referral Code Not Found",
      });
    }
  } catch (error) {
    console.error("Error in Referral code", error);
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: "Referral Code Not Found",
    });
  }

});


const processGoogleAuth = async (gUser) => {
  let user = null;
  user = await authService.loginUserWithGoogleEmail(gUser.email);
  if (!user) {
    let userObj = {
      email: gUser.email,
      password: '@Thesnuslife1',
      fName: gUser.given_name,
      lName: gUser.family_name,
      role: "user",
      username: `${gUser.given_name}_${randomStringForUsername(4)}`,
      isEmailVerified: true,
      source:'google',
      createdAt:new Date()
    };
    user = await userService.createSocialUser(userObj);
    signUpWelcomeEmail({ to: gUser.email, emailBody: { fName: gUser.given_name, lName: gUser.family_name, eMail: gUser.email } })
  }
  const tokens = await tokenService.generateSocialLoginToken(user._id);
  return { socialLink: tokens.socialLink }
}

const processFaceBookAuth = async (fUser) => {
  let user = null;
  user = await authService.loginUserWithFaceBookName(fUser.id);
  if (!user) {
    let userObj = {
      email: `${fUser.id}_facebook@stardust.com`,
      password: '@Thesnuslife1',
      fName: fUser.displayName,
      lName: "",
      role: "user",
      username: `${fUser.displayName.trim()}_${Math.floor(Math.random() * 9000)}`,
      isEmailVerified: true,
      source:'facebook',
      metaData:fUser,
    };
    user = await userService.createSocialUser(userObj);
  }
  const tokens = await tokenService.generateSocialLoginToken(user._id);
  return { socialLink: tokens.socialLink }
}

const adminHost = process.env.adminHost
const login = catchAsync(async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  /* TODO : validate email; password */
  let userData = null;
  // below logic for If user try to login with profileStatus pending
  if(email) userData = await userService.getUserByEmail(email)||null;
  else if(phoneNumber) userData = await userService.getUserByPhoneNumber(phoneNumber);

  if (email && !userData) {
    sendResponse(res, httpStatus.NOT_FOUND,  null, "For login please signup" );
    return
  }

  // console.log("userdata :", userData)
  if(userData && userData.profileStatus === 'activated'){
    let reqOrigin = req.headers && req.headers.origin ? new URL(req.headers.origin) : ''
    let isAdmin = reqOrigin.host == adminHost
    // console.log("isAdmin::::", isAdmin)
    const user = await authService.loginUserWithEmailAndPassword(email, password, phoneNumber, isAdmin);
    /* INFO: Send error message in data directly just like below to maintain consistensy in APP */
    if(user && !user.user){
      sendResponse(res, httpStatus.FORBIDDEN, null,user.msg);
      return;
    }
    const tokens = await tokenService.generateAuthTokens(user.user);
    sendResponse(res, httpStatus.OK, { user:user.user, tokens }, null);
  }else{
    sendResponse(res, httpStatus.NOT_FOUND,null,"User with this email not found.");
  }
  //  else if(userData && userData.profileStatus === 'pending') {
  //   /* allow 3 time otp  | RATE LIMITER FOR OTP FOR 1HOUR */
  //   let nowDate = new Date();
  //   let oneHrBeforeDate = moment(Date.now()).subtract(1, 'h').toDate();
  //   // console.log(nowDate,oneHrBeforeDate);
  //   let otpQuery = { "createdAt": { "$lt": nowDate, "$gte": oneHrBeforeDate } }
  //   if(email) {
  //     otpQuery['email'] = userData.email
  //     otpQuery['type'] = 'EmailOTP'
  //   } else if(phoneNumber) {      
  //     otpQuery['phoneNumber'] = userData.phoneNumber
  //     otpQuery['type'] = 'phone'
  //   }
  //   // let otpQuery = { "email": userData.email, "type": "EmailOTP", "createdAt": { "$lt": nowDate, "$gte": oneHrBeforeDate } };
  //   let otpCount = await Otp.countDocuments(otpQuery);
  //   if (otpCount > 2) {
  //     sendResponse(res, httpStatus.GATEWAY_TIMEOUT, null, "You requested too Many OTPs to activate account, Please try again after 1 hour.");
  //     return
  //   }

  //   let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
  //   const expires = moment().add(10, 'minutes');
  //   const createOtpdoc = {
  //     type: "EmailOTP",
  //     otp: generatedOtp,
  //     email: email,
  //     expires
  //   }
  //   if(email) {
  //     createOtpdoc['type'] = "EmailOTP"
  //     createOtpdoc['email'] = email
  //   } else if(phoneNumber) {
  //     createOtpdoc['type'] = "phone"
  //     createOtpdoc['phoneNumber'] = phoneNumber
  //   }
  //   await Otp.create(createOtpdoc);
  //   if(email){
  //     signUpOtpEmail({ to: email, emailBody: generatedOtp })
  //     sendResponse(res, httpStatus.OK,  "OTP has been send to your Email to activate your account" , null);
  //   } else if(phoneNumber) {
  //     signUpOtpMessage( { to: phoneNumber, countryCode: userData.countryCode, smsBody: `OTP to Verify Account ${generatedOtp}. This OTP is valid for 10 mins only. Do not share it with anyone - Stardust.` } )
  //     sendResponse(res, httpStatus.OK,  "OTP has been send to your Phone to activate your account" , null);
  //   }
  //   return
  // }

});

const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.adminLoginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});

const socialLogin = catchAsync(async (req, res) => {
  const { token } = await pick(req.body, ["token"]);
  console.log("here")
  const {sub} = await tokenService.justVerifyToken(token);
  let user = await userService.getUserById(sub);
  user.id = user._id;

  let currentTimeStamp = new Date()
  console.log("currentTimeStamp :",currentTimeStamp)
  utc = currentTimeStamp.getTime() + (currentTimeStamp.getTimezoneOffset() * 60000);
  let singaporeTime = new Date(utc + (3600000*"+8"));
  console.log("The local time in Singapore is " + singaporeTime);
  let updateRes = await userService.updateUserById(user.id, {currentLoginTimeStamp:singaporeTime})
  if(updateRes) user = updateRes
  
  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user,tokens }, null);
});


const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status:true,
        data: { userData: userRes.userData, profileData:userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status:false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});



const getCurrentInvite = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    // console.log("token", token);
    const inviteData = await authService.getCurrentInvite(token);
    if (inviteData) {
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        data: inviteData,
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        data: 'Something went wrong',
      });
    }
  } catch (err) {
    console.log("err", err.message);
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: 'Invalid token !',
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const resetPassword = catchAsync(async (req, res) => {
  const response = await authService.resetPassword(req.body.token, req.body.password);
  if (response) {
    if (!response.error) {
      sendResponse(res, httpStatus.OK, response, null);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, response.error, null);
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password reset failed');
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  getCurrentUser,
  adminLogin,
  processGoogleAuth,
  resetPassword,
  getCurrentInvite,
  referral,
  socialLogin,
  processFaceBookAuth
};
