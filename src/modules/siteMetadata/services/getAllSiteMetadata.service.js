const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const getAllSiteMetadata = async (page, limit, filter, sort,id) => {
    try {
     const listResult = await siteMetaDataModel.find({}).sort( {_id: -1})
        const totalResults = await siteMetaDataModel.countDocuments();
       
        if (listResult) {
            return { data: listResult, totalResults, status: true, code: 200 };
        }
        else {
            return { data: "SiteMetadata not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
  
    }
  }

module.exports = getAllSiteMetadata