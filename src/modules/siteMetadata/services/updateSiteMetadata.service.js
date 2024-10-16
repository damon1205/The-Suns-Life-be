const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const updateSiteMetadata = async (id, reqBody) => {
	try {
        const passsearchQuery = {  _id: mongoose.Types.ObjectId(id) };
      
        const updateResult = await siteMetaDataModel.findOneAndUpdate(passsearchQuery, { ...reqBody }, { new: true });
        if (updateResult) {
            return { data: updateResult, status: true, code: 200 }
        } else {
            return { data: "SiteMetadata Not Found", status: false, code: 400 }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = updateSiteMetadata