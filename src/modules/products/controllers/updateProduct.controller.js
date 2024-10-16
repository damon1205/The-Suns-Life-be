const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const updateProduct = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id'])
    const {
        name,
        description,
        productImageUrl,
        visible,
        price,
        discountMode,
        discountValue,
        inventory,
        weight,
        cost,
        features,
        flavor,
        discountByRupees,
        originalPrice,
        discountPercentage,
        brand,
        variants,
        subImages,
        categoryArray,
        vatCharge,
        strength,productType,
        imageAltText
    } = await pick(req.body,
        [
            "name",
            "description",
            "productImageUrl",
            "visible",
            "price",
            "discountMode",
            "discountValue",
            "inventory",
            "weight",
            "cost",
            "features",
            "flavor",
            "discountByRupees",
            "originalPrice",
            "discountPercentage",
            "brand",
            "variants",
            "subImages",
            "categoryArray",
            "vatCharge",
            "strength",
            "productType",
            "imageAltText"
        ]);
    const insertResult = await productsServices.updateProduct(id, {
        name,
        description,
        productImageUrl,
        visible,
        price,
        discountMode,
        discountValue,
        inventory,
        weight,
        cost,
        features,
        flavor,
        discountByRupees,
        originalPrice,
        discountPercentage,
        brand,
        variants,
        subImages,
        categoryArray,
        vatCharge,
        strength,
        productType,
        imageAltText
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

module.exports = updateProduct;