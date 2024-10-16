const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require("mongoose");

const getMyAllAddress = async (userId) => {
	try {
		const filterQuery = {
			userId: mongoose.Types.ObjectId(userId),
		};

		const result = await ADDRESS_MODEL.find(filterQuery);

		if (result) {
			return {
				data: result,
				status: true,
				code: 200,
			};
		} else if (result < 1) {
			return {
				data: "No addresses added",
				totalItems: 0,
				status: true,
				code: 200,
			};
		} else {
			return { data: "Address not found", status: false, code: 400 };
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = getMyAllAddress;