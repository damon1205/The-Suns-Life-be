const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const ContactUsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			/* required: true, */
		},
		company: {
			type: String,
		},
		message: {
			type: String,
			required: true,
		},
		seqId: {
			type: Number,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
	}
);

ContactUsSchema.plugin(toJSON);
ContactUsSchema.plugin(paginate);

ContactUsSchema.pre("save", async function (next) {
	const doc = this;
	doc.seqId = await counterIncrementor("ContactUs");
	next();
});
// Create a model using the schema
const ContractUs = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContractUs;
