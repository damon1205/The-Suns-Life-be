const CART_MODEL = require("../cart.model");
const ProductModel = require("../../products/products.model");
const mongoose = require("mongoose");

const mixaddtocart = async (cartData) => {
	try {
		if (cartData) {
			const productObj = await ProductModel.findById({
				_id: mongoose.Types.ObjectId(cartData.productId),
			});

			if (productObj == null) {
				return {
					status: false,
					code: 404,
					msg: "This product not available now, please try after some time.",
				};
			}

			const addResult = await CART_MODEL.create({ ...cartData });

			if (addResult) {
				return {
					data: "Product added to your cart successfully.",
					status: true,
					code: 200,
				};
			}
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = mixaddtocart;
