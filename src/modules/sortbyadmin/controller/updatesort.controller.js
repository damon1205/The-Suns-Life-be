const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");


const updatesortProduct = catchAsync(async (req, res) => {
    const {
        sortby,
        sortbyvalue,
       
    } = await pick(req.body,
        [
            "sortby",
            "sortbyvalue",
            
        ]);
    const insertResult = await Services.updatesortProduct({
        sortby,
        sortbyvalue,
    });
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if (insertResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if (insertResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
    }
});

module.exports = updatesortProduct;