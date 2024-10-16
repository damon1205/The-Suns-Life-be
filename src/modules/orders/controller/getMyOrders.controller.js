const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const getMyOrders = catchAsync(async (req, res) => {
	let user = req?.user;

	let result = await orderServices.getMyOrders({ userId: user?.id })
	if (result.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(res, result?.code === 400 ? httpStatus.BAD_REQUEST
			: result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null, result?.msg);
	}
});

module.exports = getMyOrders;