const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const category = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		image: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		active: {
			type: mongoose.SchemaTypes.Boolean,
			default: true,
		},
		seqId: {
			type: Number,
		},
		prioritizedBrand: {
			type: Number,
			enum: [1, 2, 3],
			default: 1,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
category.plugin(toJSON);
category.plugin(paginate);

category.pre("save", async function (next) {
	const category = this;

	category.seqId = await counterIncrementor("category");
	next();
});

/**
 * @typedef category
 */
const brandCategory = mongoose.model("category", category);

module.exports = brandCategory;
