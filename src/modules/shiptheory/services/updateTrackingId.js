const mongoose = require("mongoose");
const axios = require("axios");
const ordersModal = require("../../orders/order.model");
const orderModel = require("../../orders/order.model");

const shippingmail = require("../../orders/controller/shippingmail.controller");
const { addShipment } = require("./addShipment.service");
const { sendResponse } = require("../../../utils/responseHandler");
const httpStatus = require("http-status");

const delay = (ms = 60000) => new Promise((r) => setTimeout(r, ms));

let isCallled = false;
let counter = 1;
let payload;
let running = false;
// Queue to manage the rate of API calls

const updateTrackingId = async (array, token, res) => {
	try {
		// const waitingOrders = await ordersModal.find({
		//   shipTheoryStatus: { $in: ["Waiting", "Print Error","Queued"] },
		//   trackingNumber:null
		// }).limit(50);

		callApisInLoop(array, token, res);

		// await Promise.all(waitingOrders.map(processOrder));
		// console.log("All objects processed.");
	} catch (error) {
		console.error("Error in getting tracking number:", error);
	}
};

// Function to make an API call
const makeApiCall = async (object, token) => {
	try {
		console.log("Waiting Orders:", "Counter", counter);
		counter++;

		console.log("Index:", object.orderNo?.replace("#", ""));
		// const filter = { _id: object?.id };
		//const checkCurrentStatus = await orderModel.findById(filter);
		//console.log("current status",checkCurrentStatus?.shipTheoryStatus)
		//if(checkCurrentStatus?.shipTheoryStatus!="Complete"){
		const config = {
			method: "get",
			maxBodyLength: Infinity,
			url: `https://api.shiptheory.com/v1/shipments/${object.orderNo?.replace("#", "")}`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const response = await axios.request(config);

		console.log(
			"Status new---------:",
			response?.data?.shipment?.status,
			response?.data?.shipment?.channel_reference_id
		);

		const update = {
			shipTheoryStatus: response?.data?.shipment?.status,
		};

		if (
			response?.data?.shipment?.status === "Complete" ||
			response?.data?.shipment?.status === "Print Error" ||
			response?.data?.shipment?.status === "Queued"
		) {
			if (response?.data?.messages.length > 0) {
				const searchPhrase = "Royal Mail tracking reference received:";
				const filteredMessages = response?.data?.messages.filter(message => message.message.includes(searchPhrase));

				if (filteredMessages.length > 0) {
					let trNumber = (filteredMessages[0]?.message?.toString().split(":")[1]).trim();
					update.shipTheoryStatus = "Complete";
					update.trackingNumber = trNumber;
					update.orderStatus = "fulfilled";
					update.trackingURL = `https://www.royalmail.com/track-your-item#/tracking-results/${trNumber}`;

					console.log("Mail for shipping:", object?._id);

					const filter = { _id: object?._id };
					console.log("Mail for shipping:", object?._id, filter);
					const doc = await orderModel.updateOne(filter, update, {
						new: true,
						upsert: true,
					});
					// const doc = await orderModel.findByIdAndUpdate(filter, update, {
					//   new: true,
					//   upsert: true,
					// });

					const mail = shippingmail(object?._id);
				}
			}
			if (response?.data?.shipment.hasOwnProperty("tracking_number")) {
				update.shipTheoryStatus = "Complete";
				update.trackingNumber = response?.data?.shipment?.tracking_number;
				update.orderStatus = "fulfilled";
				update.trackingURL = `https://www.royalmail.com/track-your-item#/tracking-results/${response?.data?.shipment?.tracking_number}`;

				console.log("Mail for shipping:", object?._id);

				const filter = { _id: object?._id };
				console.log("Mail for shipping:", object?._id, filter);
				const doc = await orderModel.updateOne(filter, update, {
					new: true,
					upsert: true,
				});
				// const doc = await orderModel.findByIdAndUpdate(filter, update, {
				//   new: true,
				//   upsert: true,
				// });

				const mail = shippingmail(object?._id);
			} else {
				const filter = { _id: object?._id };
				console.log("Mail for shipping:", object?._id, filter);
				// const doc = await orderModel.findByIdAndUpdate(filter, update, {
				//   new: true,
				//   upsert: true,
				// });
				const doc = await orderModel.updateOne(filter, update, {
					new: true,
					upsert: true,
				});
			}
			//  }
		} else {
			update.shipTheoryRemarks = response?.data?.messages[response?.data?.messages.length - 1]?.message;
			const filter = { _id: object?._id };
			const doc = await orderModel.updateOne(filter, update, {
				new: true,
				upsert: true,
			});
			// const doc = await orderModel.findByIdAndUpdate(filter, update, {
			//   new: true,
			//   upsert: true,
			// });
		}
	} catch (error) {
		console.error("Error in API SHIPTHEORY UPDATES call:", error.message);
		return null;
	}
};

// Function to call APIs in a loop
const callApisInLoop = async (urls, token, res) => {
	for (const url of urls) {
		running = true;
		await makeApiCall(url, token);
		console.log("is called----------", url?._id);
		// if(isCallled){
		//   await addShipment(token,payload?.payload,payload?.orderId);
		//   isCallled=false;
		//   payload=null;
		//   running=false;

		// }

		await new Promise((resolve) => setTimeout(resolve, 1000));
		running = false;
	}
	console.log("all calls done");
	sendResponse(res, httpStatus.OK, null, "Sync done");
};

const callAddShipment = async (data) => {
	// if(running==true){
	console.log("call to get for new trnasaction 3");
	isCallled = true;
	//payload=data;
	//   setTimeout(() => {
	console.log("inside caller function---------", isCallled, running);

	// }else{
	await addShipment(data?.token, data?.payload, data?.orderId);
	await new Promise((resolve) => setTimeout(resolve, 3000));
	//}
};

// // Call addShipment on every second
// callAddShipment();

module.exports = {
	//addShipment,
	callAddShipment,
	updateTrackingId,
};
