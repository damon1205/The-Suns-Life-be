const mongoose = require('mongoose');
const Product = require('../../products/products.model');

const updateProductCategoryFromProduct = async (Id, { productId }) => {
    try {
        console.log("id", Id);
        console.log("productId", productId);

                // If category doesn't exist, add it
                const updateRes = await Product.findOneAndUpdate(
                    { _id: productId },
                    { $push: { categoryArray: mongoose.Types.ObjectId(Id) } },
                    { new: true }
                );

                return { data: updateRes, status: true, code: 200 };
        
    } catch (error) {
        console.log("error", error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateProductCategoryFromProduct;
