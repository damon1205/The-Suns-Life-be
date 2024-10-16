const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const CartService = require("../services");

const checkProductAvailable = catchAsync(async (req, res) => {
	const userId = req.user?.id || null;
	if (userId !== null) {
		let result = await CartService.checkProductAvailable(userId);
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
			sendResponse(
				res,
				result?.code === 400
					? httpStatus.BAD_REQUEST
					: result?.code === 404
					? httpStatus.NOT_FOUND
					: result?.code === 500
					? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
				null,
				result?.msg
			);
		}
	}
});

module.exports = checkProductAvailable;
