const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
const { required } = require('joi');

const txnSchema = mongoose.Schema(
	{
		productDetail: {
			type: Array,
			required: true,
		},
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
		},
		paymentMode: {
			type: String,
			required: true,
			enum: ["online", "cash_on_delivery"]
		},
		orderId: {
			type: mongoose.SchemaTypes.ObjectId,
		},
		originalTransactionId: {
			type: String,
		},
		paymentStatus: {
			type: String,
			required: true,
			enum: ["paid", "unpaid", "refunded", "partiallypaid", "failed"],
			default: "unpaid"
		},
		orderStatus: {
			type: String,
			enum: ["fulfilled", "unfulfilled", "partiallyfulfilled", "canceled"],
			default: "unfulfilled"
		},
		shippingAdderess: {
			type: Object,
		},
		deliveryMethod: {
			type: String,
			required: true,
		},
		deliveryCharge: {
			type: Number,
			required: true,
		},
		deliveryTime: {
			type: String
		},
		isFullAmountTransfer: {
			type: Boolean,
			// required: true,
			default: false
		},
		trxnId: {
			type: String,
			// required: true,
		},
		isActive: {
			type: Boolean,
			default: false
		},
		currency: {
			type: String,
			// required: true
		},
		currencyRate: {
			type: Number,
			// required: true
		},
		couponId: {
			type: mongoose.Types.ObjectId,
			default: null
		},
		couponType: {
			type: String,
			default: "",
		},
		couponName: {
			type: String,
			default: "",
		},
		couponDiscount: {
			type: Number,
			default: 0,
		},
		trnxNo: {
			type: String,
		},
		active: {
			type: Boolean,
			default: true,
		},
		trxnResponse: {
			type: Object
		},
		amountToPay: {
			type: Number,
			required: true,
		},
		vatCharge: {
			type: Number,

		},
		seqId: {
			type: Number
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
txnSchema.plugin(toJSON);
txnSchema.plugin(paginate);
txnSchema.pre('save', async function (next) {
	const doc = this;
	doc.seqId = await counterIncrementor('Tranaction');
	doc.trnxNo = `TN` + (1000 + doc.seqId);
	next();
});


const trasactionModel = mongoose.model('transaction', txnSchema);

module.exports = trasactionModel;
