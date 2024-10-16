
const productServices = require("../services");
const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");

  const getAllProductType = catchAsync(async (req, res) => {
   

	const  productType= await productServices.getAllProductType();
	if ( productType.status) {
		sendResponse(res, httpStatus.OK,  productType, null);
	} else {
		if ( productType.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null,  productType.data);
		} else if ( productType.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null,  productType.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null,  productType.data);
		}
	}
});


module.exports = getAllProductType;
  