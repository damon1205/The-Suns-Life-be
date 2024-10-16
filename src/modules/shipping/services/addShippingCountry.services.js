const shippingModel = require('../shipping.modal')

/***
 * Create a Series  of shipping
 * @param {Object} shippingData
 * @returns {Promise<Object>}
 **/
const addShippingCountry = async (shippingData) => 
    {
    console.log("shippingdata",shippingData);
    try {
        const existingShippingCountry = await shippingModel.findOne({ regionName: shippingData.regionName });

        if (existingShippingCountry) {
            return { data: "Region name must be unique", status: false, code: 400 };
        } else {
            const addResult = await shippingModel.create({ ...shippingData });
            if (addResult) {
                return { data: addResult, status: true, code: 200 };
            } else {
                return { data: "Could not add the shipping country", status: false, code: 400 };
            }
        }
    } catch (err) {
        return { data: err.message, status: false, code: 500 }
    }
};

module.exports = addShippingCountry;
