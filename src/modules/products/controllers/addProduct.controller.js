const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");

const addProduct = catchAsync(async (req, res) => {
    let productData = req?.body || {}
    const insertResult = await productsServices.addProduct(productData);
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        sendResponse(
            res,
            insertResult?.code == 404 ? httpStatus.NOT_FOUND
                : insertResult?.code === 500 ? httpStatus?.INTERNAL_SERVER_ERROR
                    : httpStatus.BAD_REQUEST,
            insertResult?.data
        )
    }
});

module.exports = addProduct;