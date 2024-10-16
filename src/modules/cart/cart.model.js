const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const cartSchema = mongoose.Schema(
	{
		productId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
		},
		productDetail: {
			type: Array,
		},
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
		},
		quantity: {
			type: Number,
			default: 1,
		},
		deviceId: {
			type: String,
			default: null,
		},
		variants: {
			type: Object,
			default: {},
		},

		isActive: {
			type: Boolean,
			default: true,
		},
		abandonedEmail: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

cartSchema.pre("save", async function (next) {
	const cart = this;

	cart.seqId = await counterIncrementor("Cart");
	next();
});

/**
 * @typedef Product
 */
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
