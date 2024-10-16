const ProductsModel = require("../products.model");
const CategoryModel = require("../../Category/category.modal");

const findProductByName = async (name) => {
  try {
    const aggregateQuery = [
      {
        $match: { name: name },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryArray",
          as: "products",
        },
      },
      {
        $project: {
             "products":1
        },
      }
      
    ];

    

    const result = await CategoryModel.aggregate(aggregateQuery);

    if (result.length > 0) {
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
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = findProductByName;
