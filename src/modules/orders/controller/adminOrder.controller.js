const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const TransactionServices = require("../../payments/services");
const moment = require("moment");
const { logger } = require('ethers');

const AdminAddOrder = catchAsync(async (req, res) => {
	try {
		const {
			userId,
			productDetail,
			paymentMode,
			paymentStatus,
			orderStatus,
			shippingAdderess,
			deliveryMethod,
			deliveryTime,
			deliveryCharge,
			paymentType,
			amountToPay,
			vatCharge,
			couponDiscount = 0,
			currency,
			currencyRate
		} = await pick(req.body,
			[
				"userId",
				"productDetail",
				"paymentMode",
				"paymentStatus",
				"orderStatus",
				"shippingAdderess",
				"deliveryMethod",
				"deliveryTime",
				"deliveryCharge",
				"paymentType",
				"amountToPay",
				"vatCharge",
				"couponDiscount",
				"currency",
				"currencyRate"
			]);
			
		// create Transaction
		let createTrnx = await TransactionServices.addTransaction({
			userId,
			productDetail,
			paymentMode,
			paymentStatus,
			orderStatus,
			shippingAdderess,
			deliveryMethod,
			deliveryTime,
			deliveryCharge,
			paymentType,
			amountToPay,
			vatCharge,
			currency,
			currencyRate
		})

		if (createTrnx?.code === 200) {
			const insertResult = await orderServices.AdminAddOrder({
				userId,
				productDetail,
				paymentMode,
				paymentStatus,
				orderStatus,
				shippingAdderess,
				deliveryMethod,
				deliveryTime,
				deliveryCharge,
				paymentType,
				amountToPay,
				vatCharge,
				transactionId: createTrnx?.data?._id,
				couponDiscount,
				currency,
				currencyRate
			});

			if (insertResult.status) {
				sendResponse(res, httpStatus.CREATED, insertResult?.data, null);
			} else {
				sendResponse(res, insertResult?.code === 400 ? httpStatus.BAD_REQUEST
					: insertResult?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
						: httpStatus.BAD_REQUEST,
					null, insertResult?.msg);
			}
		} else {
			sendResponse(res, createTrnx?.code === 400 ? httpStatus.BAD_REQUEST
				: createTrnx?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
				null, createTrnx?.msg);
		}
	} catch (error) {
		console.log("error--------------",error)
		sendResponse(res, httpStatus.BAD_REQUEST, null, error);
	}
});

module.exports = AdminAddOrder;