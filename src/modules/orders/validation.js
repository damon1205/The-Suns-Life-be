const Joi = require('joi');

const addOrder = {
    body: Joi.object().keys({
        productDetail: Joi.array().required(),
        paymentMode: Joi.string().required(),
        paymentStatus: Joi.string().required(),
        orderStatus: Joi.string(),
        paymentType:Joi.string().allow(""),
        shippingAdderess: Joi.object().required(),
        deliveryMethod: Joi.string().required(),
        amountToPay: Joi.number().required(),
        deliveryCharge: Joi.number().required(),
        deliveryTime:Joi.string().allow(""),
        transactionId:Joi.any(),
        paymentType:Joi.any().allow(""),
        couponId:Joi.any().allow(""),
        couponType:Joi.string().allow(""),
        couponName:Joi.string().allow(""),
        couponDiscount:Joi.number(),
        vatCharge:Joi.number().allow(""),
        currency: Joi.string().required(),
        currencyRate: Joi.number().required(),

    }),
};

const addTrackingNumber = {
    body: Joi.object().keys({
        trackingNumber: Joi.string().required(),
        ShippingCarrier: Joi.string().required(),
        isShippingMailchecked: Joi.boolean().allow(""),
        trackingURL: Joi.string().allow("")

    }),
};


module.exports = {
    addOrder,
    addTrackingNumber

};