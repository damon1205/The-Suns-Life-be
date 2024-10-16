const CART_MODEL = require("../cart.model");
const mongoose = require("mongoose");

const checkProductAvailable = async (userId) => {
	try {
		const filterQuery = {
			userId: mongoose.Types.ObjectId(userId),
		};

		const customPipeline = [
			{
				$match: filterQuery,
			},

			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "userDetail",
				},
			},
			{
				$unwind: {
					path: "$userId",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					"userDetail.password": 0,
				},
			},
			{
				$lookup: {
					from: "products",
					localField: "productId",
					foreignField: "_id",
					as: "productDetails",
				},
			},
			{
				$unwind: {
					path: "$product",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: filterQuery,
			},
		];

		const result = await CART_MODEL.aggregate(customPipeline);

		if (result.length) {
			let outOfStock = null;

			for (let i = 0; i < result?.length; i++) {
				let item = result[i];
				const inventory = item?.productDetails[0]?.inventory;
				if (inventory === "0") {
					outOfStock = { status: false, code: 400, msg: `${item?.productDetails[0]?.name} is out of stock.` };
					break;
				}
			}
			if (outOfStock != null) {
				return outOfStock;
			} else {
				return {
					data: result,
					totalItems: result.length,
					status: true,
					code: 200,
				};
			}
		} else {
			return { msg: "Product not found in your cart", status: false, code: 400 };
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: "Something went wrong" };
	}
};

module.exports = checkProductAvailable;
