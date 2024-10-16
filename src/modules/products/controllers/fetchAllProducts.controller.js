const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const ProductServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const fetchAllProducts = catchAsync(async (req, res) => {

	const { name="" } = await pick(req?.query, ['name'])
	const fetchResult = await ProductServices.fetchAllProducts(name);
	if (fetchResult?.status) {
		sendResponse(res, httpStatus.OK, fetchResult?.data, null);
	} else {
		sendResponse(res,
			fetchResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: fetchResult?.code == 404 ? httpStatus.NOT_FOUND : httpStatus.BAD_REQUEST,
			null,
			fetchResult?.data
		);
	}

});

module.exports = fetchAllProducts
