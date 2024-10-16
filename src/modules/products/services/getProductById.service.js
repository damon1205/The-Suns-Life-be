const mongoose = require('mongoose');
const ProductModel = require('../products.model');


const getProductById = async (id) => {
   try {
      const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
      
      const product = await ProductModel.aggregate([
         { $match: filterQuery },
         {
            $lookup: {
               from: 'categories', 
               localField: 'categoryArray',
               foreignField: '_id',
               as: 'categories'
            }
         }
      ]);

      if (product.length > 0) {
         return { data: product[0], status: true, code: 200 };
      } else {
         return { data: "Product Not Found", status: false, code: 400 };
      }
   } catch (error) {
      return { data: error.message, status: false, code: 500 };
   }
};

module.exports = getProductById;