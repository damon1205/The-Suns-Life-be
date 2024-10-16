const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const getSiteMetadataByid = async (page, limit, filter, sort,id) => {
    try {
  
  
        const passsQuery = {  _id: mongoose.Types.ObjectId(id) };
        const listResult = await siteMetaDataModel.findOne(passsQuery)
       
       
        if (listResult) {
            return { data: listResult, status: true, code: 200 };
        }
        else {
            return { data: "SiteMetadata not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
  
    }
  }

module.exports = getSiteMetadataByid