const mongoose = require("mongoose");
const orderModel = require("../order.model");

const updateTracking = async (productId, reqBody) => {
	try {
		const filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) };
		const updateResult = await orderModel.findOneAndUpdate(filterQuery, { ...reqBody }, { new: true });
		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		} else {
			return { data: "tracking Not Found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};
0;
module.exports = updateTracking;
