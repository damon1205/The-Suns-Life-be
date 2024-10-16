const WISHLIST = require("../wishlist.model");

const mongoose = require('mongoose');

const addToWishlist = async (cartData) => {
    try {
        if (cartData) {
            const { productId, userId } = cartData;

            
            const existingItem = await WISHLIST.findOne({ productId, userId });

            if (!existingItem) {
                
                const newItem = new WISHLIST({  productId:productId, userId:userId, isWishlisted: true });
                await newItem.save();
            }
        }

        return { status: true, code: 200, data: 'Item added to wishlist' };
    } catch (error) {
        console.log("Error while adding item to the wishlist:", error);
        return { status: false, code: 500, msg: error };
    }
}

module.exports = addToWishlist;
