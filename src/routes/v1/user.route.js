const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const userController = require("../../modules/user/user.controllers")
const auth = require("../../middlewares/auth")


const router = express.Router();
router.route('/admin-signup-user').post(userController.adminAddEmployee);
router.route('/admin-delete-user/:id').post(userController.adminDeleteUser);
router.route('/import-users').post(userController.importUsers);
router.route('/signup-user').post(validate(userValidation.signupUser), userController.signupUser);
router.route('/login-user').post(validate(userValidation.loginWithEmail), userController.login);
router.route('/get-my-account').get(auth('manageUsers'), userController.getCurrentUser);
router.route('/update-my-account').post(auth('manageUsers'), userController.updateMyAccount);
router.route('/get-All-users').get(userController.admingetUsers);
router.route('/reset-password-link-generate').post(userController.generateResetPasswordToken);
router.route('/reset-password').post(userController.resetPassword)
router.route('/verify-token/:id').get(userController.verifyToken)
router.route('/new-user').post(userController.newUser);
router.route('/export-email').get(userController.adminExportUserEmail);
router.route('/get-users').get(userController.admingetAllUsers);
router.route('/admin-get-user/:id').get(userController.adminGetUserById);

module.exports = router;