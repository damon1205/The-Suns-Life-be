const CART_MODEL = require("../cart.model");
const COUPON_MODEL = require("../../coupons/coupons.model");
const mongoose = require("mongoose");

const getMyCart = async (userId) => {
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
		result?.forEach((cartItem) => {
			if (cartItem?.variants) {
				cartItem?.productDetails[0]?.variants?.forEach((variant) => {
					if (
						(variant?.pots && variant?.pots === cartItem?.variants?.pots) ||
						(variant?.size && variant?.size === cartItem?.variants?.size)
					) {
						cartItem.productDetails[0].price = variant?.price;
						cartItem.productDetails[0].originalPrice = variant?.price;
						cartItem.productDetails[0].selectedVariant = variant;
					}
				});
			}
		});

		let auto_discount = false;
		if (result) {
			const coupons = await COUPON_MODEL.find({
				type: "automatic_discount",
				active: true,
				start_date: { $lte: new Date() },
				$or: [{ is_expiry_date: false }, { expiry_date: { $gte: new Date() } }],
			});
			for (let coupon of coupons) {
				for (let cartItem of result) {
					let productIds = coupon?.specific_products_automatic
						? coupon.specific_products_automatic.map((id) => id.toString())
						: [];
					let productId = cartItem?.productDetails[0]?._id ? cartItem?.productDetails[0]?._id.toString() : "";

					if (productIds.includes(productId) && cartItem?.quantity >= coupon?.min_qty) {
						cartItem.couponName = coupon?.name;
						cartItem.sale_price = coupon.sale_price;
						auto_discount = true;
					}
				}
			}
			return {
				data: {
					cart: result,

					auto_discount: auto_discount,
				},
				totalItems: result.length,
				status: true,
				code: 200,
			};
		} else {
			return { data: "Product not found", status: false, code: 400 };
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = getMyCart;
