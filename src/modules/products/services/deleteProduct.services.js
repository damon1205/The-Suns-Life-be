const mongoose = require('mongoose');
const Product = require('../products.model');

const deleteProduct = async (productId) => {
    try {
    
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) }

        const removed = await Product.findByIdAndDelete(filterQuery)

        if (removed) {
            return { message: "Product deleted Successfully", status: true, code: 200 };
        } else {
            return { data: "Product Not Found", status: false, code: 400 };
        }
    } catch (error) {
        console.log("errorrr", error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = deleteProduct;
