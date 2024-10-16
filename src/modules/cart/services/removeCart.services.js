const mongoose = require("mongoose");
const CART_MODEL = require("../cart.model");

const removeCartservice = async (cartData) => {
	try {
		let existingCartItem;
		if (cartData?.cartId) {
			existingCartItem = await CART_MODEL.deleteOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				userId: mongoose.Types.ObjectId(cartData.userId),
				_id: mongoose.Types.ObjectId(cartData.cartId),
			});
		} else {
			existingCartItem = await CART_MODEL.deleteOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				userId: mongoose.Types.ObjectId(cartData.userId),
			});
		}

		if (existingCartItem) {
			return {
				data: "Product removed from cart successfully!",
				status: true,
				code: 200,
			};
		} else {
			return { data: "Product Not Found", status: false, code: 401 };
		}
	} catch (error) {
		throw new Error(`Failed to remove item from cart: ${error.message}`);
	}
};

module.exports = removeCartservice;
