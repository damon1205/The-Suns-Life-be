const mongoose = require('mongoose');
const product = require('../products.model');


const featureToggle = async (seriesId) => {
  try {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(seriesId) }

    const foundProduct = await product.findOne(filterQuery);

    if (!foundProduct) {
      return { data: "Product not found", status: false, code: 404 };
    }
   let stauts = !foundProduct?.isFeatured

   const result = await product.findOneAndUpdate(
    filterQuery,
    { $set: { isFeatured: stauts } },
    { new: true } // Corrected: Should be an object
  );

   if(result){
    return {data:result,status:true,code:200}
  }else{
    return {data:"Product Not Found",status:false,code:400}
  }

  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = featureToggle



