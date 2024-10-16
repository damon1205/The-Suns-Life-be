const OrderModel = require("../order.model");

const getStatistics = async (filter) => {
	try {
		const topFiveProducts = await OrderModel.aggregate([
			{
				$unwind: "$productDetail",
			},
			{
				$unwind: '$productDetail.productDetailsObj.categoryArray',
			},
			{
				$match: filter,
			},
			{
				$group: {
					_id: "$productDetail.productId",
					productName: { $last: "$productDetail.productDetailsObj.name" },
					price: { $last: "$productDetail.productDetailsObj.price" },
					discountedSalePrice: { $last: "$productDetail.productDetailsObj.discountedSalePrice" },
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
				},
			},
			{
				$project: {
					_id: 1,
					productId: "$_id",
					productName: 1,
					productImageUrl: 1,
					totalQuantity: 1,
					totalRevenue: 1,
					price: 1,
				},
			},
			{
				$sort: { totalRevenue: -1 }, // Sort by totalRevenue in descending order (highest revenue first)
			},
		]);

		if (topFiveProducts?.length) {
			return {
				data: topFiveProducts,
				status: true,
				code: 200,
			};
		} else {
			return { status: false, code: 404, msg: "No data." };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getStatistics;
