const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../modules/auth/validation");
const authController = require("../../modules/auth/auth.controllers");

const router = express.Router();

router.route("/admin-login").post(validate(authValidation.loginWithEmail), authController.adminLogin);
router.route("/socialLogin").post(validate(authValidation.socialLogin), authController.socialLogin);
router.route("/renew-token").post(validate(authValidation.renewToken), authController.refreshTokens);

module.exports = router;