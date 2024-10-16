const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const TransactionModel = require('../../payments/transaction.model');
const transactionServices = require('../../payments/services');

const payOrders = async () => {
    try {
        let unpaidOrders = await OrderModel.aggregate([
            {
                $match: {
                    paymentStatus: "unpaid",
                    orderNo: { $exists: true },
                    createdAt: { $gte: new Date('2024-07-03') },
                    seqId: { $exists: true }
                }
                
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "trnxObj"
                }
            },
            {
                $unwind: {
                    path: '$trnxObj',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "trnxObj.trxnResponse.transaction.status": "SUCCESS"
                }
            },
            {
                $project: {
                    _id: 1,
                    orderNo:1,
                    trxnResponse: "$trnxObj.trxnResponse"
                }
            }
        ]);



        console.log("unpaidOrders:-", unpaidOrders?.length);
        if (unpaidOrders?.length) {
            let paidArray = []
            let unpaidArray = []
            let allOrderArray = []
            for (let order of unpaidOrders) {
                let trxnResponse = order.trxnResponse;

                // Call updateTransaction service with trxnResponse
                let updateResult = await transactionServices.updateTransaction(trxnResponse);
                if(updateResult?.status){
                    paidArray.push(order?._id);
                } else {
                    unpaidArray.push(order?._id)
                }
                allOrderArray.push(order?._id)
            }
            return {
                data: {
                    unpaidArray,
                    paidArray,
                    allOrderArray,
                    unpaidOrders
                },
                status: true,
                code: 200,
            };
        } else {
            return { status: false, code: 404, msg: "No records matched." }
        }
    } catch (error) {
        console.log("error", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = payOrders;
