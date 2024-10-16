const User = require("../user/user.model");
const userServices = require("../user/user.services");
const { adminRoles } = require("../../config/roles");
const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");

const tokenService = require("../token/token.services");
const Token = require("../token/token.model");
const { tokenTypes } = require("../../config/tokens");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminLoginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email, active: true });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  if (user && !adminRoles.includes(user.role))
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  return user;
};
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userServices.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @returns {Promise<User>}
 */
const loginUserWithGoogleEmail = async (email) => {
  const user = await userServices.getUserByEmail(email);
  return user;
};

/**
 * Login with username and password
 * @param {string} facebookId
 * @returns {Promise<User>}
 */
const loginUserWithFaceBookName = async (facebookId) => {
  const user = await userServices.getFbUserByFacebookId(facebookId);
  return user;
};
module.exports = {
  adminLoginUserWithEmailAndPassword,
  refreshAuth,
  loginUserWithGoogleEmail,
  loginUserWithFaceBookName,
};
