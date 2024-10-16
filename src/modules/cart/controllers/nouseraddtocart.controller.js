const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const addToCartService = require("../services");

const nouseraddtocart = catchAsync(async (req, res) => {
	let { productId, deviceId, quantity, variants, cartId } = await pick(req.body, [
		"productId",
		"deviceId",
		"quantity",
		"variants",
		"cartId",
	]);

	let userId = null;

	let data = await addToCartService.nouseraddtocart({
		userId: null,
		deviceId: deviceId,
		productId,
		quantity,
		variants: variants,
		cartId,
	});

	if (data?.code === 200) {
		sendResponse(
			res,
			httpStatus.OK,
			{
				data,
			},
			null
		);
	} else {
		if (data?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, data?.data);
		} else if (data?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, data?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, data?.data);
		}
	}
});

module.exports = nouseraddtocart;
