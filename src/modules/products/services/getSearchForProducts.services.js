const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const getSearchProducts = async (keyword) => {
    try {
      // Use a regular expression to search for products containing the keyword
      const searchResult = await ProductModel.find({ active:true, visible:true, name: { $regex: new RegExp(keyword, 'i') } });
  
      if (searchResult) {
        return { data: searchResult, status: true, code: 200 };
      } else {
        return { data: "Search Result Not Found", status: false, code: 400 };
      }
    } catch (error) {
      return { data: error.message, status: false, code: 500 };
    }
  };
  
  module.exports = getSearchProducts;
  
