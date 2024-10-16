
const httpStatus = require('http-status');
const transactionServices = require("../services");
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addTransaction = async (req, res) => {

	const {
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		amountToPay,
		deliveryCharge,
		vatCharge = 0,
		currency,
		currencyRate,
		couponId,
		couponType,
		couponName,
		couponDiscount,
	} = await pick(req.body,
		[
			"productDetail",
			"paymentMode",
			"paymentStatus",
			"orderStatus",
			"shippingAdderess",
			"deliveryMethod",
			"amountToPay",
			"deliveryCharge",
			"vatCharge",
			"currency",
			"currencyRate",
			"couponId",
			"couponType",
			"couponName",
			"couponDiscount",
		]);

	const userId = req.user?.id

	let result = await transactionServices.addTransaction({
		userId,
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		amountToPay,
		deliveryCharge,
		vatCharge,
		currency,
		currencyRate,
		couponId,
		couponType,
		couponName,
		couponDiscount,
	})
	if (result.status) {
		sendResponse(res, httpStatus.OK, result.data, null)
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, result.msg)
	}


};

module.exports = addTransaction;
