const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const getSiteMetadataBytype = async (page, limit, filter, sort,id,typeValue) => {

    try {
     const listResult = await siteMetaDataModel.find({type:typeValue,active:true})
     let totalResults
        if(listResult.length){
     totalResults = listResult.length;
        }
        
       
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

module.exports = getSiteMetadataBytype