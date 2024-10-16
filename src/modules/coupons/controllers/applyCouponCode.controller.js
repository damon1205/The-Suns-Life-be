const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const couponServices = require("../services");

const applyCoupon = catchAsync(async (req, res) => {
    const {cartData, couponCode, deliveryCharge} = await pick(req.body, ["cartData", "couponCode", "deliveryCharge"]);

    const insertResult = await couponServices.applyCoupon(cartData, couponCode, deliveryCharge);

    if (insertResult?.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
        return;
    } else {
        if (insertResult?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult?.data);
        } else if (insertResult?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult?.data);
        }
    }
});

module.exports = applyCoupon;
