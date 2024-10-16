const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const CartService = require("../services");

const getMyCartController = catchAsync(async (req, res) => {
	const userId = req.user.id;

	let result = await CartService.getMyCart(userId);

	if (result?.code === 200) {
		sendResponse(
			res,
			httpStatus.OK,
			{
				data: result?.data,
				totalItems: result?.totalItems,
			},
			null
		);
	} else {
		if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	}
});

module.exports = getMyCartController;
