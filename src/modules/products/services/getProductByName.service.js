const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const getProductByName = async (name) => {
   try {  
    const product = await ProductModel.findOne({active: true, name: name})
    if (product) {
        return { data: product, status:true,code:200 };
    }
    else{
        return { data: "Product Not Found", status:false,code:400 };
    }
    } catch (error) {
       return { data: error.message, status:false,code:500 };
   }
};

module.exports = getProductByName
