const ProductModel = require("../../products/products.model");
const mongoose = require("mongoose");

const getVatchargeByCategory = async ({ id, vatCharge }) => {
	try {
		const result = await ProductModel.updateMany(
			{ categoryArray: { $in: mongoose.Types.ObjectId(id) } },
			{ vatCharge: vatCharge }
		);

		if (result) {
			return {
				data: "VAT charge updated successfully!",
				status: true,
				code: 200,
			};
		} else {
			return {
				status: false,
				code: 400,
				msg: "Something went wrong",
			};
		}
	} catch (error) {
		console.error(error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = getVatchargeByCategory;
