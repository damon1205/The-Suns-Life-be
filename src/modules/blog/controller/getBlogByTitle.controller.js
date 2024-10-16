const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const blogServices = require("../services");

const getBlogByTitle = catchAsync(async (req, res) => {
	const { title } = await pick(req.params, ["title"]);

	const blogRes = await blogServices.getBlogByTitle(title);
	if (blogRes?.status) {
		sendResponse(res, httpStatus.OK, blogRes, null);
	} else {
		if (blogRes?.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, blogRes?.data);
		} else if (blogRes?.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, blogRes?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, blogRes?.data);
		}
	}
});

module.exports = getBlogByTitle;
