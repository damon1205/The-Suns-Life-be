const OrderModel = require("../order.model");

const getSalesByItem = async (filter, productId) => {
	try {
		let dailyData = [];

		const orders = await OrderModel.find(filter);

		if (!orders.length) {
			return { msg: "No orders", status: false, code: 404 };
		}

		orders.forEach((order) => {
			order.productDetail.forEach((cv) => {
				if (productId === cv.productId) {
					let data = {};
					data.price = (cv?.productDetailsObj?.discountedSalePrice > 0 ?
						cv?.productDetailsObj?.discountedSalePrice
						: cv.productDetailsObj.price);
					data.totalQuantity = cv.quantity;
					data.userId = order.userId;

					const orderDate = order.createdAt.toISOString().split("T")[0];
					const existingDailyDataIndex = dailyData.findIndex((item) => item.date === orderDate);

					if (existingDailyDataIndex !== -1) {
						const existingUserIndex = dailyData[existingDailyDataIndex].data.findIndex(
							(item) => item.userId === order.userId
						);
						if (existingUserIndex !== -1) {
							dailyData[existingDailyDataIndex].data[existingUserIndex].totalQuantity += cv.quantity;
						} else {
							dailyData[existingDailyDataIndex].data.push(data);
						}
					} else {
						data.date = orderDate;
						dailyData.push({
							data: data,
						});
					}
				}
			});
		});

		const resultTodayData = [];

		if (dailyData.length) {
			dailyData.forEach((item) => {
				const { userId, date, totalQuantity, price } = item.data;
				const existingEntry = resultTodayData.find(entry => JSON.stringify(entry.userId) === JSON.stringify(userId));

				if (existingEntry) {
					existingEntry.totalQuantity += totalQuantity;
					existingEntry.totalCustomers += 1;
					existingEntry.totalPrice += price;
					existingEntry.averagePrice = existingEntry.totalPrice / existingEntry.totalCustomers;
				} else {
					resultTodayData.push({
						date: date,
						totalQuantity: totalQuantity,
						totalPrice: price,
						averagePrice: price,
						userId: userId,
						totalCustomers: 1,
					});
				}
			});
		}

		resultTodayData.forEach(entry => {
			entry.averagePrice = entry.totalPrice / entry.totalCustomers;
		});


		const productData = await OrderModel.aggregate([
			{
				$unwind: "$productDetail",
			},
			{
				$match: filter
			},
			{
				$group: {
					_id: "$productDetail.productId",
					productName: { $last: "$productDetail.productDetailsObj.name" },
					productImageUrl: { $last: "$productDetail.productDetailsObj.productImageUrl" },
					totalQuantity: { $sum: "$productDetail.quantity" },
					totalRevenue: {
						$sum: {
							$multiply: [
								"$productDetail.quantity",
								{
									$cond: {
										if: { $gt: ["$productDetail.productDetailsObj.discountedSalePrice", 0] },
										then: "$productDetail.productDetailsObj.discountedSalePrice",
										else: "$productDetail.productDetailsObj.price"
									}
								},
								// {
								// 	$cond: {
								// 		if: '$currencyRate',
								// 		then: '$currencyRate',
								// 		else: 1
								// 	}
								// }
							]
						},
					},
					uniqueUserIds: { $addToSet: "$userId" }, // New field to store unique userIds
				},
			},

			{
				$project: {
					_id: 0,
					productId: "$_id",
					productName: 1,
					productImageUrl: 1,
					totalQuantity: 1,
					totalRevenue: 1,
					totalCustomers: { $size: "$uniqueUserIds" }, // Calculate the count of unique userIds
					uniqueUserIds: 1,
				},
			},
			{
				$sort: { totalRevenue: -1 }, // Sort by totalRevenue in descending order (highest revenue first)
			},
			/* {
				$limit: 5,
			}, */
		]);

		return {
			data: { productData, resultTodayData },
			status: true,
			code: 200,
		};
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getSalesByItem;
