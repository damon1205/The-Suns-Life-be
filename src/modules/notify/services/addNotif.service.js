const mongoose = require('mongoose');
const notifyModel = require('../notifyProduct.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<{ data: Series | string, status: boolean, code: number }>}
 */
const addNotify = async (seriesData) => {
    try {
       
            // If the series with the given name is not found, create a new one
            const result = await notifyModel.create({ ...seriesData });

            if (result) {
                return { data: result, status: true, code: 200 };
            } else {
                return { data: "Unable to add ", status: false, code: 400 };
            }
        
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addNotify;
