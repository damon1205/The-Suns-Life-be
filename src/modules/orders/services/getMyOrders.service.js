const mongoose = require('mongoose');
const orderModel = require('../order.model');
const productModel = require('../../products/products.model');

const getMyOrders = async ({ userId }) => {
    try {
        const fetchRes = await orderModel.aggregate([
            {
                $match: { userId: mongoose.Types.ObjectId(userId),paymentType:"pay360", active: true }
            },{
            $sort: {
                createdAt: -1 // assuming there's a createdAt field in your orders collection
            }
        },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "usersObj"
                }
            },
            {
                $unwind: {
                    path: '$usersObj',
                    preserveNullAndEmptyArrays: true
                }
            },

        ]);
        if (fetchRes.length > 0) {
            return { data: fetchRes, status: true, code: 200 };
        } else {
            return { msg: "No orders found for the user", status: false, code: 404 };
        }
    } catch (error) {
        return { status: false, code: 500, msg: error.message }

    }
};

module.exports = getMyOrders