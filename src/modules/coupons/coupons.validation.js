const Joi = require('joi');
const { objectId } = require('../auth/custom.validation');

const addCoupon = {
    body: Joi.object().keys({
        type: Joi.string().valid('price', 'percentage', 'free_shipping', 'buy_X_get_Y','automatic_discount').required(),
        code: Joi.string().allow(""),
        name: Joi.string().required(),
        discount_price: Joi.number().allow(null),
        discount_percentage: Joi.number().allow(null),
        free_shipping_price: Joi.number().allow(null),
        buy_x_products: Joi.number().allow(null),
        get_y_products: Joi.number().allow(null),
        apply_to: Joi.string().valid('specific_products', 'all_products', 'specific_brand', 'minimum_order_subtotal','minimum_order_subtotal_shipping').required(),
        minimum_order_subtotal: Joi.number().allow(null),
        minimum_order_subtotal_shipping: Joi.number().allow(null),
        min_qty: Joi.number().allow(null),
        specific_products: Joi.array().allow(null),
        specific_products_automatic: Joi.array().allow(null),
        sale_price: Joi.number().allow(null),
        specific_brand: Joi.string().allow(""),
        start_date: Joi.date().required(),
        is_expiry_date: Joi.boolean().default(false),
        expiry_date: Joi.date().allow(null),
        max_uses: Joi.number().allow(null),
        one_use_per_customer: Joi.boolean().default(false),
        active: Joi.boolean().default(true),
    }),
};

const updateCoupon = {
    body: Joi.object().keys({
        type: Joi.string().valid('price', 'percentage', 'free_shipping', 'buy_X_get_Y'),
        code: Joi.string(),
        name: Joi.string(),
        discount_price: Joi.number().allow(null),
        discount_percentage: Joi.number().allow(null),
        free_shipping_price: Joi.number().allow(null),
        buy_x_products: Joi.number().allow(null),
        get_y_products: Joi.number().allow(null),
        apply_to: Joi.string().valid('specific_products', 'all_products', 'specific_brand'),
        specific_products: Joi.array().allow(null),
        specific_brand: Joi.string().allow(null),
        start_date: Joi.date(),
        is_expiry_date: Joi.boolean(),
        expiry_date: Joi.date().allow(null),
        max_uses: Joi.number().allow(null),
        one_use_per_customer: Joi.boolean(),
        active: Joi.boolean(),
    }),
};

module.exports = {
    addCoupon,
};
