const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const couponServices = require('../services');
const { convertToJSON } = require('../../../utils/helper');

const getAllCoupons = catchAsync(async (req, res) => {
    const { page, limit, filter} = req.query;
    let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
    const result = await couponServices.getAllCoupons(page, limit, filter_Json_data);

    if (result.status) {
        sendResponse(res, httpStatus.OK, 
            {data: result?.data,
            totalResults: result?.totalResults,
            totalPages: result?.totalPages,
            page: result?.page,
            limit: result?.limit}, 
            null);
    } else {
        if (result.code === 500) {
          sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Internal Server Error');
        } else if (result.code === 400) {
          sendResponse(res, httpStatus.BAD_REQUEST, null, 'Bad Request');
        } else {
          sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Unexpected Error');
        }
      }
});

module.exports = getAllCoupons;
