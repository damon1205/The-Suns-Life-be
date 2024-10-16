const mongoose = require('mongoose');
const OrderModel = require('../order.model');

const getOrdersById = async (id) => {
	try {
		let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id), paymentType: "pay360" }
		const order = await OrderModel.findOne(filterQuery)

		if (!order) {
			return { data: "Order Not Found", status: false, code: 400 };
		}

		const orderWithUser = await OrderModel.aggregate([
			{
				$match: { _id: order._id }
			},
			{
				$addFields: {
					amountInGBP: {
						$round: [
							{
								$divide: [
									"$amountToPay",
									{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
								]
							},
							2
						]
					},
					deliveryInGBP: {
						$round: [
							{
								$divide: [
									"$deliveryCharge",
									{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
								]
							},
							2
						]
					},
					couponDiscountInGBP: {
						$round: [
							{
								$divide: [
									"$couponDiscount",
									{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
								]
							},
							2
						]
					}
				}
			},
			{
				$lookup: {
					from: 'transactions',
					localField: 'transactionId',
					foreignField: '_id',
					as: 'transaction'
				}
			}
		]);
		
		if (orderWithUser.length > 0) {
			return { data: orderWithUser[0], status: true, code: 200 };
		} else {
			return { data: "User Not Found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getOrdersById;
