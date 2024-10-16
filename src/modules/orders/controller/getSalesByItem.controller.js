const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const getSalesByItem = catchAsync(async (req, res) => {
	const { productId } = await pick(req.params, ['productId'])
	let { startDate, endDate, currency = '' } = await pick(req.query, ['startDate', 'endDate', "currency"])

	const currentDate = new Date();
	startDate = startDate ? new Date(startDate) : new Date(currentDate.setDate(currentDate.getDate() - 30));
	endDate = endDate ? new Date(endDate) : new Date();

	let filter = {
		active: true,
		paymentType: "pay360",
		paymentStatus: "paid",
		createdAt: {
			$gte: new Date(startDate.setHours(0, 0, 0, 0)),
			$lte: new Date(endDate.setHours(23, 59, 59, 999)),
		},
		"productDetail.productId": productId,
	};

	if (currency === "GBP") {
		filter["$or"] = [
			{ currency: { $exists: false } },
			{ currency: { $exists: true, $eq: currency } }
		];
	} else if (currency) {
		filter["currency"] = { $exists: true, $eq: currency };
	}

	let result = await orderServices.getSalesByItem(filter, productId)

	if (result.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(res, result?.code === 400 ? httpStatus.BAD_REQUEST
			: result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null, result?.msg);
	}
});

module.exports = getSalesByItem;