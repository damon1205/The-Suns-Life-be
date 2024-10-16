const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");

const adminAddsort = catchAsync(async (req, res) => {

    let {
        sortby,
        sortbyvalue
    } = await pick(req.body, [
        "sortby",
        "sortbyvalue"
    ]);

    let result = await Services.adminAddsort({
		sortby,
		sortbyvalue,
		
	})

    if (result?.code === 200) {
        sendResponse(res, httpStatus.OK, result?.data, null);
    } else {
        sendResponse(res,
            result?.code === 404 ? httpStatus.NOT_FOUND
                : result?.code === 500 ? httpStatus?.INTERNAL_SERVER_ERROR : httpStatus?.BAD_REQUEST,
            null, result?.data);
    }

});

module.exports = adminAddsort;