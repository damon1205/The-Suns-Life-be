const express = require("express");
const validate = require("../../middlewares/validate");
const addressValidation = require("../../modules/addresses/validation");
const addressController = require("../../modules/addresses/controllers");
const auth = require("../../middlewares/auth");
const updateOrderNotesController = require("../../modules/addresses/controllers");

const router = express.Router();

router
	.route("/add-address")
	.post(validate(addressValidation.addAddress), auth("manageUsers"), addressController.addAddressController);
router.route("/admin-add-address").post(auth("adminAccess"), addressController.adminAddaddress);
router.route("/remove-address/:addressId").post(auth("manageUsers"), addressController.removeAddressController);
router.route("/getAddress/:id").get(auth("manageUsers"), addressController.getAddressByIdController);
router.route("/get-my-address").get(auth("manageUsers"), addressController.getMyAllAddress);
router.route("/update-address/:id").post(auth("manageUsers"), addressController.updateAddress);
router.route("/update-address-admin/:id").post(auth("adminAccess"), addressController.updateAddress);
router.route("/update-ordernotes/:id").put(auth("manageUsers"), updateOrderNotesController.updateOrderNotes);
router.route("/reset-ordernotes/:id").put(updateOrderNotesController.resetOrderNotes);
router.route("/update-address-ByAdmin/:id").post(auth("adminAccess"), addressController.updateAddressByAdmin);
router.route("/get-address/:userId").get(auth("adminAccess"), addressController.admingetAddressById);

module.exports = router;