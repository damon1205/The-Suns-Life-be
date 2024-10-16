const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");

const getStatistics = catchAsync(async (req, res) => {
	let { fromDate, toDate, currency = '', country = [] } = await pick(req.query, ['fromDate', 'toDate', 'currency', 'country'])

	const currentDate = new Date();
	fromDate = fromDate ? new Date(fromDate) : new Date(currentDate.setDate(currentDate.getDate() - 30));
	toDate = toDate ? new Date(toDate) : new Date();

	let filterQuery = {
		active: true,
		paymentType: "pay360",
		paymentStatus: "paid",
		createdAt: {
			'$gte': new Date(fromDate.setHours(0, 0, 0, 0)),
			'$lte': new Date(toDate.setHours(23, 59, 59, 999))
		}
	};

	if (currency === "GBP") {
		filterQuery["$or"] = [
			{ currency: { $exists: false } },
			{ currency: { $exists: true, $eq: currency } }
		]
	} else if (currency) {
		filterQuery["currency"] = { $exists: true, $eq: currency }
	}

	let countryArray = JSON.parse(country);
	const countriesToExclude = ["USA", "Canada", "United States", "CAN", 'AUS', 'Australia', 'New Zealand', 'NZL'];

	if (countryArray.includes("United Kingdom")) {
		filterQuery['shippingAdderess.shippingAddressObj.country'] = { $nin: countriesToExclude };
	} else if (countryArray?.length > 0) {
		filterQuery['shippingAdderess.shippingAddressObj.country'] = { $in: countryArray };
	}

	let result = await orderServices.getStatistics({ fromDate, toDate, filterQuery, currency, country });

	if (result.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(res, result?.code === 404 ? httpStatus.NOT_FOUND
			: result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null, result?.msg);
	}
});

module.exports = getStatistics;
