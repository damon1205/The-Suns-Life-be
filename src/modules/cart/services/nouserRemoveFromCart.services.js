const mongoose = require("mongoose");
const CART_MODEL = require("../cart.model");

const nouserRemoveFromCart = async (cartData) => {
	try {
		let existingCartItem;
		if (cartData?.cartId) {
			existingCartItem = await CART_MODEL.findOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				deviceId: cartData.deviceId,
				_id: mongoose.Types.ObjectId(cartData.cartId),
			});
		} else {
			existingCartItem = await CART_MODEL.findOne({
				productId: mongoose.Types.ObjectId(cartData.productId),
				deviceId: cartData.deviceId,
			});
		}

		if (existingCartItem) {
			if (existingCartItem.quantity > 1) {
				existingCartItem.quantity -= 1;
				cartItem = await existingCartItem.save();
				return {
					data: cartItem,
					status: true,
					code: 200,
				};
			} else {
				await existingCartItem.remove();
				return {
					data: "Product removed from cart successfully!",
					status: true,
					code: 200,
				};
			}
		} else {
			throw new Error("Cart item not found");
		}
	} catch (error) {
		throw new Error(`Failed to remove item from cart: ${error.message}`);
	}
};

module.exports = nouserRemoveFromCart;
