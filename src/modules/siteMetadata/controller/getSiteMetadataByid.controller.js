const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const siteMetadataServices = require("../services");


const getSiteMetadataByid = catchAsync(async (req, res) => {
    const {page, limit,  filter, sort} = await pick(req.query, ['page', 'limit', 'filter', 'sort'])
    const { id } = await pick(req.params, ['id']);
     let filter_Json_data = filter ? JSON.parse(filter.query) : undefined;


	const user = await siteMetadataServices.getSiteMetadataByid(page, limit, filter_Json_data , sort,id);
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



module.exports = getSiteMetadataByid;