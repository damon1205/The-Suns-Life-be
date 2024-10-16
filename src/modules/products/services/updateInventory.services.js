const mongoose = require('mongoose');
const ProductModel = require('../products.model');
const NotifyModel = require('../../notify/notifyProduct.model')
const emailServices = require('../../../utils/emailservice')

const updateProductInventory = async (productId, reqBody) => {
    try {
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) };
        const filterQueryNotify = { active: true, productId: mongoose.Types.ObjectId(productId) };
        const updateResult = await ProductModel.findOneAndUpdate(filterQuery, { ...reqBody }, { new: true });
        const notifyEmails = await NotifyModel.find(filterQueryNotify,'email')

        if (updateResult) {
            if(notifyEmails.length > 0){
             const productDetails = await ProductModel.findOne(filterQuery)
                for(let notifyEmail of notifyEmails){
                    emailServices.notifyCustomerProduct(notifyEmail.email , productDetails)
                    const deactivateEmails = await NotifyModel.findOneAndUpdate(filterQueryNotify,{ $set: { active: false } })
                }
            }
             
            return { data: updateResult, status: true, code: 200 }
        } else {
            return { data: "Product Not Found", status: false, code: 400 }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = updateProductInventory
