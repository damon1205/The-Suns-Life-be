const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const shippingServices = require("../services")

const removeShippingRegion = catchAsync(async (req, res) => {
    
    let {shippingId}= await pick(req.params,["shippingId"]) ;
   
 
    let result = await shippingServices.removeShippingRegion(shippingId)
    if (result?.code ===200) {
        sendResponse(res, httpStatus.OK,
            {
                data: result?.data,
            },
            null);
    } else {
        if (result?.code === 400 || result?.code === 401) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
        } else if (result?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result);
        }
    }

});

module.exports = removeShippingRegion;