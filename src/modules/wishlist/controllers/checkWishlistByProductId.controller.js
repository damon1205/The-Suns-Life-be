const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const checkWishlistByProductId = catchAsync(async (req, res) => {
    
    const userId = req.user.id
    let productId= req.params.productId;
   
 
    let result = await Services.checkWishlistByProductId({userId:userId,productId})
    if (result?.code ===200) {
        sendResponse(res, httpStatus.OK,
            {
                data: result?.data,
            },
            null);
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

module.exports = checkWishlistByProductId;