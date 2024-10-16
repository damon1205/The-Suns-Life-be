const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const SalesByBrand = catchAsync(async (req, res) => {
	let { startDate, endDate, name = '', currency = '' } = await pick(req.query, [
		"startDate",
		"endDate",
		"name",
		"currency"
	]);

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
	};

	if (currency === "GBP") {
		filter["$or"] = [
			{ currency: { $exists: false } },
			{ currency: { $exists: true, $eq: currency } }
		];
	} else if (currency) {
		filter["currency"] = { $exists: true, $eq: currency };
	}

	let result = await orderServices.SalesByBrand({ filter, name })

	if (result?.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(res,
			result?.code === 404
				? httpStatus.NOT_FOUND
				: result?.code === 500
					? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		)
	}

});

module.exports = SalesByBrand;