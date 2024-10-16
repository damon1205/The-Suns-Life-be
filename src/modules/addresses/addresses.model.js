const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const addressSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
		},
		firstName: {
			type: String,
			trim: true,
			default: "",
			required: true,
		},
		lastName: {
			type: String,
			trim: true,
			default: "",
			required: true,
		},
		phone: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		orderNotes: {
			type: String,
			default: "",
		},
		country: {
			type: String,
			default: "",
			required: true,
		},
		address: {
			type: String,
			default: "",
			required: true,
		},
		addressLine2: {
			type: String,
			default: "",
		},
		city: {
			type: String,
			default: "",
			required: true,
		},
		state: {
			type: String,
			default: "",
			required: true,
		},
		zip: {
			type: String,
			required: true,
		},
		iso: {
			type: String,
			required: true,
			default: null,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

addressSchema.pre("save", async function (next) {
	const address = this;

	address.seqId = await counterIncrementor("Address");
	next();
});

/**
 * @typedef Address
 */

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
