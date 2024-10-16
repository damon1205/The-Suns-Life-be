const mongoose = require("mongoose");
const ADDRESS_MODEL = require("../addresses.model");

const removeAddress = async (addressData) => {
	try {
		const existingAddress = await ADDRESS_MODEL.findOne({
			_id: mongoose.Types.ObjectId(addressData.addressId),
		});

		if (existingAddress) {
			const response = await existingAddress.remove();
			if (response) {
				return {
					data: "Address removed successfully!",
					status: true,
					code: 200,
				};
			} else {
				return { data: "Error While Removing Data", status: false, code: 400 };
			}
		} else {
			return { data: "Address Not Found", status: false, code: 401 };
		}
	} catch (error) {
		throw new Error(`Failed to remove address: ${error.message}`);
	}
};

module.exports = removeAddress;