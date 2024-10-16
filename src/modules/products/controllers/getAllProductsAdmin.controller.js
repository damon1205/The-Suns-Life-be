const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const productServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getAllProductsadminontroller = catchAsync(async (req, res) => {

  const {name} = await pick(req?.query,['name'])
  console.log(name)
  const Products = await productServices.getAllProductsAdmin(name);
  if (Products.status) {
    sendResponse(res, httpStatus.OK, Products.data, null);
  } else {
    if (Products.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, Products.data);
    }
    else if (Products.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, Products.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, Products.data);
    }
  }

});

module.exports = getAllProductsadminontroller
