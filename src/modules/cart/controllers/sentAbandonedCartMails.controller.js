const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const CartService = require("../services");

const sentAbandonedCartMails = catchAsync(async (req, res) => {
	let result = await CartService.sentAbandonedCartMails();

	if (result?.code === 200) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR : httpStatus.BAD_REQUEST,
			null,
			result?.msg
		);
	}
});

module.exports = sentAbandonedCartMails;
