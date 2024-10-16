const shippingModel = require('../shipping.modal');

/**
 * Get all shipping data
 * @returns {Promise<Object>} Result object
 */
const getAllShipping = async () => {
    const filterQuery = {
        active: true,
    };

    try {
        const countries = await shippingModel.find(filterQuery).distinct('regions.country');

        if (countries && countries.length > 0) {
            return { data: countries, status: true, code: 200 };
        } else {
            return { data: "Can not find region", status: false, code: 400 };
        }
    } catch (error) {
        console.log("error", error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllShipping;
