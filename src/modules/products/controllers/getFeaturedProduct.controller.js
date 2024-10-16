const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const products = require('../../../databaseJson/products.json');
const { convertToJSON } = require('../../../utils/helper');

const getFeaturedProduct = catchAsync(async (req, res) => {
    
    let result = await productsServices.getFeaturedProducts()
    if (result.status) {
        sendResponse(res, httpStatus.OK, 
            {data: result?.data,
            totalResults: result?.totalResults,
            status: result?.status,
            code: result?.code

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

module.exports = getFeaturedProduct;