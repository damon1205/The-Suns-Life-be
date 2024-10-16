const mongoose = require('mongoose');
const ProductModel = require('../products.model');
const NotifyModel = require('../../notify/notifyProduct.model')
const emailServices = require('../../../utils/emailservice')
const { addCategory,updateProductInCatogry} = require('../../Category/Services');
const updateProductCategoryFromProduct = require('../../Category/Services/updateProductCategoryFromProduct.service');


const updateSeries = async (productId, reqBody) => {
  try {
    function isValidObjectId(id) {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      return objectIdRegex.test(id);
    }
    const filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) };
    const filterQueryNotify = { active: true, productId: mongoose.Types.ObjectId(productId) };
    const productBeforeUpdate = await ProductModel.findOne(filterQuery)
    const notifyCustomers = await NotifyModel.find(filterQueryNotify, 'email')
    const updateResult = await ProductModel.findOneAndUpdate(filterQuery, {
      name: reqBody.name,
      inventory: reqBody.inventory,
      description: reqBody.description,
      price: reqBody.price,
      features: reqBody.features,
      productImageUrl: reqBody.productImageUrl,
      cost: reqBody.cost,
      flavor: reqBody?.flavor,
      weight: reqBody?.weight,
      brand: reqBody?.brand,
      originalPrice:reqBody?.originalPrice,
      discountByRupees: reqBody?.discountByRupees,
      discountPercentage: reqBody?.discountPercentage,
      variants:reqBody?.variants,
      subImages: reqBody?.subImages,
      categoryArray:reqBody?.categoryArray,
      vatCharge:reqBody?.vatCharge,
      strength:reqBody?.strength,
      productType:reqBody?.productType,
      imageAltText:reqBody?.imageAltText


    }, { new: true });

    if (notifyCustomers.length > 0 && productBeforeUpdate.inventory != updateResult?.inventory) {
      for (let notifyEmail of notifyCustomers) {
        const productDetails = await ProductModel.findOne(filterQuery)
        emailServices.notifyCustomerProduct(notifyEmail.email, productDetails)
        const deactivateEmails = await NotifyModel.findOneAndUpdate(filterQueryNotify, { $set: { active: false } })
      }
    }


    if (updateResult) {
      if(reqBody?.brand!=""){
        const validationOfObjectId = isValidObjectId(reqBody?.brand)
        if(validationOfObjectId){      
            const upateProduct =   await updateProductCategoryFromProduct(reqBody?.brand,{productId:updateResult?. _id})        
        }else{        
            const category=   await addCategory({name:reqBody?.brand,image:updateResult._id})        
            const upateProduct =   await updateProductCategoryFromProduct(category?.data?._id,{productId:updateResult?. _id})    
        }
        return { data: updateResult, status: true, code: 200 }
      } else {
        return { data: updateResult, status: true, code: 200 }
      }
    } else {
      return { data: "Product Not Found", status: false, code: 400 }
    }
  } catch (error) {
   
    return { data: error.message, status: false, code: 500 }
  }
};

module.exports = updateSeries
