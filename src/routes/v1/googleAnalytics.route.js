const express = require("express");
const auth = require("../../middlewares/auth");
const Controller = require('../../controllers/googleAnalytic.controller')
const countryController = require('../../controllers/googleCountryData.controller')
const deviceController = require('../../controllers/googleDeviceData.controller')
const countryDataWithIso = require('../../controllers/googleCountryDatawithIso')



const router = express.Router();

router.route('/get-all-deta').get(Controller);
router.route('/get-all-countryData').get(countryController);
router.route('/get-all-deviceData').get(deviceController);
router.route('/get-all-countryDataWithIso').get(countryDataWithIso);



module.exports = router;

