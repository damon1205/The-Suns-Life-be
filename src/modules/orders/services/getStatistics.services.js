const OrderModel = require('../order.model');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

const getStatistics = async ({ fromDate, toDate, filterQuery, currency, country }) => {
	try {
		const localTimeZone = momentTimezone.tz.guess();

		const aggregateSalesData = async (matchQuery) => {
			const pipeline = [
				{ $match: matchQuery },
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
						_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: localTimeZone } },
						dailytotalSales: { $sum: "$convertedAmountToPay" },
						totalOrders: { $sum: 1 },
						averageValue: { $avg: "$convertedAmountToPay" }
					}
				},
				{ $sort: { _id: 1 } }
			];

			return await OrderModel.aggregate(pipeline);
		};

		const calculateTotal = (aggregates) => {
			return aggregates.reduce((totals, item) => {
				totals.totalSales += Number(item.dailytotalSales) || 0;
				totals.totalOrders += Number(item.totalOrders) || 0;
				return totals;
			}, { totalSales: 0, totalOrders: 0 });
		};

		const getCountAndSales = async (date) => {
			const start = new Date(date.setHours(0, 0, 0, 0));
			const end = new Date(date.setHours(23, 59, 59, 999));

			let filterQueryDay = {
				paymentStatus: "paid",
				active: true,
				paymentType: "pay360",
				createdAt: { '$gte': start, '$lte': end }
			}

			if (currency === "GBP") {
				filterQueryDay["$or"] = [
					{ currency: { $exists: false } },
					{ currency: { $exists: true, $eq: currency } }
				]
			} else if (currency) {
				filterQueryDay["currency"] = { $exists: true, $eq: currency }
			}

			let countryArray = JSON.parse(country);
			const countriesToExclude = ["USA", "Canada", "United States", "CAN", 'AUS', 'Australia', 'New Zealand', 'NZL'];

			if (countryArray.includes("United Kingdom")) {
				filterQueryDay['shippingAdderess.shippingAddressObj.country'] = { $nin: countriesToExclude };
			} else if (countryArray?.length > 0) {
				filterQueryDay['shippingAdderess.shippingAddressObj.country'] = { $in: countryArray };
			}

			const ordersCount = await OrderModel.countDocuments(filterQueryDay);

			const salesData = await OrderModel.aggregate([
				{ $match: filterQueryDay },
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
						_id: null,
						totalSales: { $sum: "$convertedAmountToPay" }
					}
				}
			]);

			const totalSales = salesData[0]?.totalSales || 0;
			return { ordersCount, totalSales };
		};

		const currentDate = new Date();
		const previousDate = new Date(currentDate);
		previousDate.setDate(currentDate.getDate() - 1);

		const dailyAggregates = await aggregateSalesData(filterQuery);
		const { totalSales: price, totalOrders: sumOfTotalOrders } = calculateTotal(dailyAggregates);

		const { ordersCount: todayOrders, totalSales: todaySale } = await getCountAndSales(new Date());
		const { ordersCount: yesterdayOrders, totalSales: yesterdaySale } = await getCountAndSales(new Date(previousDate));

		const durationInDays = (new Date(toDate) - new Date(fromDate)) / (24 * 60 * 60 * 1000) || 1;
		const newStartDate = moment(fromDate).subtract(durationInDays, 'days').format('YYYY-MM-DD');

		const filterQueryPrev = {
			paymentStatus: "paid",
			active: true,
			paymentType: "pay360",
			createdAt: {
				'$gte': new Date(new Date(newStartDate).setHours(0, 0, 0, 0)),
				'$lte': new Date(new Date(fromDate).setHours(0, 0, 0, 0))
			}
		};

		if (currency === "GBP") {
			filterQueryPrev["$or"] = [
				{ currency: { $exists: false } },
				{ currency: { $exists: true, $eq: currency } }
			]
		} else if (currency) {
			filterQueryPrev["currency"] = { $exists: true, $eq: currency }
		}

		let countryArray = JSON.parse(country);
		const countriesToExclude = ["USA", "Canada", "United States", "CAN", 'AUS', 'Australia', 'New Zealand', 'NZL'];

		if (countryArray.includes("United Kingdom")) {
			filterQueryPrev['shippingAdderess.shippingAddressObj.country'] = { $nin: countriesToExclude };
		} else if (countryArray?.length > 0) {
			filterQueryPrev['shippingAdderess.shippingAddressObj.country'] = { $in: countryArray };
		}

		const prevAggregates = await aggregateSalesData(filterQueryPrev);
		const { totalSales: prevPrice, totalOrders: prevTotalOrder } = calculateTotal(prevAggregates);

		if (dailyAggregates?.length) {
			return {
				data: {
					prevTotalPrice: Number(prevPrice.toFixed(2)),
					prevTotalOrders: prevTotalOrder,
					totalSales: Number(price.toFixed(2)) || 0,
					totalOrders: sumOfTotalOrders || 0,
					averageValue: sumOfTotalOrders > 0 ? Number((price / sumOfTotalOrders).toFixed(2)) : 0,
					todayOrders: todayOrders || 0,
					todaySales: Number(todaySale.toFixed(2)) || 0,
					yesterdayOrders: yesterdayOrders || 0,
					yesterdaySales: yesterdaySale,
					dailyData: dailyAggregates,
				},
				status: true,
				code: 200
			};
		}
		else {
			return { msg: null, status: false, code: 400 }
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getStatistics;