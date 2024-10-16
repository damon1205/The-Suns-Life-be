const categoryModel = require("../category.modal");

const addCategory = async (brandData) => {
	try {
		const findExistingCategory = await categoryModel.find({ name: brandData.name, active: true });

		if (findExistingCategory?.length) {
			return { data: "Category name already Exists", status: false, code: 400 };
		}
		const addResult = await categoryModel.create(brandData);
		if (addResult) {
			return { data: addResult, status: true, code: 200 };
		} else {
			return { data: "Cannot add Category", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = addCategory;
