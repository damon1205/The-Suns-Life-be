const ProductsModel = require("../products.model");

const findProductbyBrand = async (brandName) => {
    try {
        const result = await ProductsModel.find({ brand: brandName });

        if (result) {
            return {
                status: true,
                code: 200,
                data: result,
            };
        } else {
            return {
                status: false,
                code: 404,
                msg: "Product brand not found",
            };
        }
    } catch (error) {
        console.error("Error while finding a product by brand name:", error);
        return { status: false, code: 500, msg: error };
    }
};

module.exports = findProductbyBrand;
