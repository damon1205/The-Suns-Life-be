const Joi = require("joi");

const contactUsValidate = {
	body: Joi.object().keys({
		name: Joi.string().required().messages({
			"string.empty": `name must contain value`,
			"any.required": `name is a required field`,
		}),
		email: Joi.string().email().required().messages({
			"string.empty": `email must contain value`,
			"any.required": `email is a required field`,
			"string.email": "Please provide a valid email address",
		}),
		phone: Joi.string().allow(""),
		message: Joi.string().required().messages({
			"string.empty": `,message must contain value`,
			"any.required": `message is a required field`,
		}),
		company: Joi.string().allow(""),
	}),
};

module.exports = {
	contactUsValidate,
};
