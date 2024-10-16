const CART_MODEL = require("../cart.model");
const ProductModel = require("../../products/products.model");
const mongoose = require("mongoose");

const nouseraddtocart = async (cartData) => {
	try {
		if (cartData?.variants?.inventory) {
			const productObj = await ProductModel.findById({ _id: mongoose.Types.ObjectId(cartData.productId) });
			if (productObj == null) {
				return {
					status: false,
					code: 404,
					data: "This product not available now, please try after some time.",
				};
			}

			if (
				cartData?.variants?.inventory?.toLowerCase() == "out of stock" ||
				Number(cartData?.variants?.inventory) <= 0
			) {
				return {
					status: false,
					code: 400,
					data: `${productObj?.name} ${
						cartData?.variants?.size
							? "Size" + " " + cartData?.variants?.size
							: "Pots" + " " + cartData?.variants?.pots
					}  is out of stock now, Please choose another variant.`,
				};
			}
			let varaintType;
			let varaintTypetwo;
			if (cartData?.variants) {
				varaintType = cartData?.variants?.size ? "size" : "pots";
				varaintTypetwo = cartData?.variants?.size ? "Size" : "Pots";
			}

			let existingCartItem;
			if (cartData?.cartId) {
				existingCartItem = await CART_MODEL.findOne({
					productId: mongoose.Types.ObjectId(cartData?.productId),
					deviceId: cartData.deviceId,
					_id: mongoose.Types.ObjectId(cartData?.cartId),
				});
			} else {
				let variantQuery = {};
				variantQuery[`variants.${varaintType}`] = cartData?.variants?.[varaintType];

				existingCartItem = await CART_MODEL.findOne({
					productId: mongoose.Types.ObjectId(cartData.productId),
					deviceId: cartData.deviceId,
					...variantQuery,
				});
			}

			let prevVariantofObj = productObj?.variants;
			let varaintType2 = existingCartItem?.variants?.size ? "size" : "pots";
			let varaintTypetwo2 = existingCartItem?.variants?.size ? "Size" : "Pots";
			const matchingObject = prevVariantofObj.find(
				(obj) => obj[varaintType2] === existingCartItem?.variants?.[varaintType2]
			);

			if (existingCartItem) {
				if (Number(matchingObject?.inventory) <= existingCartItem?.quantity) {
					return {
						status: false,
						code: 400,
						data: `${productObj?.name} ${
							" " + existingCartItem?.variants?.[varaintType || varaintType2] + " " + varaintTypetwo ||
							varaintTypetwo2 + " "
						}is out of stock now, only ${matchingObject?.inventory} Items avilable.`,
					};
				}

				if (cartData?.quantity > 0) {
					if (
						Number(matchingObject?.inventory) <
						Number(existingCartItem?.quantity) + Number(cartData?.quantity)
					) {
						return {
							status: false,
							code: 400,
							data: `${productObj?.name} ${
								" " + existingCartItem?.variants?.[varaintType] + " " + varaintTypetwo + " "
							}is out of stock now, only ${matchingObject?.inventory} Items avilable.`,
						};
					}
					existingCartItem.quantity =
						parseInt(existingCartItem.quantity ? existingCartItem.quantity : 0) +
						parseInt(cartData?.quantity);
				} else {
					existingCartItem.quantity += 1;
				}
				await existingCartItem.save();
				return {
					data: "Product added to your cart successfully.",
					status: true,
					code: 200,
				};
			} else {
				let prevVariantofObj = productObj?.variants;

				let varaintType = cartData?.variants?.size ? "size" : "pots";
				let varaintTypetwo = cartData?.variants?.size ? "Size" : "Pots";
				const matchingObject = prevVariantofObj.find(
					(obj) => obj[varaintType] === cartData?.variants?.[varaintType]
				);

				if (Number(matchingObject?.inventory) < Number(cartData?.quantity)) {
					return {
						status: false,
						code: 400,
						data: `${productObj?.name} ${
							" " + cartData?.variants?.[varaintType] + " " + varaintTypetwo + "  "
						} is out of stock now, only ${matchingObject?.inventory} Items avilable.`,
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
		} else {
			const productObj = await ProductModel.findById({ _id: mongoose.Types.ObjectId(cartData.productId) });

			if (productObj == null) {
				return {
					status: false,
					code: 404,
					data: "This product not available now, please try after some time.",
				};
			}
			let existingCartItem;
			let varaintType;
			let varaintTypetwo;
			if (cartData?.variants) {
				varaintType = existingCartItem?.variants?.size ? "size" : "pots";
				varaintTypetwo = existingCartItem?.variants?.size ? "Size" : "Pots";
			}

			if (cartData?.cartId) {
				existingCartItem = await CART_MODEL.findOne({
					productId: mongoose.Types.ObjectId(cartData.productId),
					deviceId: cartData.deviceId,
					_id: mongoose.Types.ObjectId(cartData.cartId),
				});
			} else {
				let variantQuery = {};
				variantQuery[`variants.${varaintType}`] = cartData?.variants?.[varaintType];

				existingCartItem = await CART_MODEL.findOne({
					productId: mongoose.Types.ObjectId(cartData.productId),
					deviceId: cartData.deviceId,
					...variantQuery,
				});
			}

			let prevVariantofObj = productObj?.variants;

			if (productObj?.variants?.length) {
				let varaintType2 = existingCartItem?.variants?.size ? "size" : "pots";
				let varaintTypetwo2 = existingCartItem?.variants?.size ? "Size" : "Pots";
				// Find the object in prevVariantofObj with the same value for both varaintType and variantValue
				const matchingObject = prevVariantofObj.find(
					(obj) => obj[varaintType2] === existingCartItem?.variants?.[varaintType2]
				);

				if (matchingObject) {
					if (
						matchingObject?.inventory?.toLowerCase() !== "out of stock" &&
						Number(matchingObject?.inventory) > 0
					) {
						if (Number(matchingObject?.inventory) <= Number(existingCartItem?.quantity)) {
							return {
								status: false,
								code: 400,
								data: `${productObj?.name} ${
									" " +
										existingCartItem?.variants?.[varaintType || varaintType2] +
										" " +
										varaintTypetwo || varaintTypetwo2 + " "
								}is out of stock now, only ${matchingObject?.inventory} Items avilable.`,
							};
						} else {
							existingCartItem.quantity += 1;
							await existingCartItem.save();
						}
					} else {
						return {
							status: false,
							code: 400,
							data: `${productObj?.name} is out of stock now, please update your cart.`,
						};
					}
				}
			} else {
				if (Number(productObj?.inventory) <= 0 || (productObj?.inventory).toLowerCase() === "out of stock") {
					return {
						status: false,
						code: 400,
						data: `${productObj?.name} is out of stock now, please update your cart.`,
					};
				}
				if (existingCartItem) {
					if (Number(productObj?.inventory) <= Number(existingCartItem.quantity)) {
						return {
							status: false,
							code: 400,
							data: `${productObj?.name} is out of stock now, only ${productObj?.inventory} items available`,
						};
					} else {
						if (cartData?.quantity > 0) {
							if (
								Number(cartData?.inventory) <=
								Number(existingCartItem.quantity) + Number(cartData?.quantity)
							) {
								return {
									status: false,
									code: 400,
									data: `${productObj?.name} is out of stock now, only ${productObj?.inventory} items available`,
								};
							} else {
								existingCartItem.quantity =
									parseInt(existingCartItem.quantity ? existingCartItem.quantity : 0) +
									parseInt(cartData?.quantity);
							}
						} else {
							existingCartItem.quantity += 1;
						}
						await existingCartItem.save();

						return {
							data: "Product added to your cart successfully.",
							status: true,
							code: 200,
						};
					}
				} else {
					if (Number(productObj?.inventory) < Number(cartData?.quantity)) {
						return {
							status: false,
							code: 400,
							data: `${productObj?.name} is out of stock now, only ${productObj?.inventory} Items avilable.`,
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
			}
		}
	} catch (error) {
		return { status: false, code: 500, data: error };
	}
};

module.exports = nouseraddtocart;
