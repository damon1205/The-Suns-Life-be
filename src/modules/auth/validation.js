const Joi = require("joi");
const { emailCustom } = require("./custom.validation");
const { password } = require("../../utils/customValidations");

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

const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email().messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
			"string.email": `Email must be valid mail`,
		}),
		password: Joi.string().required().custom(password).messages({
			"string.empty": `Password must contain value`,
			"any.required": `Password is a required field`,
		}),
		fName: Joi.string().required().messages({
			"string.empty": `First name must contain value`,
			"any.required": `First name is a required field`,
		}),
		lName: Joi.string(),
		username: Joi.string().required().messages({
			"string.empty": `Username must contain value`,
			"any.required": `Username is a required field`,
		}),
		role: Joi.string().required(),
		referralCode: Joi.string(),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required().custom(emailCustom).messages({
			"string.empty": `Email must contain value`,
			"any.required": `Email is a required field`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password must contain value`,
		}),
		phoneNumber: Joi.string().allow("").required(),
	}),
};

const adminLogin = {
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

const resetPasswordValidation = {
	body: Joi.object().keys({
		token: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const renewToken = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const socialLogin = {
	body: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

module.exports = {
	loginWithEmail,
	register,
	login,
	renewToken,
	resetPasswordValidation,
	adminLogin,
	socialLogin,
};
