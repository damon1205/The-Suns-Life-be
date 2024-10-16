const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const categoryServices = require("../Services");

const getCategory = catchAsync(async (req, res) => {
	let result = await categoryServices.getCategoryList();
	
	if (result?.status) {
		sendResponse(res, httpStatus.OK, result?.data, null);
	} else {
		sendResponse(
			res,
			result?.code === 400
				? httpStatus.BAD_REQUEST
				: result?.code === 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		);
	}
});

module.exports = getCategory;
