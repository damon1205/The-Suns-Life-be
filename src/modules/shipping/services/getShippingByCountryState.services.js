
const shippingModel = require('../shipping.modal');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getShippingByCountryState = async (country, state) => {
    /*  const filterQuery = {
         
     };
     if (filter && filter.createdAt) {
         filterQuery.createdAt = filter.createdAt;
     } */

    try {
        const addResult = await shippingModel.findOne(
            {
                active: true,
                'regions.country': country,
                // 'regions.countryRegions': {
                //     $elemMatch: { state: state, available: true }
                // }
            }
        );
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Sorry, our items are not currently available in your region", status: false, code: 400 };
        }


    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getShippingByCountryState 
