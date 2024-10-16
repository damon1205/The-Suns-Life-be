const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getOrdersById = catchAsync(async (req, res) => {
  
    const { id } = await pick(req.params, ['id']);

    const series = await orderServices.getOrdersById(id);
  
    if (series.status) {
        sendResponse(res, httpStatus.OK, series.data, null);
    } else {
        if (series.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, series.data);
        }
        else if (series.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, series.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, series.data);
        }
    }

});

module.exports = getOrdersById
