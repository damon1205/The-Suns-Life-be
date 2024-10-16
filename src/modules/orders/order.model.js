const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");
const { Strategy } = require("passport-facebook");

const orderSchema = mongoose.Schema(
	{
		productDetail: {
			type: Array,
			required: true,
		},
		orderNo: {
			type: mongoose.SchemaTypes.String,
		},
		invoice: {
			type: String
		},
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		transactionId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		paymentMode: {
			type: String,
			required: true,
			enum: ["online", "cash_on_delivery"],
		},
		paymentType: {
			type: String,
		},
		paymentStatus: {
			type: String,
			required: true,
			enum: ["paid", "unpaid", "refunded", "partiallypaid", "failed"],
		},
		orderStatus: {
			type: String,
			enum: ["fulfilled", "unfulfilled", "partiallyfulfilled", "canceled"],
			default: "unfulfilled",
		},
		shippingAdderess: {
			type: Object,
		},
		amountToPay: {
			type: Number,
			default: 0,
		},
		deliveryMethod: {
			type: String,
			required: true,
		},
		packingSlipUrl: {
			type: String,
			default: "",
		},
		orderSlipUrl: {
			type: String,
			default: "",
		},
		deliveryCharge: {
			type: Number,
			required: true,
		},
		deliveryTime: {
			type: String
		},

		archiveStatus: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: true,
		},
		seqId: {
			type: Number,
		},
		trackingNumber: {
			type: String,
			default: null,
		},
		ShippingCarrier: {
			type: String,
		},
		trackingURL: {
			type: String,
		},
		isShippingMailchecked: {
			type: Boolean,
		},
		royalMailId: {
			type: String,
			default: null,
		},
		royalMailService: {
			type: String,
			default: null,
		},
		shipTheoryRemarks: {
			type: String,
			default: null,
		},
		shipTheoryStatus: {
			type: String,
			default: null,
		},
		currency: {
			type: String,
			// required: true,
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
		vatCharge: {
			type: Number,
		}
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);
// orderSchema.pre("save", async function (next) {
//   const doc = this;
//   doc.seqId = await counterIncrementor("Order");
//   doc.orderNo = `#` + (26149 + doc.seqId);
//   next();
// });

/**
 * @typedef Product
 */
orderSchema.statics.getAllBrandNames = async function () {
	try {
		const brandNames = await this.distinct("brand");
		return brandNames;
	} catch (error) {
		console.error("Error while getting brand names:", error);
		throw error;
	}
};

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
