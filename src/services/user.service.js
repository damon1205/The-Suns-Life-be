const httpStatus = require('http-status');
const mongoose = require('mongoose');
// const { User } = require('../models');
const User = require('../modules/user/user.model')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../utils/responseHandler');
// const OTP = require("../modules/otpVerification/model");
const tokenService = require('./token.service');
// const Sales = require('../modules/saleReport/sale.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, res) => {
	// if (await User.isEmailTaken(userBody.email)) {
	//   sendResponse(res, httpStatus.BAD_REQUEST, null,'Email Already taken');
	//   return
	// }
	if (await User.isUserNameTaken(userBody.username)) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, 'Username already taken');
		return
	}
	const user = await User.create(userBody);
	return user;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createSocialUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		return { user: null, status: false, code: 403, data: { msg: 'Email already taken' } };

	}
	if (await User.isUserNameTaken(userBody.username)) {
		return { user: null, status: false, code: 403, data: { msg: 'Username already taken' } };
	}
	const user = await User.create(userBody);
	return user;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUserByPhone = async (userBody, res) => {
	if (await User.isPhoneTaken(userBody.phoneNumber)) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, 'Phone Number already taken');
		return
	}
	if (await User.isUserNameTaken(userBody.username)) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, 'Username already taken');
		return
	}
	const user = await User.create(userBody);
	return user;
};
/**
 * 
 * @param {String} username 
 * @returns 
 */
const isEmailAvailable = async (email, userId) => {
	const user = await User.findOne({ email, _id: { $ne: userId } });
	return !!user;
};

/**
 * 
 * @param {String} username 
 * @returns 
 */
const isReferalAvailable = async (username) => {

	const user = await User.findOne({ "username": username });

	return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
	return User.findById(id);
};

const getAdminUser = async () => {
	return User.findOne({ role: "admin" });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
	return User.findOne({ email, active: true });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getFbUserByFacebookId = async (facebookId) => {
	return User.findOne({ "metaData.id": facebookId });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByPhoneNumber = async (phoneNumber) => {
	return User.findOne({ phoneNumber, active: true });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUName = async (username) => {
	return User.findOne({ username, active: true });
};

const getUserByWallet = async (wallet) => {
	return User.findOne({ wallet: { default: wallet, metamask: wallet } });
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};


/**
 * Update user by id
 * @param {string} userEmail
 * @returns {Promise<User>}
 */
const activeUser = async (userBody) => {
	const users = await User.updateOne(userBody.find, userBody.body)
	return users;
};



/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, updateBody) => {
	let filterQuery = { active: true, _id: mongoose.Types.ObjectId(userId) }
	const removed = await User.updateOne(filterQuery, { $set: { active: false } })
	// console.log("removed----",removed)
	return removed
};

const listActiveUser = async (start, limit, filter) => {
	// console.log("listActiveUser ::", start, limit, filter);
	let searchQuery = { role: 'user' };
	if (Object.keys(filter).length > 0) {
		searchQuery = { ...searchQuery, ...filter };
	}
	const listResult = await User.aggregate([
		{
			$match: searchQuery,
		},
		{
			$project: {
				id: '$_id',
				fullName: 1,
				twitterUrl: 1,
				facebookUrl: 1,
				youtubeUrl: 1,
				instagramUrl: 1,
				email: 1,
				name: 1,
				isEmailVerified: 1,
				shortTermGoal: 1,
				longTermGoal: 1,
				portfolioLink: 1,
				profilePic: 1,
				role: 1,
				status: 1,
				createdAt: 1,
				username: 1,
				brandId: 1,
				coverImage: 1,
				bio: 1,
				isEmailVerified: 1,
				isFeaturedBrand: 1,
				active: 1,
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	])
		.skip(start)
		.limit(limit);
	const totalCount = await User.countDocuments(searchQuery);
	const filteredCount = listResult.length;
	return { users: listResult, totalCount, filteredCount };
};

/**
 * Get a All users List for Backend Admin Dropdown
 * @param {Object} pagination
 * @returns {Promise<Auction>}
 */

const listAllUsers = async (start = 0, limit = 20, search) => {
	let filterQuery = { active: true }
	if (search) {
		filterQuery['username'] = { $regex: new RegExp(`^${search}`), $options: 'i' }
	}
	const listResult = await User.aggregate([
		{
			$match: filterQuery,
		},
		{
			$project: {
				_id: 1,
				email: 1,
				name: 1,
				role: 1,
				username: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	])
		.skip(start)
		.limit(limit);
	const totalCount = await User.countDocuments( { active: true });
	const filteredCount = listResult.length;
	return { users: listResult, totalCount, filteredCount };
};

const listAllAgents = async (start = 0, limit = 20, search) => {

	
	let filterQuery = { active: true}
	if (search) {
		filterQuery['username'] = { $regex: new RegExp(`^${search}`), $options: 'i' }
	}
	const listResult = await User.aggregate([
		{
			$match: filterQuery,
		},
		{
			$project: {
				_id: 1,
				email: 1,
				name: 1,
				role: 1,
				username: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	])
		.skip(start)
		.limit(limit);
		
	const totalCount = await User.countDocuments({ active: true });
	const filteredCount = listResult.length;
	console.log(listResult,'satyam')
	return { agents: listResult, totalCount, filteredCount };
};

const userstatus = async (status, brandId) => {
	const searchQuery = { _id: mongoose.Types.ObjectId(brandId) };
	const result = await User.findOneAndUpdate(searchQuery, { profileStatus: status }, { new: true, useFindAndModify: false });
	return result;
};
const getMyProfileDetail = async (userId) => {
	const searchQuery = { _id: mongoose.Types.ObjectId(userId) };
	/* const result = await User.findOne(searchQuery); */
	const result = await User.findOne(searchQuery, { username: 1, email: 1, wallet: 1, bio: 1, profilePic: 1, facebookUrl: 1, instagramUrl: 1, discordId: 1, twitterUrl: 1 });

	return result;

}

const updateMyProfileDetail = async (userId, profileData) => {
	let userIdObjId = mongoose.Types.ObjectId(userId)
	const updateResult = await User.findOneAndUpdate({ _id: userIdObjId }, { $set: profileData }, { new: true })
	return updateResult
}

//Update Psp

const updatePspById = async (userId, updateBody) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};



module.exports = {
	createUser,
	queryUsers,
	getUserById,
	updateUserById,
	deleteUserById,
	listActiveUser,
	listAllUsers,
	userstatus,
	getUserByEmail,
	isEmailAvailable,
	getMyProfileDetail,
	updateMyProfileDetail,
	updatePspById,
	listAllAgents,
	getUserByPhoneNumber,
	activeUser,
	createUserByPhone,
	isReferalAvailable,
	getFbUserByFacebookId,
	createSocialUser,
	getUserByUName,
	getAdminUser,
	getUserByWallet,
};
