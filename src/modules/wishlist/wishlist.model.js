const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const wishlistSchema = mongoose.Schema(
	{
		productId:{
            type: mongoose.SchemaTypes.ObjectId,
			required: true,
          
        },
        userId:{
            type: mongoose.SchemaTypes.ObjectId,
          
        },
        isWishlisted:{
            type: mongoose.SchemaTypes.Boolean,
            default: false,
        }
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
wishlistSchema.plugin(toJSON);
wishlistSchema.plugin(paginate);

wishlistSchema.pre('save', async function (next) {
	const Wishlist= this;

	Wishlist.seqId = await counterIncrementor('Wishlist')
	next();
});

/**
 * @typedef Product
 */
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
