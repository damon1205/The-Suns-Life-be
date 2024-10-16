const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");
const pick = require("../../../utils/pick");

const updateAddressController = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	const body = req?.body || null;

	let updateResult = await Services.updateAddress({ id, body });
	
	if (updateResult?.code === 200) {
		sendResponse(res, httpStatus.OK, updateResult?.data, null);
	} else {
		sendResponse(
			res,
			updateResult?.code === 500
				? httpStatus?.INTERNAL_SERVER_ERROR
				: updateResult?.code === 404
				? httpStatus?.NOT_FOUND
				: httpStatus.BAD_REQUEST,
			null,
			updateResult?.data
		);
	}
});

module.exports = updateAddressController;