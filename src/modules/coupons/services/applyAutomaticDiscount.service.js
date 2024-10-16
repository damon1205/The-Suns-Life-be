const COUPON_MODEL = require("../coupons.model");
const CART_MODEL = require('../../cart/cart.model');

const applyAutomaticDiscount = async (cartData) => {
    try {
        let auto_discount = false; 

        const coupons = await COUPON_MODEL.find({
            type: 'automatic_discount',
            active: true,
            start_date: { $lte: new Date() },
            $or: [
                { is_expiry_date: false },
                { expiry_date: { $gte: new Date() } },
            ],
        });
        for (let coupon of coupons) {

            for (let cartItem of cartData) {
                let productIds = coupon?.specific_products_automatic ? coupon.specific_products_automatic.map((id) => id.toString()) : [];
                let productId = cartItem?.productDetails[0]._id ? cartItem?.productDetails[0]._id.toString() : "";
                
                if (productIds.includes(productId) && cartItem?.quantity>=coupon?.min_qty ) {
                    cartItem.couponName = coupon?.name;
                    cartItem.sale_price = coupon.sale_price; 
                    auto_discount = true; 
                }
            }
        }


        return { status: true, code: 200, data:{auto_discount: auto_discount, cartData:cartData} };
    } catch (error) {
        return { status: false, code: 500, data: error };
    }
};



module.exports = applyAutomaticDiscount;
