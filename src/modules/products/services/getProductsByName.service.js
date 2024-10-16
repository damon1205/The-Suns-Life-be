const ProductsModel = require("../products.model");

const findProductByName = async (productName) => {
  try {
    const result = await ProductsModel.findOne({ name: productName });
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
        msg: "Product not found",
      };
    }
  } catch (error) {
    console.error("Error while finding a product by name:", error);
    return { status: false, code: 500, msg: error };
  }
};

module.exports = findProductByName;
