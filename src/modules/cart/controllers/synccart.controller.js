const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const CartService = require("../services");

const synccart = catchAsync(async (req, res) => {
	let { deviceId } = await pick(req.body, ["deviceId"]);
	const userId = req.user.id;

	let result = await CartService.synccart({ deviceId: deviceId, userId: userId });

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

module.exports = synccart;
