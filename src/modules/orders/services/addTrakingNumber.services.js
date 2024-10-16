const mongoose = require("mongoose");
const orderModel = require("../order.model");

const addTrackingNumber = async (orderData) => {
	try {
		const addResult = await orderModel.findOneAndUpdate(
			{
				_id: mongoose.Types.ObjectId(orderData?.orderNo),
				active: true,
			},

			{
				trackingNumber: orderData?.trackingNumber,
				ShippingCarrier: orderData?.ShippingCarrier,
				isShippingMailchecked: orderData?.isShippingMailchecked,
				trackingURL: orderData?.trackingURL,
				orderStatus: "fulfilled",
			},
			{ new: true }
		);
		if (addResult) {
			return { data: addResult, status: true, code: 200 };
		} else {
			return { data: "Can not add traking number", status: false, code: 400 };
		}
	} catch (error) {
		console.log("error", error);
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = addTrackingNumber;
