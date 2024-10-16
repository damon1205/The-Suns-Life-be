
const shippingModel = require('../shipping.modal');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getShippingById  = async (id) => {
   /*  const filterQuery = {
        
    };
    if (filter && filter.createdAt) {
        filterQuery.createdAt = filter.createdAt;
    } */
   
     try {
        const addResult = await shippingModel.findOne({_id:id});
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Can not add product", status: false, code: 400 };
        }


    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    } 
};

module.exports = getShippingById 
