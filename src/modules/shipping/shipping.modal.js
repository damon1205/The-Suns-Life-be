const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const regionSchema = new mongoose.Schema({

    country: {
        type: String,
        trim: true,
        default: ""
    },
    countryRegions: [
        {
            state: {
                type: String,
                trim: true,
                default: ""
            },
            available: {
                type: Boolean,
                default: true
            }
        },

        {
            timestamps: false,
            _id: true
        }
    ]
}
    ,

    {
        timestamps: false,
        _id: true
    });

    const WeightRangeSchema = new mongoose.Schema({
        minWeight: {
          type: String,
          required: true
        },
        maxWeight: {
          type: String, 
          required: true
        },
        rate: {
          type: String,
          required: true
        }
      },
      {
        timestamps: false,
        _id: true
    });

const shippingOptionSchema = new mongoose.Schema({
    deliveryMethod: {
        type: String,
        trim: true,
        default: ""
    },
    deliveryTime: {
        type: String,
        trim: true,
        default: ""
    },
    shippingRate: {
        type: Number,
        default: 0
    },
    isShippingFree: {
        type: Boolean,
        default: false
    },
    freeShippingOverAmount: {
        type: Number,
        default: 0
    },
    weightRanges: [WeightRangeSchema],
}
    ,
    {
        timestamps: false,
        _id: true
    });

const ShippingSchema = new mongoose.Schema(
    {
        regionName: {
            type: String,
            trim: true,
            default: "",
            required: true
        },
        regions: [regionSchema],
        shippingRateType: {
            type: String,
            trim: true,
            default: "",
            required: true
        },
        shippingOptions: [shippingOptionSchema],

        seqId: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

ShippingSchema.plugin(toJSON);
ShippingSchema.plugin(paginate);

ShippingSchema.pre('save', async function (next) {
    const shipping = this;

    shipping.seqId = await counterIncrementor('shipping');
    next();
});

/**
 * @typedef Shipping
 */
ShippingSchema.statics.getAllBrandNames = async function () {
    try {
        const brandNames = await this.distinct("brand");
        return brandNames;
    } catch (error) {
        console.error("Error while getting brand names:", error);
        throw error;
    }
};

const Shipping = mongoose.model('Shipping', ShippingSchema);

module.exports = Shipping;
