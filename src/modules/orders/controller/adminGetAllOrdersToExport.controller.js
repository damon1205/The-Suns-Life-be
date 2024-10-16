const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const adminGetAllOrdersToExport = catchAsync(async (req, res) => {
	const { filter, sort } = req.query;
	console.log(filter,sort)

	let filter_Json_data = filter ? JSON.parse(filter) : null;
	if(filter_Json_data){
		filter_Json_data.paymentType="pay360";
	}
	let result = await orderServices.adminGetAllOrdersToExport(filter_Json_data, sort)
	if (result.status) {
		sendResponse(res, httpStatus.OK,
			{
				data: result?.data,
				totalResults: result?.totalResults,
			},
			null);
	} else {
		sendResponse(res,
			result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: result?.code === 404 ? httpStatus.NOT_FOUND
					: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		)
	}

});

module.exports = adminGetAllOrdersToExport;