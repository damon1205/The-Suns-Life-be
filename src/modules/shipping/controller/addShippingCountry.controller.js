const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const shippingServices = require("../services");

const addShippingCountry = catchAsync(async (req, res) => {
    const {
        regionName,
        regions,
        shippingRateType,
        shippingOptions,
        active,
        weightRanges
    } = await pick(req.body,
        [
            "regionName",
            "regions",
            "shippingRateType",
            "shippingOptions",
            "active",
            "weightRanges"
        ]);

        

    const insertResult = await shippingServices.addShippingCountry({
        regionName,
        regions,
        shippingRateType,
        shippingOptions,
        active,
        weightRanges
    });
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if (insertResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if (insertResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
    }
});

module.exports = addShippingCountry