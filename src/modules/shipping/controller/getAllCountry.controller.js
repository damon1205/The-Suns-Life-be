const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const shippingServices = require("../services");

const getAllCountry = catchAsync(async (req, res) => {
   
    let { fromDate , toDate  } = await pick(req.query, ['fromDate', 'toDate'])

   /*  let filter = { active: true, }

    if (fromDate && toDate) {
        filter['createdAt'] = {
            '$gte': new Date(new Date(fromDate).setHours(0,0, 0,0)),
            '$lte': new Date(new Date(toDate).setHours(23, 59, 59))
        }
    }
 */
   

    const insertResult = await shippingServices.getAllCountry();
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

module.exports = getAllCountry