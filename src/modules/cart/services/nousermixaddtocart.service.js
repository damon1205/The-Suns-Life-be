const CART_MODEL = require("../cart.model");
const PURCHASE = require("../../products/products.model");

const nousermixaddtocart = async (cartData) => {
	try {
		if (cartData) {
			cartData["isActive"] = true;

			const Purchase_found = await PURCHASE.findById(cartData.productId);

			if (!Purchase_found) {
				return {
					status: false,
					msg: "Could not find the product",
				};
			} else {
				const addResult = await CART_MODEL.create({ ...cartData });

				if (addResult) {
					return {
						data: addResult,
						message: "Product added to Cart Successfully!",
						status: true,
						code: 200,
					};
				}
			}
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = nousermixaddtocart;
