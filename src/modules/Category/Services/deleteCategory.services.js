const mongoose = require("mongoose");
const categoryModel = require("../category.modal");
const ProductMdodel = require("../../products/products.model");

const deleteCategory = async (Id) => {
	try {
		let filterQuery = { active: true, _id: mongoose.Types.ObjectId(Id) };

		const removed = await categoryModel.findOneAndDelete(filterQuery);
		if (removed) {
			const updateProducts = await ProductMdodel.updateMany(
				{ categoryArray: mongoose.Types.ObjectId(Id) },
				{ $pull: { categoryArray: mongoose.Types.ObjectId(Id) } }
			);

			if (updateProducts) {
				return { message: "Category Deleted Successfully", status: true, code: 200 };
			} else {
				return { data: "Category Not Found", status: false, code: 400 };
			}
		} else {
			return {
				data: "Category Not Found",
				status: false,
				code: 400,
			};
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = deleteCategory;
