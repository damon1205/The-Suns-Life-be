const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const salesByCoupon = catchAsync(async (req, res) => {
	const { filter, sort, } = req.query;
	let filterJsonData = filter ? JSON.parse(filter) : null;

	let result = await orderServices.salesByCoupon(filterJsonData, sort);

	if (result.status) {
		sendResponse(res, httpStatus.OK, {
			data: result?.data,
			totalOrdersApplied: result?.totalOrdersApplied,
		}, null);
	} else {
		sendResponse(res,
			result?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR : httpStatus.BAD_REQUEST,
			null,
			result?.msg
		);
	}
});

module.exports = salesByCoupon;
