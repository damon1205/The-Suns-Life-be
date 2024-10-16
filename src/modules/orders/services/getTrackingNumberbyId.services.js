const mongoose = require('mongoose');
const OrderModel = require('../order.model');

const getTrackingNumberbyId = async (id) => {
    try {
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
        const order = await OrderModel.findOne(filterQuery)

        if (!order) {
            return { data: "Tracking no. Not Found", status: false, code: 400 };
        }

        if (order) {
            return { data: order, status: true, code: 200 };
        }
        else {
            return { data: "Unable to Track", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getTrackingNumberbyId;
