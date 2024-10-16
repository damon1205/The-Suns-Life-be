const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const categoryServices = require("../services");

const addCategory = catchAsync(async (req, res) => {
    const { productIds, brand } = req.body;
    const product = await categoryServices.addCategory(productIds, brand);
    if (product.status) {
        sendResponse(res, httpStatus.OK, product.data, null);
    } else {
        if (product.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, product.data);
        }
        else if (product.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, product.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, product.data);
        }
    }

});

module.exports = addCategory;