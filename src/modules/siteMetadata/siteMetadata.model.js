const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const siteMetadataSchema = mongoose.Schema(
  {
    title:{
      type:String
    },
    statements: {
      type: Array,
      required: true,
    },
   
    type: {
      type: String,
      required: true,
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
siteMetadataSchema.plugin(toJSON);
siteMetadataSchema.plugin(paginate);
// siteMetadataSchema.pre("save", async function (next) {
//   const doc = this;
//   doc.seqId = await counterIncrementor("Order");
//   doc.orderNo = `#` + (26149 + doc.seqId);
//   next();
// });

/**
 * @typedef Product
 */


const siteMetadataModel = mongoose.model("siteMetadata", siteMetadataSchema);

module.exports = siteMetadataModel;
