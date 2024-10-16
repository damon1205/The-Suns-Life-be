const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const categoryServices = require("../Services");

const addCategory = catchAsync(async (req, res) => {
	const { name, image = "" } = req.body;
	
	const category = await categoryServices.addCategory({ name, image });
	if (category?.status) {
		sendResponse(res, httpStatus.OK, category.data, null);
	} else {
		if (category?.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, category.data);
		} else if (category?.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, category.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, category.data);
		}
	}
});

module.exports = addCategory;
