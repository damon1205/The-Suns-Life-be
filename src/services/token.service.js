const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
// const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const  User  = require('../modules/user/user.model');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
 const generateSignToken = (inviteId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: inviteId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false,userProfileId=null) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
    userProfileId
  });
  return tokenDoc;
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} inviteId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
 const saveInviteToken = async (token, inviteId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: inviteId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};




/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const justVerifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload) return payload;
  return null;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user,userProfileId=null) => {
  console.log("expiry :--",config.jwt.accessExpirationMinutes, config.jwt.refreshExpirationMinutes);
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
  
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationMinutes, 'minutes');
  console.log("access expiry :--", accessTokenExpires);
  console.log("refresh expiry :--", refreshTokenExpires);
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH,false,userProfileId);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {object} id
 * @returns {Promise<Object>}
 */
 const generateResetPasswordToken = async (id) => {
  // console.log("1" ,id);
  const user = await  User.findById(id);
  if (!user) {
    return { error: "No users found" }
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return { user, resetPasswordToken };
};

const generateProfileInviteToken = async(inviteId) => {
  const expires = moment().add("100", 'minutes');
  const profileInvite = generateSignToken(inviteId, expires, tokenTypes.PROFILE_INVITE);
  await saveInviteToken(profileInvite, inviteId, expires, tokenTypes.PROFILE_INVITE);
  return { inviteId, link:profileInvite };
}

/**
 * 
 * @param {objectId} userId 
 * @returns 
 */
const generateSocialLoginToken = async(userId) => {
  const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const socialLink = generateSignToken(userId, expires, tokenTypes.SOCIAL_LOGIN);
  await saveInviteToken(socialLink, userId, expires, tokenTypes.SOCIAL_LOGIN);
  return { socialLink:socialLink };
}


/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
// UNUSED
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};


//? used in email template
const generateSetupPasswordToken = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);
  const tokenExpiry = moment().add(config.jwt.refreshExpirationMinutes, 'minutes');
  const savedToken = await saveToken(accessToken, user.id, tokenExpiry, tokenTypes.SETUP_PASSWORD);
  return accessToken;
};

const verifySetupPasswordToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  let userId
  if (payload && payload.sub) {
    if (payload.sub.id) userId = payload.sub.id
    else userId = payload.sub
  } else return null
  const tokenDoc = await Token.findOne({ token, type, user: userId, blacklisted: false });
  if (!tokenDoc) {
    return null;
  } else {
    await Token.updateOne(
      { token, type, user: userId, blacklisted: false },
      { blacklisted: true },
      { useFindAndModify: false }
    );
    return payload.sub;
  }
};


module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  justVerifyToken,
  generateSetupPasswordToken,
  verifySetupPasswordToken,
  generateProfileInviteToken,
  generateSignToken,
  saveInviteToken,
  generateSocialLoginToken
};
