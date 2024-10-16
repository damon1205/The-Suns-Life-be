const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const notifySchema = mongoose.Schema(
	{
		productId:{
            type: mongoose.SchemaTypes.ObjectId,
			required: true,
          
        },
        email:{
            type: String,
            required: true,
        },
        active:{
            type: mongoose.SchemaTypes.Boolean,
            default: true,
        }
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
notifySchema.plugin(toJSON);
notifySchema.plugin(paginate);

// wishlistSchema.pre('save', async function (next) {
// 	const Wishlist= this;

// 	Wishlist.seqId = await counterIncrementor('Wishlist')
// 	next();
// });

/**
 * @typedef Product
 */
const notifyProduct = mongoose.model('notifyProduct', notifySchema);

module.exports = notifyProduct;
