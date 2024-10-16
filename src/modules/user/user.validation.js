const Joi = require('joi');
const { password, objectId,  } = require('../../utils/customValidations');

const signupUser = {
	body: Joi.object().keys({
		fName: Joi.string().allow(""),
		lName: Joi.string().allow(""),
		username: Joi.string().allow(""),
		email: Joi.string().required().email().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be a valid mail`,
		}),
		password: Joi.string().required().custom(password).messages({
			"string.empty": `Password must contain value`,
			"any.required": `Password is a required field`
		}),
		profilePic: Joi.string().allow(""),
		country: Joi.string().allow(""),
		bio: Joi.string().allow(""),
		gender: Joi.string().allow(""),
		source: Joi.string().allow(""),
		role: Joi.string().allow(""),
	}),
};

const loginWithEmail = {
	body: Joi.object().keys({
		email: Joi.string().email().required().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be a valid email`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password must contain value`,
			"any.required": `Password is a required field`,
		}),
	}),
};

const loginWithUsername = {
	body: Joi.object().keys({
		username: Joi.string().required().messages({
			"string.empty": `Username must contain value`,
			"any.required": `Username is a required field`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password must contain value`
		}),
	}),
};


module.exports = {
	signupUser,
	loginWithEmail,
	loginWithUsername,
}