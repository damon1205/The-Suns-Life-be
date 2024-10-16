const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const addSiteMetadata = async (body) => {
	try {
        let duplicateTypename;
                duplicateTypename = await siteMetaDataModel.find({type:body?.type,active:true})
           
            if( duplicateTypename?.length){
                return { data: "Duplicate type",msg:"Duplicate type", status: false, code: 400 };
            }
        const updatedResult = await siteMetaDataModel.create(body)
     
        if (updatedResult) {
            return { data: updatedResult, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
        }
    catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = addSiteMetadata