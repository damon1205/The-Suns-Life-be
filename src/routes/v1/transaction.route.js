const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const transactionController = require("../../modules/payments/controller")
const auth = require("../../middlewares/auth")


const router = express.Router();

router.route('/transactionRequest').post( auth('manageUsers'), transactionController.addTransaction );
router.route('/updateTransaction').post(transactionController.updateTransaction)
router.route('/createpayment').post(transactionController.createPaymentSession);
module.exports = router;