const AddressModel = require("../addresses.model");
const mongoose = require("mongoose");

const updateAddress = async ({ id, body }) => {
	try {
		if (body === null || Object.keys(body)?.length === 0) {
			return { data: "Nothing to update", status: false, code: 400 };
		} else {
			let checkAddress = await AddressModel.findOne({ _id: mongoose.Types.ObjectId(id), active: true });
			if (!checkAddress) {
				return { data: "Address not found", status: false, code: 404 };
			} else {
				await AddressModel.updateMany(
					{
						userId: mongoose.Types.ObjectId(checkAddress?.userId),
						active: true,
					},
					{ $set: { isDefault: false } },
					{ new: true }
				);
				let updateResult = await AddressModel.findOneAndUpdate(
					{ _id: mongoose.Types.ObjectId(id), active: true },
					{ $set: { ...body, isDefault: true } },
					{ new: true }
				);
				if (updateResult) {
					return { data: updateResult, status: true, code: 200 };
				} else {
					return { data: "Address update failed", status: false, code: 400 };
				}
			}
		}
	} catch (error) {
		console.log("Error while updating address:", error);
		return { status: false, code: 500, data: error };
	}
};

module.exports = updateAddress;