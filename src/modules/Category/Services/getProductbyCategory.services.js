const ProductsModel = require("../../products/products.model");
const mongoose = require("mongoose");

const findProductbyBrand = async (categoryId, page, limit, filter, sort) => {
  
    try {
        const filterQuery = { active: true };
        if (filter && filter.search !== undefined && filter.search !== "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
            ];
        }
        let sortQuery = { name: "1" };

        if (sort != null) {
            sortQuery = sort;
        }
        
        const result = await ProductsModel.find({ categoryArray: { $in: [mongoose.Types.ObjectId(categoryId)] } }, filterQuery)
        .select("name productImageUrl").sort(sortQuery);

        const totalResults = await ProductsModel.countDocuments(filterQuery);

        if (result.length > 0) {
            return {
                data: result,
                status: true,
                totalResults,
                code: 200,
            };
        } else {
            return {
                status: false,
                code: 404,
                msg: "Products in the specified category not found",
            };
        }
    } catch (error) {
      //  console.error("Error while finding products by category:", error);
        return { status: false, code: 500, msg: error.message };
    }
};

module.exports = findProductbyBrand;
