const httpStatus = require('http-status');

const { runReport } = require('../utils/GoogleAnalytivs');
const { sendResponse } = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');
const { convertToJSON } = require('../utils/helper');

const getGoogleAnalyticsData = catchAsync(async (req, res) => {
    
    const {  fromDate,toDate} = req.query;
  
    let result = await runReport( {fromDate, toDate})
    if (result.status) {
        sendResponse(res, httpStatus.OK, 
            {data: result?.data}, 
            null);
    } else {
        if (result?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
        } else if (result?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result);
        }
    }

});

module.exports = getGoogleAnalyticsData;