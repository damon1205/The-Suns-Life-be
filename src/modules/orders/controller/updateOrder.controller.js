const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const updateOrder = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id'])
    const { orderStatus, paymentStatus } = await pick(req.body, ["orderStatus", "paymentStatus"]);

    let payload = {}
    if (orderStatus) {
        payload = { ...payload, orderStatus }
    }
    if (paymentStatus) {
        payload = { ...payload, paymentStatus }
    }
    const insertResult = await orderServices.updateOrder(id, payload);
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

module.exports = updateOrder;