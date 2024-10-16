const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const siteMetadataServices = require("../services");


const removeSiteMetadata = catchAsync(async (req, res) => {

    const { id } = await pick(req.params, ['id']);

	const user = await siteMetadataServices.removeSiteMetadata(id);
	if (user.status) {
		sendResponse(res, httpStatus.OK, user, null);
	} else {
		if (user.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
		} else if (user.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, user.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
		}
	}
});



module.exports = removeSiteMetadata;