const WISHLIST = require("../wishlist.model");

const mongoose = require('mongoose');

const checkWishlistByProductId = async (cartData) => {
    
    let existingItem;
    try {
        if (cartData) {
            const { productId, userId } = cartData;

            
             existingItem = await WISHLIST.findOne({ productId, userId });
            

            if (existingItem) {
                
                return { status: true, code: 200, data: {isWistlist:true} };
              
               
            }
            else{
                return { status: true, code: 200, data: {isWistlist:false} };
            }
        }
       
      
    } catch (error) {
        console.log("Error while checking wishlist product:", error);
        return { status: false, code: 500, msg: error };
    }
}

module.exports = checkWishlistByProductId;
