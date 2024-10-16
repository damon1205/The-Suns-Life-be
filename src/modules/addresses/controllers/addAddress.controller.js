const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");

const addAddressController = catchAsync(async (req, res) => {
	const userId = req?.user?.id;

	let { firstName, lastName, phone, email, country, iso, address, addressLine2, city, state, zip, orderNotes } =
		await pick(req.body, [
			"firstName",
			"lastName",
			"phone",
			"email",
			"country",
			"iso",
			"address",
			"addressLine2",
			"city",
			"state",
			"zip",
			"orderNotes",
		]);

	let addResult = await Services.addAddress({
		userId: userId,
		firstName,
		lastName,
		phone,
		email,
		country,
		iso,
		address,
		addressLine2,
		city,
		state,
		zip,
		orderNotes,
	});

	if (addResult?.code === 200) {
		sendResponse(res, httpStatus.OK, addResult?.data, null);
	} else {
		sendResponse(
			res,
			addResult?.code === 500
				? httpStatus?.INTERNAL_SERVER_ERROR
				: addResult?.code === 404
				? httpStatus?.NOT_FOUND
				: httpStatus.BAD_REQUEST,
			null,
			addResult?.data
		);
	}
});

module.exports = addAddressController;