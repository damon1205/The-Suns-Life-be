const orderModel = require('../order.model');

const getTopOrders = async (filter) => {
    try {
        let topFiveUserOrderSummary = await orderModel.aggregate([
            {
                $match: filter
            },
            {
                $addFields: {
                    convertedAmountToPay: {
                        $divide: [
                            "$amountToPay",
                            { $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalAmountPaid: { $sum: "$convertedAmountToPay" },
                    totalOrders: { $sum: 1 },
                    shippingAddresses: { $addToSet: "$shippingAdderess" }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalAmountPaid: { $round: ["$totalAmountPaid", 2] }, // Round to 2 decimal places
                    totalOrders: 1,
                    shippingAddresses: 1,
                }
            },
            {
                $sort: {
                    totalAmountPaid: -1
                }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users", // Replace "users" with the actual name of your users collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    totalAmountPaid: 1,
                    totalOrders: 1,
                    shippingAddresses: 1,
                    user: 1,
                }
            }
        ]);

        if (topFiveUserOrderSummary.length > 0) {
            return { data: topFiveUserOrderSummary, status: true, code: 200 };
        } else {
            return { msg: "No orders", status: false, code: 400 };
        }
    } catch (error) {
        console.log(error.message);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getTopOrders;
