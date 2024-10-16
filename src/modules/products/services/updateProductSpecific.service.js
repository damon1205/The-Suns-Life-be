const mongoose = require('mongoose');
const ProductModel = require('../products.model');
const NotifyModel = require('../../notify/notifyProduct.model')
const CategoryModel = require('../../Category/category.modal')
const emailServices = require('../../../utils/emailservice')
const categoryServices = require('../../Category/Services');
const updateProductCategoryFromProduct = require('../../Category/Services/updateProductCategoryFromProduct.service');


const updateSeries = async (productId, updateData) => {
	
	try {
	
		let dataToUpdate = {}
		if (updateData?.hasOwnProperty('productType')) dataToUpdate = { ...dataToUpdate, productType: String(updateData?.productType).trim() }
		if (updateData?.hasOwnProperty('name')) dataToUpdate = { ...dataToUpdate, name: String(updateData?.name).trim() }
		if (updateData?.hasOwnProperty('visible')) dataToUpdate = { ...dataToUpdate, visible: Boolean(updateData?.visible) }
		if (updateData?.hasOwnProperty('isFeatured')) dataToUpdate = { ...dataToUpdate, isFeatured: Boolean(updateData?.isFeatured) }
		if (updateData?.hasOwnProperty('price')) dataToUpdate = { ...dataToUpdate, price: Number(updateData?.price) }
		if (updateData?.hasOwnProperty('productImageUrl')) dataToUpdate = { ...dataToUpdate, productImageUrl: String(updateData?.productImageUrl).trim() }
		if (updateData?.hasOwnProperty('imageAltText')) dataToUpdate = { ...dataToUpdate, imageAltText: String(updateData?.imageAltText).trim() }
		if (updateData?.hasOwnProperty('flavor')) dataToUpdate = { ...dataToUpdate, flavor: String(updateData?.flavor).trim() }
		if (updateData?.hasOwnProperty('weight')) dataToUpdate = { ...dataToUpdate, weight: Number(updateData?.weight) }
		if (updateData?.hasOwnProperty('strength')) dataToUpdate = { ...dataToUpdate, strength: Number(updateData?.strength) }
		if (updateData?.hasOwnProperty('cost')) dataToUpdate = { ...dataToUpdate, cost: Number(updateData?.cost) }

		if (updateData?.hasOwnProperty('inventory')) dataToUpdate = { ...dataToUpdate, inventory: String(updateData?.inventory).trim() }

		if (updateData?.hasOwnProperty('subImages')) dataToUpdate = { ...dataToUpdate, subImages: updateData?.subImages }

		if (updateData?.hasOwnProperty('description')) dataToUpdate = { ...dataToUpdate, description: String(updateData?.description) }
		if (updateData?.hasOwnProperty('features')) dataToUpdate = { ...dataToUpdate, features: String(updateData?.features) }

		if (updateData?.hasOwnProperty('variants')) dataToUpdate = { ...dataToUpdate, variants: updateData?.variants }
		// if (updateData?.hasOwnProperty('categoryArray')) dataToUpdate = { ...dataToUpdate, categoryArray: Array(updateData?.categoryArray) }

		if (updateData?.hasOwnProperty('prioritizedBrand')) dataToUpdate = { ...dataToUpdate, prioritizedBrand: Number(updateData?.prioritizedBrand) }

		if (updateData?.hasOwnProperty('vatCharge')) dataToUpdate = { ...dataToUpdate, vatCharge: Number(updateData?.vatCharge) }
		if (updateData?.hasOwnProperty('vatApplicable')) dataToUpdate = { ...dataToUpdate, vatApplicable: Boolean(updateData?.vatApplicable) }

		if (updateData?.hasOwnProperty('perpotprice')) dataToUpdate = { ...dataToUpdate, perpotprice: String(updateData?.perpotprice).trim() }
		if (updateData?.hasOwnProperty('pots')) dataToUpdate = { ...dataToUpdate, pots: String(updateData?.pots).trim() }

		if (updateData?.hasOwnProperty('discountMode')) dataToUpdate = { ...dataToUpdate, discountMode: String(updateData?.discountMode).trim() }
		if (updateData?.hasOwnProperty('discountValue')) dataToUpdate = { ...dataToUpdate, discountValue: Number(updateData?.discountValue) }

		if (updateData?.hasOwnProperty('originalPrice')) dataToUpdate = { ...dataToUpdate, originalPrice: Number(updateData?.originalPrice) }
		if (updateData?.hasOwnProperty('discountByRupees')) dataToUpdate = { ...dataToUpdate, discountByRupees: Number(updateData?.discountByRupees) }
		if (updateData?.hasOwnProperty('discountPercentage')) dataToUpdate = { ...dataToUpdate, discountPercentage: Number(updateData?.discountPercentage) }
		


		let findResult = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(productId), active: true })
		if (updateData?.hasOwnProperty('brand') && updateData?.brand !== "" && updateData?.brand !== null && updateData?.brand !== undefined) {
			let brandData = String(updateData?.brand);
			// let isValidObjectId = mongoose.Types.ObjectId.isValid(brandData)
			const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
			let isValidObjectId = checkForHexRegExp.test(brandData);
			if (isValidObjectId) {
				let isCategoryExists = await CategoryModel.findOne({ _id: mongoose.Types.ObjectId(brandData), active: true })
				if (isCategoryExists !== null) {
					let newCategoryArray = findResult?.categoryArray || [];
					const index = newCategoryArray.indexOf(brandData);
					if (index > -1) {
						// If the value exists, remove it
						newCategoryArray.splice(index, 1);
					} else {
						// If the value does not exist, add it
						newCategoryArray.push(mongoose.Types.ObjectId(brandData));
					}
					dataToUpdate = { ...dataToUpdate, categoryArray: newCategoryArray, brand:brandData }
				}
			} else {
				let isCategoryExists = await CategoryModel.findOne({ name: { $regex: brandData, $options: 'i' }, active: true })
				if (isCategoryExists !== null) {
					let newCategoryArray = findResult?.categoryArray || [];
					const index = newCategoryArray.indexOf(isCategoryExists?._id);
					if (index > -1) {
						// If the value exists, remove it
						newCategoryArray.splice(index, 1);
					} else {
						// If the value does not exist, add it
						newCategoryArray.push(mongoose.Types.ObjectId(isCategoryExists?._id));
					}
					dataToUpdate = { ...dataToUpdate, categoryArray: newCategoryArray,brand:isCategoryExists?._id }
				} else {
					let newCategoryArray = findResult?.categoryArray || [];
					let addCategoryRes = await CategoryModel.create({
						name: brandData,
						image: mongoose.Types.ObjectId(findResult?._id)
					})
					if (addCategoryRes) {
						newCategoryArray.push(mongoose.Types.ObjectId(addCategoryRes?._id));
						dataToUpdate = { ...dataToUpdate, categoryArray: newCategoryArray, brand:addCategoryRes?._id }
					}
				}
			}
		}
		
		// return { msg: "Waiting", status: false, code: 400 }
		if('disabledStandardPickNMix' in updateData){
			dataToUpdate.disabledStandardPickNMix=updateData?.disabledStandardPickNMix
		}
		if('disabledPremiumPickNMix' in updateData ){
			dataToUpdate.disabledPremiumPickNMix=updateData?.disabledPremiumPickNMix
		}
		console.log("dataToUpdate:--", dataToUpdate)
		let inStockRequestUsers = await NotifyModel.find({ productId: mongoose.Types.ObjectId(productId), active: true }, { email: 1 })
		if (findResult !== null) {
			let updateResult = await ProductModel.updateOne(
				{ _id: mongoose.Types.ObjectId(productId), active: true },
				{ $set: dataToUpdate }
			)
			if (updateResult?.nModified === 1) {
				if (inStockRequestUsers?.length > 0 && dataToUpdate?.hasOwnProperty('inventory') &&
					(dataToUpdate.inventory != "0" || (dataToUpdate.inventory).toLowerCase() != "out of stock")
				) {
					for (let notifyUserObj of inStockRequestUsers) {
						emailServices.notifyCustomerProduct(notifyUserObj?.email, findResult)
						await NotifyModel.updateOne(
							{ _id: mongoose.Types.ObjectId(notifyUserObj._id), active: true },
							{ $set: { active: false } }
						)
					}
				}
				return { data: "Product updated.", status: true, code: 200 }
			} else {
				return { msg: "Something went wrong, please try again", status: false, code: 400 }
			}
		} else {
			return { msg: "Product not found", status: false, code: 404 }
		}

	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
}
module.exports = updateSeries
