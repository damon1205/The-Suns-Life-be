const siteMetaDataModel = require('../siteMetadata.model');
const mongoose = require("mongoose");


const removeSiteMetadata = async (id, reqBody) => {
	try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id) }
/* 
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(seriesId) }

      const removed = await couponModel.findOneAndDelete(filterQuery) */
        const updateResult = await siteMetaDataModel.findOne(filterQuery);
        if (updateResult) {
            const deleteMetadata = await siteMetaDataModel.findOneAndDelete(filterQuery)
           
            if(deleteMetadata){
                return { data: "Metadata deleted succssfully", status: true, code: 200 }
            }
            else {
                return { data: "Something went wrong", status: false, code: 400 }
            }
        } else {
            return { data: "Metadata Not Found", status: false, code: 400 }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = removeSiteMetadata