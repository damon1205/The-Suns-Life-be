const mongoose = require("mongoose");
const orderModel = require("../order.model");

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addShippingConfirmationMail = async ({ id }) => {
  try {
    // Assuming that "fulfilled" is the status for fulfilled orders
    const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
    // const filterQuery = { active: true, orderStatus: "fulfilled", _id: mongoose.Types.ObjectId(orderId) };

    const addResult = await orderModel.find(filterQuery);
    if ((addResult.orderStatus = "fulfilled")) {
      // Send the shipping confirmation mail here
      // ...


            return { data: addResult, status: true, code: 200 };
        } else {
            return { data: "Cannot send a shipping confirmation mail for this order.", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
 
};

module.exports = addShippingConfirmationMail;
