const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const productSchema = mongoose.Schema(
	{
		productType: {
			type: String,
			trim: true,
			default: '',
		},
		name: {
			type: String,
			trim: true,
			default: '',
			required: true,
		},
		visible: {
			type: Boolean,
			default: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		disabledStandardPickNMix: {
			type: Boolean,
			default: false,
		},
		disabledPremiumPickNMix: {
			type: Boolean,
			default: false,
		},
		price: {
			type: Number,
			default: 0,
			required: true,
		},
		inventory: {
			type: String,
			default: "0",
		},
		productImageUrl: {
			type: String,
			trim: true,
			default: '',
			required: true,
		},
		subImages: {
			type: Array,
			default: []
		},
		features: {
			type: String,
			trim: true,
			default: '',
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		categoryArray: {
			type: Array,
			default: []
		},
		brand: {
			type: String,
			default: "",
		},
		prevBrand: {
			type: String,
			default: "",
		},
		imageAltText: {
			type: String,
			default: '',
		},
		flavor: {
			type: String,
			default: "",
		},
		weight: {
			type: Number,
			default: 0,
		},
		strength: {
			type: Number,
			default: null,
		},
		cost: {
			type: Number,
			default: 0,
		},
		prioritizedBrand: {
			type: Number,
			enum: [1, 2, 3],
			default: 1,
		},
		vatCharge: {
			type: Number,
			required: true,
			default: 0,
		},
		vatApplicable: {
			type: Boolean,
			default: false,
		},
		variants: {
			type: Array,
			default: [],
		},
		perpotprice: {
			type: String,
		},
		pots: {
			type: String,
		},
		discountMode: {
			type: String,
			default: "",
		},
		discountValue: {
			type: Number,
			default: 0,
		},
		originalPrice: {
			type: Number,
			required: true,
		},
		discountByRupees: {
			type: Number
		},
		discountPercentage: {
			type: Number
		},
		active: {
			type: Boolean,
			default: true,
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
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre('save', async function (next) {
	const product = this;

	product.seqId = await counterIncrementor('Product')
	/* capitalize first letter of brand */
	if (this.brand && typeof this.brand === 'string') {
		this.brand = this.brand.charAt(0).toUpperCase() + this.brand.slice(1);
	}
	next();
});

/**
 * @typedef Product
 */
productSchema.statics.getAllBrandNames = async function () {
	try {
		const brandNames = await this.distinct("brand");
		return brandNames;
	} catch (error) {
		console.log("Error while getting brand names:", error);
		throw error;
	}
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
