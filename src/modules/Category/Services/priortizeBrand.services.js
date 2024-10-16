const mongoose = require("mongoose");
const categoryModel = require("../category.modal");

const priortizeBrand = async (id, priority) => {
	try {
		const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
		const updateResult = await categoryModel.findOneAndUpdate(
			filterQuery,
			{ prioritizedBrand: priority },
			{ new: true }
		);

		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		} else {
			return { data: "category Not Found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = priortizeBrand;
