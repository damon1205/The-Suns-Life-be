const mongoose = require('mongoose');
const productModel = require('../products.model');

const productIds = [];

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<{ category: { brandName: string, productIds: string[] } }>}
 */
const addCategory = async (ids, brand) => {
    try {
        let product
        let filterQuery;
        let brandNamearray = []
        for (const id of ids) {
            filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
            product = await productModel.find(filterQuery);
            let previousBrand = product[0]?.brand;
            let update2 = await productModel.findByIdAndUpdate(filterQuery, { $push: { categoryArray: mongoose.Types.ObjectId(brand) },})

            brandNamearray.push(update2._id)

        }

        if (product) {
            return { data: brandNamearray, status: true, code: 200 };
        }
    } catch (error) {
        
        return { category: null, error: error.message };
    }
};

module.exports = addCategory;
