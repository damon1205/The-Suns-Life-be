const httpStatus = require("http-status");
const Services = require("../services");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const getAddressById = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);

	const result = await Services.getAddressById({ id });

	if (result.code == 200) {
		sendResponse(res, httpStatus.OK, result.data, null);
	} else if (result.code === 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, result.data);
	} else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result.data);
	}
});

module.exports = getAddressById;