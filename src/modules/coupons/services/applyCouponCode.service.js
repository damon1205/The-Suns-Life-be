const COUPON_MODEL = require("../coupons.model");
const CART_MODEL = require('../../cart/cart.model');

const applyCoupon = async (cartData, couponCode, deliveryCharge) => {
    try {
        const coupon = await COUPON_MODEL.findOne({ code: couponCode });
        if (!coupon) {
            return { status: false, code: 404, data: "Coupon not found" };
        }

        if (!coupon.active) {
            return { status: false, code: 400, data: "Coupon is not active" };
        }

        if (coupon?.start_date > new Date()) {
            return { status: false, code: 400, data: "Coupon not found" };
        }

        if (coupon.is_expiry_date && coupon.expiry_date < new Date()) {
            return { status: false, code: 400, data: "Coupon has expired" };
        }

        if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
            return { status: false, code: 400, data: "Coupon has reached maximum uses" };
        }
        if (
            (coupon.apply_to === "specific_brand" && !cartData.some(item => item.productDetails[0].categoryArray.includes(coupon.specific_brand))) ||
            (coupon.apply_to === "specific_products" && !cartData.some(item => coupon.specific_products.includes(item.productId)))
        ) {
            return { status: false, code: 400, data: "Coupon does not apply to any products in the cart" };
        }

        let discountedTotalPrice = 0;
        let originalPrice = 0;

        if (coupon.apply_to === "all_products") {
            for (const item of cartData) {
                // const productPrice = item?.sale_price ? item?.sale_price* item.quantity :item.productDetails[0].price * item.quantity;
                const productPrice = item?.sale_price ? item?.sale_price : item.productDetails[0].price
                const discountedPrice = calculateDiscountedPrice(coupon, productPrice, item.quantity);
                discountedTotalPrice += discountedPrice;
                originalPrice += item.productDetails[0].price * item.quantity;
            }
        } else if (coupon.apply_to === "specific_products") {
            for (const item of cartData) {
                if (coupon.specific_products.includes(item.productId)) {
                    // const productPrice = item?.sale_price ? item?.sale_price* item.quantity :item.productDetails[0].price * item.quantity;
                    const productPrice = item?.sale_price ? item?.sale_price : item.productDetails[0].price
                    const discountedPrice = calculateDiscountedPrice(coupon, productPrice, item.quantity);
                    discountedTotalPrice += discountedPrice;
                    originalPrice += item.productDetails[0].price * item.quantity;
                } else {
                    discountedTotalPrice += (item?.sale_price ? item?.sale_price * item.quantity : item.productDetails[0].price) * item.quantity;
                    originalPrice += item.productDetails[0].price * item.quantity;
                }
            }
        } else if (coupon.apply_to === "specific_brand") {
            const brandProducts = cartData.filter(item => item.productDetails[0].categoryArray.includes(coupon.specific_brand));
            const otherProducts = cartData.filter(item => !item.productDetails[0].categoryArray.includes(coupon.specific_brand));

            for (const item of brandProducts) {
                // const productPrice = item?.sale_price ? item?.sale_price* item.quantity :item.productDetails[0].price * item.quantity;
                const productPrice = item?.sale_price ? item?.sale_price : item.productDetails[0].price
                const discountedPrice = calculateDiscountedPrice(coupon, productPrice, item.quantity);
                discountedTotalPrice += discountedPrice;
                originalPrice += item.productDetails[0].price * item.quantity;
            }

            for (const item of otherProducts) {
                discountedTotalPrice += (item?.sale_price ? item?.sale_price * item.quantity : item.productDetails[0].price) * item.quantity;
                originalPrice += item.productDetails[0].price * item.quantity;
            }
        } else if (coupon.apply_to === "minimum_order_subtotal") {
            let subtotal = 0;
            for (let cartItem of cartData) {
                const productPrice = cartItem?.sale_price ? cartItem?.sale_price : cartItem.productDetails[0].price
                subtotal = Number(Number(subtotal + Number(Number(productPrice * cartItem.quantity).toFixed(2))).toFixed(2));
            }

            if (subtotal >= coupon?.minimum_order_subtotal) {
                let discountPrice = 0;
                if (coupon?.type === "price" && coupon?.discount_price) {
                    discountPrice = coupon.discount_price;
                } else if (coupon?.type === "percentage" && coupon?.discount_percentage) {
                    discountPrice = subtotal * (coupon.discount_percentage / 100);
                }
                // Calculate discounted total price with two decimal places
                discountedTotalPrice = Number((subtotal - discountPrice).toFixed(2));            
                originalPrice = subtotal;
            } else {
                return { status :false, code:400, data:`This coupon is aplicable on minimum order subtotal of £ ${coupon?.minimum_order_subtotal}`}
            }
        } else if (coupon.apply_to === "minimum_order_subtotal_shipping") {
            let subtotal = 0;
            for (let cartItem of cartData) {
                const productPrice = cartItem?.sale_price ? cartItem?.sale_price : cartItem.productDetails[0].price
                subtotal = Number(Number(subtotal + Number(Number(productPrice * cartItem.quantity).toFixed(2))).toFixed(2));
            }
            subtotal += deliveryCharge;

            if (subtotal >= coupon?.minimum_order_subtotal_shipping) {
                let discountPrice = 0;
                if (coupon?.type === "price" && coupon?.discount_price) {
                    discountPrice = coupon.discount_price;
                } else if (coupon?.type === "percentage" && coupon?.discount_percentage) {
                    discountPrice = subtotal * (coupon.discount_percentage / 100);
                }
                // Calculate discounted total price with two decimal places
                discountedTotalPrice = Number(((subtotal) - discountPrice).toFixed(2));   
                originalPrice = subtotal;
            } else {
                return { status :false, code:400, data:`This coupon is aplicable on minimum order subtotal of £ ${coupon?.minimum_order_subtotal_shipping}`}
            }
        }

        return { status: true, code: 200, data: { coupon: coupon, discountedTotalPrice: discountedTotalPrice.toFixed(2), originalPrice: originalPrice.toFixed(2) } };

    } catch (error) {
        return { status: false, code: 500, data: error };
    }
};

const calculateDiscountedPrice = (coupon, originalPrice, quantity) => {
    let discountedPrice = originalPrice;
    let itemQuantity = quantity

    if (coupon.type === "price") {
        let discountedSalePrice = originalPrice - coupon.discount_price;
        discountedPrice = Number(discountedSalePrice.toFixed(2)) * itemQuantity;
    } else if (coupon.type === "percentage") {
        let discountedSalePrice = originalPrice - originalPrice * coupon.discount_percentage / 100;
        discountedPrice = Number(discountedSalePrice.toFixed(2)) * quantity
    }

    return discountedPrice;
};

module.exports = applyCoupon;
