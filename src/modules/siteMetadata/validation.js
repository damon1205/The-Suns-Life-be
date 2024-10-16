const Joi = require('joi');



const addSiteMetadata = {
    body: Joi.object().keys({
        title:Joi.string().allow(""),
        statements: Joi.array().required(),
        type: Joi.string().required(),
    }),
};




module.exports = {
    addSiteMetadata,

};