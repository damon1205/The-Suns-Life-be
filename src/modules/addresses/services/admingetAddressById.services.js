const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require("mongoose");

async function admingetAddressById(id) {
	try {
		const filterQuery = {
			userId: mongoose.Types.ObjectId(id),
			active: true,
		};

		const addresses = await ADDRESS_MODEL.find(filterQuery);

		if (addresses?.length) {
			return { data: addresses, status: true, code: 200 };
		} else {
			return { data: "Address not found", status: false, code: 404 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
}

module.exports = admingetAddressById;