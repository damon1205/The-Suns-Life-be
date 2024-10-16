const httpStatus = require("http-status");
const Services = require("../services");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const admingetAddressById = catchAsync(async (req, res) => {
	const { userId } = await pick(req?.params, ["userId"]);

	if (!userId) {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, "User ID is required");
	}

	const result = await Services.admingetAddressById(userId);

	if (result?.code == 200) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code == 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: result?.code == 404
				? httpStatus.NOT_FOUND
				: httpStatus.BAD_REQUEST,
			null,
			result?.data
		);
	}
});

module.exports = admingetAddressById;