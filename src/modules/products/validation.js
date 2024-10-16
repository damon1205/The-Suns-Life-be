const Joi = require('joi');
const { objectId } = require('../auth/custom.validation');


const addProduct = {
    body: Joi.object().keys({
        name:Joi.string().required(),
        features:Joi.string().allow(""),
        description:Joi.string().allow(""),
        productImageUrl:Joi.string().required(),
        visible:Joi.boolean().allow(""),
        price:Joi.number().allow(""),
        discountMode:Joi.string().allow(''),
        discountValue:Joi.string().allow(''),
        inventory:Joi.string().allow(''),
        isFeatured:Joi.boolean().allow(""),
        weight:Joi.number().allow(""),
        cost:Joi.number().allow(""),
        brand:Joi.string().allow("")
    }),
};
const updateProduct = {
    body: Joi.object().keys({
        name:Joi.string().required(),
        description:Joi.string().allow(""),
        features:Joi.string().allow(""),
        productImageUrl:Joi.string().required(),
        visible:Joi.boolean().allow(""),
        price:Joi.number().allow(""),
        discountMode:Joi.string().allow(''),
        discountValue:Joi.string().allow(''),
        inventory:Joi.string().allow(''),
        isFeatured:Joi.boolean().allow(""),
        weight:Joi.number().allow(""),
        cost:Joi.number().allow(""),
        brand:Joi.string().allow("")
    }),
};

const listSeries = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
        isNoPagination: Joi.string(),
    }),
};

const getSeriesById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};

const deleteSeries = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};

const updateSeries = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        desc: Joi.string().required(),
        categoryId: Joi.custom(objectId).required(),
    }),
};

module.exports = {
    addSeries,
    listSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
};