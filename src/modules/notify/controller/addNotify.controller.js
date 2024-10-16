const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const Series = require('../services')
const mongoose = require('mongoose')
const ProductModal = require('../../products/products.model')
const emailService = require('../../../utils/emailservice')

const addNotify = catchAsync(async (req, res) => {
    
    let {productId,email}= await pick(req.body,["productId","email"]) ;
    let filterQuery = {_id : mongoose.Types.ObjectId(productId)}
    let productResult = await ProductModal.findOne(filterQuery)
    let result = await Series.addNotify({productId,email})
    if (result?.code ===200) {
        sendResponse(res, httpStatus.OK,{data: result?.data,},null);
         emailService.notifyAdminProduct(email, productResult)
    } else {
        if (result?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
        } else if (result?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result);
        }
    }

});

module.exports = addNotify;