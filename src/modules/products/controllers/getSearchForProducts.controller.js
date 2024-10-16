const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const productServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getSerchProducts = catchAsync(async (req, res) => {
  const { keyWord } = await req.query;
  const result = await productServices.getSerchProducts(keyWord);
  if (result.status) {
    sendResponse(res, httpStatus.OK, result.data, null);
  } else {
    if (result.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result.data);
    }
    else if (result.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result.data);
    }
  }

});

module.exports = getSerchProducts
