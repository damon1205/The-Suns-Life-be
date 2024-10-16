const mongoose = require('mongoose');
const SHIPPING = require("../shipping.modal")

const updateShippingById = async (data, id) => {
    try {
        if (data.regionName) {
            const existingShipping = await SHIPPING.findOne({ regionName: data.regionName });
            if (existingShipping && existingShipping._id.toString() !== id) {
                return { data: "Region name must be unique", status: false, code: 400 };
            }
        }
        let filterQuery = { _id: mongoose.Types.ObjectId(id) }
        const update = {
            $set: data,
        };

        const updateResult = await SHIPPING.findOneAndUpdate(filterQuery, update, { new: true });


        if (updateResult) {
            return { data: updateResult, status: true, code: 200 }
        } else {
            return { data: "Shipping option not found", status: false, code: 400 }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = updateShippingById