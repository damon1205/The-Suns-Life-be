const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const getOrdersForDHL = catchAsync(async (req, res) => {
	const { page, limit, filter, sort } = req.query;

	let filter_Json_data = filter ? JSON.parse(filter) : null;
	if (filter_Json_data) {
		filter_Json_data.paymentType = 'pay360';
	}

	let result = await orderServices.getOrdersForDHL(page, limit, filter_Json_data, sort)
	if (result.status) {
		sendResponse(res, httpStatus.OK,
			{
				data: result?.data,
				totalResults: result?.totalResults,
				totalPages: result?.totalPages,
				page: result?.page,
				limit: result?.limit
			},
			null);
	} else {
		sendResponse(res,
			result?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		)
	}

});

module.exports = getOrdersForDHL;