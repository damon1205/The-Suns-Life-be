

const mongoose = require("mongoose");

const trasactionModel = require('../transaction.model');
const ProductModel = require("../../products/products.model")
const momemt = require("moment");

const addTransaction = async (transactionDeta) => {
	console.log("transactionDate--", momemt().format())
	console.log("transactionDeta--", transactionDeta)
	try {

		for (let i = 0; i < transactionDeta?.productDetail.length; i++) {
			let currentProduct = transactionDeta?.productDetail[i];
			let productRes = await ProductModel.findOne({
				_id: mongoose.Types.ObjectId(currentProduct?.productId),
				active: true
			})
			if (currentProduct?.productDetailsObj?.selectedVariant && productRes?.variants?.length) {
				let variant = currentProduct?.productDetailsObj?.selectedVariant;
				let variantType = variant?.pots ? "pots" : variant?.size ? "size" : null;

				if (variantType) {
					let variantValue = variant[variantType];

					let productVariant = productRes.variants.find(
						v => v[variantType] === variantValue
					);

					if (productVariant) {
						if (productVariant.inventory.trim() === '0' || productVariant.inventory.trim().toLowerCase() === 'out of stock') {
							return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
						} else if (Number(productVariant.inventory) < currentProduct.quantity) {
							return { msg: `Item name ${productRes.name} has ${productVariant.inventory} items left in stock`, status: false, code: 400 };
						} else if (productVariant.inventory !== "InStock" && Number(productVariant.inventory) >= currentProduct.quantity) {
							let deductInventory = String(Number(productVariant.inventory) - currentProduct.quantity);
						}
					}
				}
			} else if (currentProduct?.subProduct?.length) {
				for (let subProduct of currentProduct?.subProduct) {
					let subProductRes = await ProductModel.findOne({
						_id: mongoose.Types.ObjectId(subProduct?.productId),
						active: true
					})
					if (subProductRes?.inventory.trim() === '0' || subProductRes?.inventory.trim().toLowerCase() === 'out of stock') {
						return { msg: `${subProductRes.name} is out of stock.`, status: false, code: 400 };
					} else if (Number(subProductRes?.inventory) < subProduct.quantity) {
						return { msg: `Item name ${subProductRes.name} has ${subProductRes?.inventory} items left in stock.`, status: false, code: 400 };
					} else if (subProductRes.inventory !== "InStock" && Number(subProductRes.inventory) >= subProduct.quantity) {
						let deductInventory = String(Number(subProductRes.inventory) - subProduct.quantity);
					}
				}
			} else {
				if (productRes?.inventory.trim() === '0' || productRes?.inventory.trim().toLowerCase() === 'out of stock') {
					return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
				} else if (Number(productRes?.inventory) < currentProduct.quantity) {
					return { msg: `Item name ${productRes.name} has ${productRes?.inventory} items left in stock.`, status: false, code: 400 };
				} else if (productRes.inventory !== "InStock" && Number(productRes.inventory) >= currentProduct.quantity) {
					let deductInventory = String(Number(productRes.inventory) - currentProduct.quantity);
				}
			}
		}
		let payload = {
			userId: mongoose.Types.ObjectId(transactionDeta?.userId),
			productDetail: transactionDeta?.productDetail,
			paymentMode: transactionDeta?.paymentMode,
			paymentStatus: transactionDeta?.paymentStatus,
			shippingAdderess: transactionDeta?.shippingAdderess,
			deliveryMethod: transactionDeta?.deliveryMethod,
			amountToPay: transactionDeta?.amountToPay,
			deliveryCharge: transactionDeta?.deliveryCharge,
			vatCharge: transactionDeta?.vatCharge,
			currency: transactionDeta?.currency,
			currencyRate: transactionDeta?.currencyRate,
			couponId: transactionDeta?.couponId,
			couponType: transactionDeta?.couponType,
			couponName: transactionDeta?.couponName,
			couponDiscount: transactionDeta?.couponDiscount,
		}

		const addResult = await trasactionModel.create({ ...payload });

		if (addResult) {
			return { data: addResult, status: true, code: 200 };
		} else {
			return { msg: "Something went wrong, please try again", status: false, code: 400 };
		}


	} catch (error) {
		return { status: false, code: 500, msg: error.message }
	}
};

module.exports = addTransaction