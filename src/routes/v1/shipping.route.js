const express = require("express");
const validate = require("../../middlewares/validate")
const shippingValidation = require('../../modules/shipping/shipping.validation')
const shippingController = require("../../modules/shipping/controller");
const auth = require("../../middlewares/auth");
const { updateTrackingId } = require("../../modules/shiptheory/services/updateTrackingId");
const { getTokenForTracking } = require("../../modules/shiptheory/services/getTokenForTracking");

const router = express.Router();

router.route('/add-shipping-country').post(validate(shippingValidation.addShippingCountry),auth("adminAccess"), shippingController.addShippingCountry)
router.route('/get-all-shipping').get(auth("adminAccess"), shippingController.getAllShipping)
router.route('/get-all-shipping-country').get(shippingController.getAllCountry)
router.route('/get-shipping-by-id/:id').get(auth("adminAccess"), shippingController.getShippingById)
router.route("/update-shipping/:id").put(auth("adminAccess"), shippingController.updateShippingById)

router.route('/remove-region/:shippingId').delete(auth("adminAccess"),  shippingController.removeShippingRegion )
router.route('/get-shipping-by-country-state').get(shippingController.getShippingByCountryState)

//update shipthory staus
router.route('/update-shipping-status').post(auth("adminAccess"),(req, res) => {
    // Pass req.body to getTokenForTracking middleware
    getTokenForTracking(req, res);
  })
module.exports = router;