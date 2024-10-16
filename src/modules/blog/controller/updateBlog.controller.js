const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const blogServices = require("../services");



const updateBlog = catchAsync(async (req, res) => {
	const body = req.body;
    const { id } = await pick(req.params, ['id']);


	const blog = await blogServices.updateBlog(id, body);
	if (blog.status) {
		sendResponse(res, httpStatus.OK, blog, null);
	} else {
		if (blog.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, blog.data);
		} else if (blog.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, blog.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, blog.data);
		}
	}
});



module.exports = updateBlog;