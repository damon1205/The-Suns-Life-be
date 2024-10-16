
const productServices = require("../services");
const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");

  const getAllFlavourByName = catchAsync(async (req, res) => {
   

	const  flavour= await productServices.getAllFlavourNamesForWeb();
	if ( flavour.status) {
		sendResponse(res, httpStatus.OK,  flavour, null);
	} else {
		if ( flavour.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null,  flavour.data);
		} else if ( flavour.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null,  flavour.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null,  flavour.data);
		}
	}
});


module.exports = getAllFlavourByName;
  