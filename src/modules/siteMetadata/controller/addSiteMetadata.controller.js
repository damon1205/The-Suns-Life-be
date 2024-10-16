const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const siteMetadataServices = require("../services");


const addSiteMetadata = catchAsync(async (req, res) => {
	const {
	title="",type,statements
	} = await pick(req.body,
		[
			"title",
			"statements",
			"type",
			
		]);
		const body = req.body;
	const insertResult = await siteMetadataServices.addSiteMetadata(body);

	if (insertResult?.status) {
		try {			
			sendResponse(res, httpStatus.OK, insertResult.data, null);
		}catch(e){
			console.log("Something error",e)
		}
		
	} else {
		sendResponse(res,
			insertResult.code == 400 ? httpStatus.BAD_REQUEST
				: insertResult.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST, null, insertResult.msg);
	}
});



module.exports = addSiteMetadata;