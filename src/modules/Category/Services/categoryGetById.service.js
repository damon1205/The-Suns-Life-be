const mongoose = require("mongoose");
const categoryModel = require("../category.modal");

const categoryGetById = async (Id) => {
	try {
		let filterQuery = { active: true, _id: mongoose.Types.ObjectId(Id) };
		const category = await categoryModel.findOne(filterQuery);
		if (category) {
			return { data: category, status: true, code: 200 };
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

module.exports = categoryGetById;
