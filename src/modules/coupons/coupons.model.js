const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const CouponsSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['price', 'percentage', 'free_shipping', 'buy_X_get_Y','automatic_discount'],
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
        },
        discount_price: {
            type: Number,
            default: null,
        },
        discount_percentage: {
            type: Number,
            default: null,
        },
        free_shipping_price: {
            type: Number,
            default: null,
        },
        buy_x_products: {
            type: Number,
            default: null,
        },
        get_y_products: {
            type: Number,
            default: null,
        },
        apply_to: {
            type: String,
            enum: ['specific_products', 'all_products', 'specific_brand', "minimum_order_subtotal", "minimum_order_subtotal_shipping"],
            required: true,
        },
        specific_products: [{
            type: mongoose.Schema.Types.ObjectId,
        }],
        specific_products_automatic: [{
            type: mongoose.Schema.Types.ObjectId,
        }],
        minimum_order_subtotal:{
            type: Number,
            default: null,
        },
        minimum_order_subtotal_shipping:{
            type: Number,
            default: null,
        },
        min_qty:{
            type: Number,
            default: null,
        },
        specific_brand: {
            type: String,
            default: null,
        },
        start_date: {
            type: Date,
            required: true,
        },
        is_expiry_date: {
            type: Boolean,
            default: false,
        },
        expiry_date: {
            type: Date,
            default: null,
        },
        sale_price: {
            type: Number,
            default: null,
        },
        max_uses: {
            type: Number,
            default: null,
        },
        one_use_per_customer: {
            type: Boolean,
            default: false,
        },
        used_count: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
CouponsSchema.plugin(toJSON);
CouponsSchema.plugin(paginate);

CouponsSchema.pre('save', async function (next) {
    const coupon = this;

    coupon.seqId = await counterIncrementor('Coupon')
    next();
});

/**
 * @typedef Coupon
 */

const Coupon = mongoose.model('Coupon', CouponsSchema);

module.exports = Coupon;
