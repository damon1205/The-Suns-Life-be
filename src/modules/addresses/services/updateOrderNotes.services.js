const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require("mongoose");

const updateOrderNotes = async (userId, addressId, orderNotes) => {
	try {
		const filterQuery = {
			_id: mongoose.Types.ObjectId(addressId),
			userId: mongoose.Types.ObjectId(userId),
		};

		const updateResult = await ADDRESS_MODEL.findOneAndUpdate(
			filterQuery,
			{ $set: { orderNotes: orderNotes } },
			{ new: true }
		);

		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		} else {
			return { data: "Address not found or update failed", status: false, code: 400 };
		}
	} catch (error) {
		console.log("Error while updating address:", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = updateOrderNotes;