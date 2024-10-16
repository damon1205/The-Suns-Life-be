
const { addCategory, updateProductInCatogry, } = require('../../Category/Services');
const updateProductCategoryFromProduct = require('../../Category/Services/updateProductCategoryFromProduct.service');
const ProductModel = require('../products.model');
const CategoryModel = require('../../Category/category.modal')
const mongoose = require('mongoose');


/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addProduct = async (productData) => {
    try {
        let dataToAdd = {}
        if (productData?.hasOwnProperty('productType')) dataToAdd = { ...dataToAdd, productType: String(productData?.productType).trim() }
        if (productData?.hasOwnProperty('name')) dataToAdd = { ...dataToAdd, name: String(productData?.name).trim() }
        if (productData?.hasOwnProperty('visible')) dataToAdd = { ...dataToAdd, visible: Boolean(productData?.visible) }
        if (productData?.hasOwnProperty('isFeatured')) dataToAdd = { ...dataToAdd, isFeatured: Boolean(productData?.isFeatured) }
        if (productData?.hasOwnProperty('price')) dataToAdd = { ...dataToAdd, price: Number(productData?.price) }
        if (productData?.hasOwnProperty('productImageUrl')) dataToAdd = { ...dataToAdd, productImageUrl: String(productData?.productImageUrl).trim() }
        if (productData?.hasOwnProperty('imageAltText')) dataToAdd = { ...dataToAdd, imageAltText: String(productData?.imageAltText).trim() }
        if (productData?.hasOwnProperty('flavor')) dataToAdd = { ...dataToAdd, flavor: String(productData?.flavor).trim() }
        if (productData?.hasOwnProperty('weight')) dataToAdd = { ...dataToAdd, weight: Number(productData?.weight) }
        if (productData?.hasOwnProperty('strength')) dataToAdd = { ...dataToAdd, strength: Number(productData?.strength) }
        if (productData?.hasOwnProperty('cost')) dataToAdd = { ...dataToAdd, cost: Number(productData?.cost) }

        if (productData?.hasOwnProperty('inventory')) dataToAdd = { ...dataToAdd, inventory: String(productData?.inventory).trim() }

        if (productData?.hasOwnProperty('subImages')) dataToAdd = { ...dataToAdd, subImages: productData?.subImages }

        if (productData?.hasOwnProperty('description')) dataToAdd = { ...dataToAdd, description: String(productData?.description) }
        if (productData?.hasOwnProperty('features')) dataToAdd = { ...dataToAdd, features: String(productData?.features) }

        if (productData?.hasOwnProperty('variants')) dataToAdd = { ...dataToAdd, variants: productData?.variants }
        // if (productData?.hasOwnProperty('categoryArray')) dataToAdd = { ...dataToAdd, categoryArray: Array(productData?.categoryArray) }

        if (productData?.hasOwnProperty('prioritizedBrand')) dataToAdd = { ...dataToAdd, prioritizedBrand: Number(productData?.prioritizedBrand) }

        if (productData?.hasOwnProperty('vatCharge')) dataToAdd = { ...dataToAdd, vatCharge: Number(productData?.vatCharge) }
        if (productData?.hasOwnProperty('vatApplicable')) dataToAdd = { ...dataToAdd, vatApplicable: Boolean(productData?.vatApplicable) }

        if (productData?.hasOwnProperty('perpotprice')) dataToAdd = { ...dataToAdd, perpotprice: String(productData?.perpotprice).trim() }
        if (productData?.hasOwnProperty('pots')) dataToAdd = { ...dataToAdd, pots: String(productData?.pots).trim() }

        if (productData?.hasOwnProperty('discountMode')) dataToAdd = { ...dataToAdd, discountMode: String(productData?.discountMode).trim() }
        if (productData?.hasOwnProperty('discountValue')) dataToAdd = { ...dataToAdd, discountValue: Number(productData?.discountValue) }

        if (productData?.hasOwnProperty('originalPrice')) dataToAdd = { ...dataToAdd, originalPrice: Number(productData?.originalPrice) }
        if (productData?.hasOwnProperty('discountByRupees')) dataToAdd = { ...dataToAdd, discountByRupees: Number(productData?.discountByRupees) }
        if (productData?.hasOwnProperty('discountPercentage')) dataToAdd = { ...dataToAdd, discountPercentage: Number(productData?.discountPercentage) }

        
        const addResult = await ProductModel.create({ ...productData });
        if (addResult) {
            if (productData?.hasOwnProperty('brand') && productData?.brand !== "" && productData?.brand !== null && productData?.brand !== undefined) {
                let brandData = String(productData?.brand);
                // let isValidObjectId = mongoose.Types.ObjectId.isValid(brandData)
                const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
                let isValidObjectId = checkForHexRegExp.test(brandData);
                if (isValidObjectId) {
                    let isCategoryExists = await CategoryModel.findOne({ _id: mongoose.Types.ObjectId(brandData), active: true })
                    if (isCategoryExists !== null) {
                        await ProductModel.updateOne(
                            { _id: mongoose.Types.ObjectId(addResult._id) },
                            { $set: { categoryArray: [mongoose.Types.ObjectId(brandData)] } }
                        )
                    }
                } else {
                    let isCategoryExists = await CategoryModel.findOne({ name: { $regex: brandData, $options: 'i' }, active: true })
                    if (isCategoryExists !== null) {
                        await ProductModel.wa
                        await ProductModel.updateOne(
                            { _id: mongoose.Types.ObjectId(addResult._id) },
                            { $set: { categoryArray: [mongoose.Types.ObjectId(brandData)] } }
                        )
                    } else {
                        let addCategoryRes = await CategoryModel.create({
                            name: brandData,
                            image: mongoose.Types.ObjectId(addResult?._id)
                        })
                        if (addCategoryRes) {
                            await ProductModel.updateOne(
                                { _id: mongoose.Types.ObjectId(addResult._id) },
                                { $set: { categoryArray: [mongoose.Types.ObjectId(addCategoryRes?._id)] } }
                            )
                        }
                    }
                }
            }
            return { data: "Product Added.", status: true, code: 200 };
        } else {
            return { data: "Can not add product", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addProduct
