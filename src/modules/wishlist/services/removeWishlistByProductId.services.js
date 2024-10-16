const WISHLIST = require("../wishlist.model");

const mongoose = require('mongoose');

const removeWishlistByProductId = async (cartData) => {
    
    let existingItem;
    try {
        if (cartData) {
            const { productId, userId } = cartData;

            
             existingItem = await WISHLIST.findOne({ productId, userId });

            if (existingItem) {
                
                const res= await WISHLIST.findOneAndDelete({ productId, userId });
              
               
            }
            else{
                return { status: true, code: 200, data: 'No data in user wishlist' };
            }
        }
       
        return { status: true, code: 200, data: 'Item remove from wishlist' };
    } catch (error) {
        console.log("Error while removing item from the wishlist:", error);
        return { status: false, code: 500, msg: error };
    }
}

module.exports = removeWishlistByProductId;
