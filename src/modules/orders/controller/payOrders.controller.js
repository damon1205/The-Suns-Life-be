const orderServices = require("../services");
const httpStatus = require('http-status');
const { sendResponse } = require("../../../utils/responseHandler");
const catchAsync = require("../../../utils/catchAsync");


const payOrders = catchAsync(async (req, res) => {
    let result = await orderServices.payOrders();
// console.log("result:-",result);
    if (result?.status) {
        sendResponse(res, httpStatus.OK, result?.data, null);
    } else {
        sendResponse(res,
            result?.code === 404
                ? httpStatus.NOT_FOUND
                : result?.code === 500
                    ? httpStatus.INTERNAL_SERVER_ERROR
                    : httpStatus.BAD_REQUEST,
            null,
            result?.msg
        )
    }
});

module.exports = payOrders;
