const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const products = require('../../../databaseJson/products.json');
const { convertToJSON } = require('../../../utils/helper');

const getAllProducts = catchAsync(async (req, res) => {
    
    const { page, limit, filter, sort ,minPrice,maxPrice} = req.query;
    let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
    let result = await productsServices.getAllProducts(page, limit, filter_Json_data, sort,minPrice,maxPrice)
    if (result.status) {
        sendResponse(res, httpStatus.OK, 
            {data: result?.data,
            totalResults: result?.totalResults,
            totalPages: result?.totalPages,
            page: result?.page,
            limit: result?.limit}, 
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

module.exports = getAllProducts;