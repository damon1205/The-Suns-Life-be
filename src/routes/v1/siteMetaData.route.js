const express = require("express");
const validate = require("../../middlewares/validate")
const siteMetaDataValidation = require("../../modules/siteMetadata/validation")
 const siteMetaDataControllers = require("../../modules/siteMetadata/controller"); 

const auth = require("../../middlewares/auth");

const router = express.Router();


router.route('/add-site-metadata').post( validate(siteMetaDataValidation.addSiteMetadata), siteMetaDataControllers.addSiteMetadata);
router.route('/update-site-metadata/:id').put(siteMetaDataControllers.updateSiteMetadata);
router.route('/get-site-metadata-by-id/:id').get(siteMetaDataControllers.getSiteMetadataByid);
router.route('/get-all-site-metadata').get(siteMetaDataControllers.getAllSiteMetadata);
router.route('/get-site-metadata-by-type').get(siteMetaDataControllers.getSiteMetadataBytype);
router.route('/remove-site-metadata/:id').delete(siteMetaDataControllers.removeSiteMetadata);


module.exports = router;
