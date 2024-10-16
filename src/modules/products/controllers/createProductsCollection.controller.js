const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const products = require('../../../databaseJson/products.json')
const productsWithAwsUrl = require('../../../databaseJson/productsWithAwsUrl.json')

const createProductsCollection = catchAsync(async (req, res) => {
	if (products.length) {
		let newProducts = [];
		for (let i = 0; i < products?.length; i++) {
			let currentProduct = products[i];

			if (currentProduct?.fieldType === 'Product') {
				let obj = {}
				if (currentProduct?.handleId) {
					obj['handleId'] = currentProduct?.handleId
				}
				if (currentProduct?.fieldType) {
					obj['fieldType'] = currentProduct?.fieldType
				}
				if (currentProduct?.name) {
					obj['name'] = currentProduct?.name
				}
				if (currentProduct?.name && currentProduct?.name=="Premium Pick 'n' Mix - 10 Pots") {
					obj['pots'] = "10"
					obj['perpotprice'] = "100"
				}
				if (currentProduct?.name && currentProduct?.name=="Premium Pick 'n' Mix - 5 Pots") {
					obj['pots'] = "5"
					obj['perpotprice'] = "100"
				}
				if (currentProduct?.name && currentProduct?.name=="Pick 'n' Mix - 10 pots") {
					obj['pots'] = "10"
					obj['perpotprice'] = "5.99"
				}
				if (currentProduct?.name && currentProduct?.name=="Pick 'n' Mix - 5 pots") {
					obj['pots'] = "5"
					obj['perpotprice'] = "4.99"
				}
				if (currentProduct?.description) {
					obj['description'] = currentProduct?.description
				}
				if (currentProduct?.productImageUrl) {
					obj['productImageUrl'] = currentProduct?.productImageUrl
				}
				if (currentProduct?.collection) {
					obj['collection'] = currentProduct?.collection
				}
				if (currentProduct?.price) {
					obj['price'] = currentProduct?.price
				}
				if (currentProduct?.price) {
					obj['originalPrice'] = currentProduct?.price
				}
				if (currentProduct?.visible) {
					obj['visible'] = Boolean(currentProduct?.visible)
				}
				if (currentProduct?.discountMode) {
					obj['discountMode'] = currentProduct?.discountMode
				}
				if (currentProduct?.discountValue) {
					obj['discountValue'] = currentProduct?.discountValue
				}
				if (currentProduct?.inventory) {
					obj['inventory'] = String(currentProduct?.inventory)
				}
				if (currentProduct?.weight) {
					obj['weight'] = currentProduct?.weight
				}
				if (currentProduct?.cost) {
					obj['cost'] = currentProduct?.cost
				}
				if (currentProduct?.brand) {
					obj['brand'] = String(currentProduct?.brand)
				}

				newProducts.push(obj)
			}
		}
		// console.log(products.length)
		// console.log(newProducts.length)
		for (const item1 of newProducts) {
			for (const item2 of productsWithAwsUrl) {
				if (item1.name === item2.name) {
					if (item2.productImageUrl) {
						item1.productImageUrl = item2.productImageUrl;
					}
				}
			}
		}

		let addResponse = await productsServices.createProductsCollection(newProducts)
		if (addResponse?.status) {
			sendResponse(res, httpStatus.OK, addResponse?.data, null);
			return
		} else {
			sendResponse(res,
				addResponse?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
				addResponse?.msg,
				null);
			return
		}
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `Products Array Is Empty!`);
		return
	}
});

module.exports = createProductsCollection;