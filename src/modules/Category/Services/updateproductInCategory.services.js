const mongoose = require("mongoose");
const Product = require("../../products/products.model");

const updateProductInCatogry = async (Id, { productId }) => {
	try {
		const product = await Product.findOne({
			active: true,
			_id: mongoose.Types.ObjectId(productId),
		});
		if (product) {
			const categoryExists = product.categoryArray && product.categoryArray.includes(Id);
			if (categoryExists) {
				const updateRes = await Product.findOneAndUpdate(
					{ _id: product._id },
					{ $pull: { categoryArray: mongoose.Types.ObjectId(Id) } },
					{ new: true }
				);

				return { data: updateRes, status: true, code: 200 };
			} else {
				// If category doesn't exist, add it
				const updateRes = await Product.findOneAndUpdate(
					{ _id: product._id },
					{ $push: { categoryArray: mongoose.Types.ObjectId(Id) } },
					{ new: true }
				);

				return { data: updateRes, status: true, code: 200 };
			}
		} else {
			return { data: "Product Not Found", status: false, code: 400 };
		}
	} catch (error) {
		console.log("error", error);
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = updateProductInCatogry;
