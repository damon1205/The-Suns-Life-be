const express = require("express");
const auth = require("../../middlewares/auth");
const Controller = require('../../modules/notify/controller')

const validate = require("../../middlewares/validate")
const validation = require('../../modules/notify/notifyValidater')

const router = express.Router();

router.route('/addNotification').post(validate(validation.addNotification),Controller.addNotify);
router.route('/get-all-notification').get(auth('adminAccess'), Controller.getAllNotify);

module.exports = router;

