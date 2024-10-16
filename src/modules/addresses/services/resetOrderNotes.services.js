const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require("mongoose");

const resetOrderNotes = async ( addressId, orderNotes) => {
    console.log("addressid",addressId);
	try {
		const filterQuery = {
			_id: mongoose.Types.ObjectId(addressId),
		};
console.log("filterqu",filterQuery);
		const updateResult = await ADDRESS_MODEL.findOneAndUpdate(
			filterQuery,
			{ $set: { orderNotes: "" } },
			{ new: true }
		);
        console.log("updateREsult",updateResult);
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

module.exports = resetOrderNotes;