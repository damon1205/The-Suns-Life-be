const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const sortcontroller = require("../../modules/sortbyadmin/controller")
const auth = require("../../middlewares/auth")


const router = express.Router();

router.route('/add').post(auth('adminAccess'), sortcontroller.adminAddsort );
router.route('/get').get( sortcontroller.getsortproduct);
router.route('/update').put(auth('adminAccess'), sortcontroller.updatesortProduct);

module.exports = router