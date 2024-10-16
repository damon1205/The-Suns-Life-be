const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const blogServices = require("../services");

const getAllBlog = catchAsync(async (req, res) => {
	const { page, limit } = req.query;

	const blogResponse = await blogServices.getAllBlog(page, limit);
	if (blogResponse?.status) {
		sendResponse(
			res,
			httpStatus.OK,
			{
				data: blogResponse.data,
				totalResults: blogResponse?.totalResults,
				totalPages: blogResponse?.totalPages,
				page: blogResponse?.page,
				limit: blogResponse?.limit,
			},
			null
		);
	} else {
		if (blogResponse?.code == 404) {
			sendResponse(res, httpStatus.NOT_FOUND, null, blogResponse?.data);
		} else if (blogResponse?.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, blogResponse?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, blogResponse?.data);
		}
	}
});

module.exports = getAllBlog;
