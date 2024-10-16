const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const addToCartService = require("../services");

const addToCartController = catchAsync(async (req, res) => {
	const userId = req.user.id;
	let quant = req?.body?.quantity ? req?.body?.quantity : 1;

	let { productId, variants, cartId } = await pick(req.body, ["productId", "variants", "cartId"]);

	let result = await addToCartService.addToCart({
		userId: userId,
		productId,
		quantity: quant,
		variants: variants,
		cartId: cartId,
	});

	if (result?.code === 200) {
		sendResponse(res, httpStatus.OK, result, null);
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
			result?.data
		);
	}
});

module.exports = addToCartController;
