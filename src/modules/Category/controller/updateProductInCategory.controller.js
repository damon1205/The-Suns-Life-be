const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const catchAsync = require("../../../utils/catchAsync");
const categoryServices = require("../Services");
const { sendResponse } = require("../../../utils/responseHandler");

const updateProductInCatogry = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	const { productId } = req.body;
	
	const product = await categoryServices.updateProductInCatogry(id, { productId });
	if (product.status) {
		sendResponse(res, httpStatus.OK, product.data, null);
	} else {
		if (product.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, product.data);
		} else if (product.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, product.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, product.data);
		}
	}
});

module.exports = updateProductInCatogry;
