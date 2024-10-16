const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const getTopCountryTotalAmount = catchAsync(async (req, res) => {

   
   


    let result = await orderServices.getTopCountryTotalAmount() 
	
 	
	if (result.status) {
        sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(res, result?.code === 400 ? httpStatus.BAD_REQUEST
			: result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null, result?.msg);
	}  
});

module.exports = getTopCountryTotalAmount;