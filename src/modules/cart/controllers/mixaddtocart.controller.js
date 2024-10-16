const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const addToCartService = require("../services");

const mixaddtocart = catchAsync(async (req, res) => {
	const userId = req.user.id;
	let quant = req?.body?.quantity ? req?.body?.quantity : 1;

	let { productId } = await pick(req.body, ["productId"]);

	let result = await addToCartService.mixaddtocart({
		userId: userId,
		productId,
		quantity: quant,
		productDetail: req?.body?.productDetail,
	});
	if (result?.code === 200) {
		sendResponse(res, httpStatus.OK, result?.data, null);
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
});

module.exports = mixaddtocart;
