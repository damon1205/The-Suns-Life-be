const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const blogSchema = mongoose.Schema(
	{
		authorName: {
			type: String,
			default: "THE SNUS LIFE",
		},
		title: {
			type: String,
		},
		img: {
			type: String,
		},
		likesBy: {
			type: Array,
			default: [],
			// required: true,
		},
		views: {
			type: Array,
			default: [],
			// required: true,
		},
		comments: {
			type: Array,
		},
		description: {
			type: String,
			required: true,
		},
		metaDescription: {
			type: String,
			required: true,
		},
		socialLinks: {
			type: Array,
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
blogSchema.plugin(toJSON);
blogSchema.plugin(paginate);
// blogSchema.pre("save", async function (next) {
//   const doc = this;
//   doc.seqId = await counterIncrementor("Order");
//   doc.orderNo = `#` + (26149 + doc.seqId);
//   next();
// });

/**
 * @typedef Product
 */

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
