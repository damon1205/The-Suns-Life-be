const express = require("express");
const validate = require("../../middlewares/validate");
const contactValidation = require("../../modules/contactUs/validation");
const contactUsController = require("../../modules/contactUs/controllers");

const router = express.Router();

router
	.route("/add-contact-us")
	.post(validate(contactValidation.contactUsValidate), contactUsController.addContactusUserInfo);

router.route("/get-contactus-count").get(contactUsController.getContactUsCount);

module.exports = router;
