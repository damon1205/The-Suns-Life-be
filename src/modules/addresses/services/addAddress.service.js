const AddressModel = require("../addresses.model");
const mongoose = require("mongoose");

const addAddress = async (addressData) => {
	try {
		if (addressData === null || Object.keys(addressData)?.length === 0) {
			return { data: "Nothing to Add", status: false, code: 400 };
		} else {
			await AddressModel.updateMany(
				{
					userId: mongoose.Types.ObjectId(addressData?.userId),
					active: true,
				},
				{ $set: { isDefault: false } },
				{ new: true }
			);

			let addResult = await AddressModel.create({
				...addressData,
				isDefault: true,
				userId: mongoose.Types.ObjectId(addressData?.userId),
			});

			if (addResult) {
				return { data: addResult, status: true, code: 200 };
			} else {
				return { data: "Error while adding address", status: false, code: 400 };
			}
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, data: error };
	}
};

module.exports = addAddress;