const ProductModel = require("../../products/products.model");
const CategoryModel = require("./../category.modal");
const mongoose = require("mongoose");

const getVatchargeByCategory = async (id) => {
	try {
		const categoryName = await CategoryModel.findOne({ _id: mongoose.Types.ObjectId(id) });
		const result = await ProductModel.aggregate([
			{ $match: { categoryArray: mongoose.Types.ObjectId(id) } },
			{ $group: { _id: "$vatCharge", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 1 },

			{ $project: { _id: 0, vatCharge: "$_id" } }, // Rename _id to vatCharge
		]);

		const data = {
			vatCharge: result[0].vatCharge,
			categoryName: categoryName.name,
			id: id,
		};

		if (result && result.length > 0) {
			const mostCommonVatCharge = result[0].vatCharge;

			return {
				data: data,
				mostCommonVatCharge: mostCommonVatCharge,
				status: true,
				code: 200,
			};
		} else {
			return {
				status: false,
				code: 400,
				msg: "Category Not Found",
			};
		}
	} catch (error) {
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = getVatchargeByCategory;
