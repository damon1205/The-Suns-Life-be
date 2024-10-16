const Joi = require('joi');


const addNotification = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        productId: Joi.string().required(),

    }),
};


module.exports = {
   addNotification
};