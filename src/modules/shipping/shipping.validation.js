const Joi = require('joi');


const addShippingCountry = {
    body: Joi.object().keys({
        regionName:Joi.string().required(),
        regions :Joi.array().required(),
        shippingRateType:Joi.string().required(),
        shippingOptions:Joi.array(),
        weightRanges: Joi.array().items(
            Joi.object().keys({
              minWeight: Joi.string().required(),
              maxWeight: Joi.string().required(),
              rate: Joi.string().required(),
            })
          )
       
    }),
};


module.exports = {
    addShippingCountry,
};