const CART_MODEL = require("../cart.model");
const mongoose = require("mongoose");

const synccart = async (cartData) => {
	try {
		if (cartData) {
			const existingCartItem = await CART_MODEL.find({
				deviceId: cartData.deviceId,
				userId: null,
				isActive: true,
			});
			for (const item of existingCartItem) {
				const existingUserCartItem = await CART_MODEL.findOne({
					productId: mongoose.Types.ObjectId(item.productId),
					userId: mongoose.Types.ObjectId(cartData.userId),
				});
				if (
					existingUserCartItem &&
					item?.productDetail?.length === 0 &&
					Object.keys(item?.variants)?.length === 0
				) {
					existingUserCartItem.deviceId = null;
					existingUserCartItem.quantity = parseInt(existingUserCartItem.quantity) + parseInt(item.quantity);
					await item.remove();
					await existingUserCartItem.save();
				} else if (existingUserCartItem && item?.productDetail?.length !== 0) {
					const xIds = existingUserCartItem?.productDetail[0]?.subProduct.map((subItem) => subItem.productId);
					const yIds = item?.productDetail[0]?.subProduct.map((subItem) => subItem.productId);
					// Check if all productIds in existingUserCartItem are present in item and vice versa
					const allMatch = xIds.length === yIds.length && xIds.every((id) => yIds.includes(id));
					if (allMatch) {
						existingUserCartItem.deviceId = null;
						existingUserCartItem.quantity =
							parseInt(existingUserCartItem.quantity) + parseInt(item.quantity);
						await item.remove();
						await existingUserCartItem.save();
					} else {
						item.userId = cartData?.userId;
						item.isActive = false;
						item.deviceId = null;
						await item.save();
					}
				} else if (existingUserCartItem && Object.keys(item?.variants)?.length !== 0) {
					const xVariants = existingUserCartItem.variants;
					const zVariants = item.variants;

					// Check if either (size is empty and pots match) or (pots is empty and size match)
					if (
						(xVariants.size === "" && zVariants.size === "" && xVariants.pots === zVariants.pots) ||
						(xVariants.pots === "" && zVariants.pots === "" && xVariants.size === zVariants.size)
					) {
						existingUserCartItem.deviceId = null;
						existingUserCartItem.quantity =
							parseInt(existingUserCartItem.quantity) + parseInt(item.quantity);
						await item.remove();
						await existingUserCartItem.save();
					} else {
						item.userId = cartData?.userId;
						item.isActive = false;
						item.deviceId = null;
						await item.save();
					}
				} else {
					item.userId = cartData?.userId;
					item.isActive = false;
					item.deviceId = null;
					await item.save();
				}
			}
			return {
				data: existingCartItem,
				message: "Product added to Cart Successfully!",
				status: true,
				code: 200,
			};
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = synccart;
