const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const SortSchema = mongoose.Schema(
	{
		sortby:{
            type: String,
			required: true,
          
        },
        sortbyvalue:{
            type: Number,
			required:true
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
SortSchema.plugin(toJSON);
SortSchema.plugin(paginate);

/**
 * @typedef Product
 */
const sortproducts = mongoose.model('sortproducts', SortSchema);

module.exports = sortproducts;
