const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../../config/config');
const Token = require('./token.model');
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');
const User = require('../user/user.model');


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
  

const generateSocialLoginToken = async(userId) => {

	const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const socialLink = generateSignToken(userId, expires, tokenTypes.SOCIAL_LOGIN);
	console.log(socialLink,'data##############2')
	await saveInviteToken(socialLink, userId, expires, tokenTypes.SOCIAL_LOGIN);
	console.log(socialLink,'data##############3')
	return { socialLink:socialLink };
  }
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationMinutes, 'minutes');
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
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

const verifyToken = async (token, type) => {
	try {
		const payload = jwt.verify(token, config.jwt.secret);
		const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
		if (!tokenDoc) {
			throw new Error('Token not found');
		}
		return tokenDoc;
	} catch (error) {
		return { msg: error.message }
	}
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
const justVerifyToken = async (token) => {
	const payload = jwt.verify(token, config.jwt.secret);
	if (payload) return payload;
	return null;
  };
module.exports = {
	generateToken,
	saveToken,
	generateAuthTokens,
	verifyToken,
	generateSocialLoginToken,
	generateSignToken,
	saveInviteToken,
	justVerifyToken,
	generateResetPasswordToken
};
