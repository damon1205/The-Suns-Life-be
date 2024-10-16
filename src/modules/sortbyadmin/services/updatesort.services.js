const mongoose = require('mongoose');
const sortmodel = require('../sortby.modal');


const updatesortProduct = async ( reqBody) => {
  console.log("reqBody",reqBody);
  try {
    let filterQuery ={
        active: true, 
      };

    
    const updateResult = await sortmodel.findOneAndUpdate(filterQuery, {
        sortby: reqBody.sortby,
        sortbyvalue: reqBody.sortbyvalue,
     
    }, { new: true });

    
    if (updateResult) {
      
        return { data: updateResult, status: true, code: 200 }
      } 
     else {
      return { data: "Product Not Found", status: false, code: 400 }
    }
  } catch (error) {
   console.log("eooooooooo",error);
    return { data: error.message, status: false, code: 500 }
  }
};

module.exports = updatesortProduct
