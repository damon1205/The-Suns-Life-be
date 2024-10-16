const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const products = require('../../../databaseJson/products.json')
const productsWithAwsUrl = require('../../../databaseJson/productsWithAwsUrl.json')

const updateAllInventories = catchAsync(async (req, res) => {
    if (products.length) {
        let newProducts = [];
        for (let i = 0; i < products?.length; i++) {
            let currentProduct = products[i];

            if (currentProduct?.fieldType === 'Product') {
                let filterObj = {}
                let updateObj = {}
                if (currentProduct?.handleId) {
                    filterObj['handleId'] = currentProduct?.handleId
                }
                if (currentProduct?.name) {
                    filterObj['name'] = currentProduct?.name
                }
                if (currentProduct?.price) {
                    updateObj['price'] = currentProduct?.price
                }
                if (currentProduct?.visible) {
                    updateObj['visible'] = Boolean(currentProduct?.visible)
                }
                if (currentProduct?.inventory) {
                    updateObj['inventory'] = String(currentProduct?.inventory)
                }

                let addResponse = await productsServices.updateAllInventories(filterObj, updateObj)
                if (addResponse?.status) {
                    // sendResponse(res, httpStatus.OK, addResponse?.data, null);
                } else {
                    sendResponse(res,
                        addResponse?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
                            : httpStatus.BAD_REQUEST,
                        addResponse?.msg,
                        null);
                    return
                }
            }
        }
        sendResponse(res, httpStatus.OK, "Update Done", null);


    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, `Products Array Is Empty!`);
        return
    }
});

module.exports = updateAllInventories;