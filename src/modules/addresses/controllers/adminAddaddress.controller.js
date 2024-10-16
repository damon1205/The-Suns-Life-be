const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");

const adminAddaddress = catchAsync(async (req, res) => {
	let {
		userId,
		firstName,
		lastName,
		phone,
		orderNotes,
		country,
		address,
		addressLine2,
		city,
		state,
		zip,
		email,
		iso,
	} = await pick(req.body, [
		"userId",
		"firstName",
		"lastName",
		"phone",
		"orderNotes",
		"country",
		"address",
		"addressLine2",
		"city",
		"state",
		"zip",
		"email",
		"iso",
	]);

	let result = await Services.addAddress({
		userId,
		firstName,
		lastName,
		phone,
		orderNotes,
		country,
		address,
		addressLine2,
		city,
		state,
		zip,
		email,
		iso,
	});

	if (result?.code === 200) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code === 404
				? httpStatus.NOT_FOUND
				: result?.code === 500
				? httpStatus?.INTERNAL_SERVER_ERROR
				: httpStatus?.BAD_REQUEST,
			null,
			result?.data
		);
	}
});

module.exports = adminAddaddress;