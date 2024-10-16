const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const couponServices = require("../services");

const addCoupon = catchAsync(async (req, res) => {
    const {
        type,
        code,
        name,
        discount_price,
        discount_percentage,
        free_shipping_price,
        buy_x_products,
        get_y_products,
        apply_to,
        specific_products,
        specific_brand,
        minimum_order_subtotal,
        minimum_order_subtotal_shipping,
        start_date,
        is_expiry_date,
        specific_products_automatic,
        expiry_date,
        max_uses,
        one_use_per_customer,
        active,
        min_qty,
        sale_price
    } = await pick(req.body, [
        "type",
        "code",
        "name",
        "discount_price",
        "discount_percentage",
        "free_shipping_price",
        "buy_x_products",
        "get_y_products",
        "apply_to",
        "specific_products",
        "specific_brand",
        "minimum_order_subtotal",
        "minimum_order_subtotal_shipping",
        "start_date",
        "specific_products_automatic",
        "is_expiry_date",
        "expiry_date",
        "max_uses",
        "one_use_per_customer",
        "active",
        "min_qty",
        "sale_price"
    ]);

    const insertResult = await couponServices.addCoupon({
        type,
        code,
        name,
        discount_price,
        discount_percentage,
        free_shipping_price,
        specific_products_automatic,
        buy_x_products,
        get_y_products,
        apply_to,
        specific_products,
        specific_brand,
        minimum_order_subtotal,
        minimum_order_subtotal_shipping,
        start_date,
        is_expiry_date,
        expiry_date,
        max_uses,
        one_use_per_customer,
        active,
        min_qty,
        sale_price
    });

    if (insertResult?.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
        return;
    } else {
        if (insertResult?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult?.data);
        } else if (insertResult?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult?.data);
        }
    }
});

module.exports = addCoupon;
