const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const Series = require('../services')
const mongoose = require('mongoose')
const ProductModal = require('../../products/products.model')
const emailService = require('../../../utils/emailservice')
const Services = require("../services");

const getsortproduct = catchAsync(async (req, res) => {
  
    const { page, limit, filter, sort} = req.query;
    let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
    let result = await Services.getsortproduct(page, limit, filter_Json_data, sort)
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

module.exports = getsortproduct;