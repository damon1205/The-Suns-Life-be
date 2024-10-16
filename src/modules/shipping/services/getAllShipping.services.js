
const shippingModel = require('../shipping.modal');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getAllCountry = async () => {
     const filterQuery = {
      
    };
    // if (filter && filter.createdAt) {
    //     filterQuery.createdAt = filter.createdAt;
    // } */
    const sortQuery = { _id: -1 };
   
     try {
        const result = await shippingModel.find(filterQuery)
        .sort(sortQuery)
        .lean();
        if (result) {
            return { data: result, status: true, code: 200 };
        }
        else {
            return { data: "Can not find region", status: false, code: 400 };
        }


    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    } 
};

module.exports = getAllCountry
