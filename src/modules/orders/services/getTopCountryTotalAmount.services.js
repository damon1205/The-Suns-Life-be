const OrderModel = require("../order.model");

const getTopCountryTotalAmount = async (filter) => {
	try {
		const ordersAggregation = [
			{
				$match: filter,
			},
			{
				$addFields: {
					convertedAmountToPay: {
						$divide: [
							"$amountToPay",
							{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
						]
					}
				}
			},
			{
				$group: {
					_id: "$shippingAdderess.shippingAddressObj.country",
					totalAmount: { $sum: "$convertedAmountToPay" },
				},
			},
			{
				$project: {
					_id: 0,
					country: "$_id",
					totalAmount: 1,
				},
			},
			{
				$group: {
					_id: null,
					countryWiseSaleData: { $push: "$$ROOT" },
				},
			},
			{
				$unwind: "$countryWiseSaleData",
			},
			{
				$replaceRoot: { newRoot: "$countryWiseSaleData" },
			},
			{
				$sort: { totalAmount: -1 }, // Sort by totalAmount in descending order
			},
			{
				$group: {
					_id: null,
					countryWiseSaleData: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					_id: 0,
					countryWiseSaleData: 1,
				},
			},
		];

		const orders = await OrderModel.aggregate(ordersAggregation);

		if (orders?.length > 0) {
			return { data: orders, status: true, code: 200 };
		} else {
			return { msg: "No orders", status: false, code: 400 };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getTopCountryTotalAmount;
