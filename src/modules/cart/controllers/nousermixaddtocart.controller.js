const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const addToCartService = require("../services");

const nousermixaddtocart = catchAsync(async (req, res) => {
	let { productId } = await pick(req.body, ["productId"]);
	let { deviceId } = await pick(req.body, ["deviceId"]);
	let userId = null;

	let result = await addToCartService.nousermixaddtocart({
		userId: null,
		deviceId: deviceId,
		productId,
		productDetail: req?.body?.productDetail,
	});
	if (result?.code === 200) {
		sendResponse(
			res,
			httpStatus.OK,
			{
				data: result?.data,
				message: result?.message,
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

module.exports = nousermixaddtocart;
