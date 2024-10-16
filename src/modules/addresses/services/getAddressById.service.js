const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require("mongoose");

async function getAddressById({ id }) {
	try {
		const filterQuery = {
			_id: mongoose.Types.ObjectId(id),
			active: true,
		};

		const address = await ADDRESS_MODEL.findOne(filterQuery);

		if (address) {
			return { data: address, status: true, code: 200 };
		} else {
			return { data: "Address not found", status: false, code: 404 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 400 };
	}
}

module.exports = getAddressById;