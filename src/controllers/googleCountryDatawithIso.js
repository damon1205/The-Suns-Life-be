const httpStatus = require('http-status');

const { googleAnlyticsCountryWithIso } = require('../utils/googleAnlyticsCountryWithIso');
const { sendResponse } = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');
const { convertToJSON } = require('../utils/helper');

const googleCountryDatawithIso = catchAsync(async (req, res) => {
    
    const {  fromDate,toDate} = req.query;
  
    let result = await googleAnlyticsCountryWithIso( {fromDate, toDate})
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

module.exports = googleCountryDatawithIso;