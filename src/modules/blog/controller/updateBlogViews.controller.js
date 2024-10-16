const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const IP = require("ip");
const BlogServices = require("../services");

const updateBlogViews = catchAsync(async (req, res) => {
	let blogId = req?.params?.blogId;
	const ipAddress = IP.address();

	let updateViewsResult = await BlogServices.updateBlogViews(blogId, ipAddress);
	if (updateViewsResult?.status) {
		sendResponse(res, httpStatus.OK, updateViewsResult?.data, null);
	} else {
		sendResponse(
			res,
			updateViewsResult?.code == 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: updateViewsResult?.code == 404
				? httpStatus.NOT_FOUND
				: httpStatus.BAD_REQUEST,
			null,
			updateViewsResult?.msg
		);
	}
});

module.exports = updateBlogViews;
