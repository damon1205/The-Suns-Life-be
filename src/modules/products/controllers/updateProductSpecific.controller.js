const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const updateProductSpecific = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id'])
    let body = req?.body || {};
    const updateResult = await productsServices.updateProductSpecific(id, body)
    if (updateResult?.status) {
        sendResponse(res, httpStatus.OK, updateResult.data, null);
    } else {
        sendResponse(
            res,
            updateResult?.code == 404 ? httpStatus.NOT_FOUND
                : updateResult?.code === 500 ? httpStatus?.INTERNAL_SERVER_ERROR
                    : httpStatus.BAD_REQUEST,
            updateResult?.msg
        )
    }
});

module.exports = updateProductSpecific;