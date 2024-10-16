const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const addContactusUserInfoServices = require("../services");

const addContactusUserInfo = catchAsync(async (req, res) => {
	let { name, email, phone, company, message } = await pick(req.body, [
		"name",
		"email",
		"phone",
		"company",
		"message",
	]);

	let result = await addContactusUserInfoServices.addContactusUserInfo({
		name: name,
		email: email,
		phone: phone,
		company: company,
		message: message,
	});
	if (result?.code === 200) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code === 400
				? httpStatus.BAD_REQUEST
				: result?.code === 404
				? httpStatus.NOT_FOUND
				: result?.code === 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		);
	}
});

module.exports = addContactusUserInfo;
