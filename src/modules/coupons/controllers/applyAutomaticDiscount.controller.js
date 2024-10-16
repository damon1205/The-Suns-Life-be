const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const couponServices = require("../services");

const applyAutomaticDiscount = catchAsync(async (req, res) => {
    const {cartData} = await pick(req.body, ["cartData"]);

    const insertResult = await couponServices.applyAutomaticDiscount(cartData);
    if (insertResult?.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
        return;
    } else {
        if (insertResult?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult?.data);
        } else if (insertResult?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult);
        }
    }
});

module.exports = applyAutomaticDiscount;
