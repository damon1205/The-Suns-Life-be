const mongoose = require("mongoose");
const CART_MODEL = require("../cart.model");

const nouserRemoveCart = async (cartData) => {
	try {
		let existingCartItem;
		if (cartData?.cartId) {
			existingCartItem = await CART_MODEL.deleteOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				deviceId: cartData.deviceId,
				_id: mongoose.Types.ObjectId(cartData.cartId),
			});
		} else {
			existingCartItem = await CART_MODEL.deleteOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				deviceId: cartData.deviceId,
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

module.exports = nouserRemoveCart;
