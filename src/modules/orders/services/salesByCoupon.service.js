const OrdersModel = require("./../order.model");

const salesByCoupon = async (filter, sort) => {
	try {
		let fromDate;
		let toDate;
		let filterQuery
		if (filter == null) {
			fromDate = new Date()
			fromDate.setDate(fromDate.getDate() - 30);
			toDate = new Date()
			toDate.setHours(0, 0, 0, 0)
		} else {
			fromDate = new Date(filter.fromdate).setHours(0, 0, 0, 0);
			toDate = new Date(filter.todate).setHours(23, 59, 59, 999);
		}
		filterQuery = {
			active: true,
			paymentType: "pay360",
			paymentStatus: "paid",
			couponId: { $exists: true, $ne: null },
			createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
		};

		if (filter?.currency === "GBP") {
			filterQuery["$or"] = [
				{ currency: { $exists: false } },
				{ currency: { $exists: true, $eq: filter?.currency } }
			]
		} else if(filter?.currency) {
			filterQuery["currency"] = { $exists: true, $eq: filter?.currency}
		}

		let sortQuery = { _id: -1 };

		if (sort != null) {
			for (let key in sort) {
				if (sort.hasOwnProperty(key)) {
					let value = sort[key];
					let numericValue = Number(value);
					if (!isNaN(numericValue)) {
						sort[key] = numericValue;
					}
				}
			}
			sortQuery = sort;
		}

		const aggregateQuery = [
			{
			  $match: filterQuery,
			},
			{
			  $addFields: {
				convertedAmountToPay: {
				  $divide: [
					"$amountToPay",
					{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
				  ]
				},
				convertedCouponDiscount: {
				  $divide: [
					"$couponDiscount",
					{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
				  ]
				}
			  }
			},
			{
			  $group: {
				_id: "$couponId",
				couponType: { $first: "$couponType" },
				couponName: { $first: "$couponName" },
				totalCouponDiscount: { $sum: "$convertedCouponDiscount" },
				totalOrders: { $sum: 1 },
				totalSales: { $sum: "$convertedAmountToPay" },
				date: { $first: "$createdAt" },
				currency: { $first: "$currency" },
				currencyRate: { $first: "$currencyRate" },
			  },
			},
			{
			  $project: {
				_id: 0,
				couponId: "$_id",
				couponType: 1,
				couponName: 1,
				currency: 1,
				currencyRate: 1,
				totalCouponDiscount: { $round: ["$totalCouponDiscount", 2] },
				totalOrders: 1,
				totalSales: { $round: ["$totalSales", 2] },
				averageOrderValue: { $round: [{ $divide: ["$totalSales", "$totalOrders"] }, 2] },
			  },
			},
			{
			  $sort: sortQuery,
			},
		  ];
		  

		let result = await OrdersModel.aggregate(aggregateQuery);
		if (result.length) {
			const totalOrdersApplied = await OrdersModel.find(filterQuery, { _id: 1, orderId: '$_id', couponId: 1, couponName: 1 }, { sort: { _id: -1 } });
			return {
				data: result,
				totalOrdersApplied,
				status: true,
				code: 200,
			};
		} else {
			return { status: false, code: 400, msg: "No orders match." };
		}
	} catch (error) {
		console.log("Error while getting orders:", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = salesByCoupon;