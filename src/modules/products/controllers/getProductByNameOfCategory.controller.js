const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const productServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getProductByNameOfCategory = catchAsync(async (req, res) => {
  const { name } = await pick(req.params, ['name']);
console.log('getProductByNameOfCategor', name);
  const series = await productServices.getProductByNameOfCategory(name);
  if (series.status) {
    sendResponse(res, httpStatus.OK, series.data, null);
  } else {
    if (series.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, series.data);
    }
    else if (series.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, series.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, series.data);
    }
  }

});

module.exports = getProductByNameOfCategory
