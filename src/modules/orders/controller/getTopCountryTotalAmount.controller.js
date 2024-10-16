const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require("../../../utils/helper");

const getTopCountryTotalAmount = catchAsync(async (req, res) => {
	let { fromDate, toDate, currency = "" } = await pick(req.query, ["fromDate", "toDate", "currency"]);

	const currentDate = new Date();
	fromDate = fromDate ? new Date(fromDate) : new Date(currentDate.setDate(currentDate.getDate() - 30));
	toDate = toDate ? new Date(toDate) : new Date();

	let filter = {
		active: true,
		paymentType: "pay360",
		paymentStatus: "paid",
		'shippingAdderess.shippingAddressObj.country':{$exists:true},
		createdAt: {
			$gte: new Date(fromDate.setHours(0, 0, 0, 0)),
			$lte: new Date(toDate.setHours(23, 59, 59, 999)),
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

	let result = await orderServices.getTopCountryTotalAmount(filter);

	if (result.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code === 404
				? httpStatus.NOT_FOUND
				: result?.code === 500
					? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		);
	}
});

module.exports = getTopCountryTotalAmount;
