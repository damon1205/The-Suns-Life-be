const COUPON_MODEL = require("../coupons.model");
const CATEGORY_MODEL = require("../../Category/category.modal");
const PRODUCT_MODEL = require("../../products/products.model")
const mongoose = require("mongoose");
const addCoupon = async (couponData) => {
    console.log("1")
    try {
        if (couponData) {
            if (couponData.code) {
                const existingCoupon = await COUPON_MODEL.findOne({ code: couponData.code });
                if (existingCoupon) {
                    return { status: false, code: 400, data: "Coupon with the same code already exists." };
                }
            }

            if (couponData.apply_to === "all_products" && couponData.type === "price") {
                const allProducts = await PRODUCT_MODEL.find();

                const isDiscountApplicable = allProducts.every(product => product.price > couponData.discount_price);
                console.log("isDiscountApplicable---",isDiscountApplicable)
                if (!isDiscountApplicable) {
                    return { status: false, code: 400, data: "Coupon discount is not applicable to all products." };
                }
            }

            if (couponData.apply_to === "specific_products" && couponData.specific_products && couponData.type === "price") {
                const specificProductIds = couponData.specific_products;
                const specificProducts = await PRODUCT_MODEL.find({ _id: { $in: specificProductIds } });


                const invalidProducts = specificProducts.every(product => product.price > couponData.discount_price);

                if (!invalidProducts) {
                    return {
                        status: false,
                        code: 400,
                        data: `Coupon discount is not applicable to specific product: ${specificProducts[0].name}, Because Discount is more than the price of product. `,
                    };
                }
            }
            if (couponData.apply_to === "specific_brand" && couponData.type === "price") {
                const brandName = couponData.specific_brand;
                const productsOfBrand = await PRODUCT_MODEL.find({categoryArray: { $in: [mongoose.Types.ObjectId(brandName)] }});
                const isDiscountApplicable = productsOfBrand.every(product => product.price > couponData.discount_price);
                let catgoryData = await CATEGORY_MODEL.findOne({ _id: mongoose.Types.ObjectId(brandName) });
                if (!isDiscountApplicable) {
                    return { status: false, code: 400, data: `Coupon discount is not applicable to all products of brand ${catgoryData?.name}, Because Discount is more than the price of brand product's.` };
                }
            }
            if (couponData.apply_to === "specific_products" && couponData.type === "automatic_discount") {
                const specificProductIds = couponData.specific_products_automatic;
                const specificProducts = await PRODUCT_MODEL.find({ _id: { $in: specificProductIds } });


                const invalidProducts = specificProducts.every(product => product.price > couponData.sale_price);
                if (!invalidProducts) {
                    return {
                        status: false,
                        code: 400,
                        data: `Coupon discount is not applicable to specific product, Because Discount is more than the price of product. `,
                    };
                }

                const usedProductIds = couponData.specific_products_automatic;
               
                const filter = {
                    type: "automatic_discount",
                    apply_to: "specific_products",
                    specific_products_automatic: { $in: usedProductIds }
                  };
                  
                  const update = {
                    $pull: { specific_products_automatic: { $in: usedProductIds } }
                  };
                  
                  await COUPON_MODEL.updateMany(filter, update);
            }
            const addResult = await COUPON_MODEL.create({ ...couponData });
            if (addResult) {    
                return { data: addResult, status: true, code: 200 };
            } else {
                return { data: "Cannot add Coupon", status: false, code: 400 };
            }
        }
    } catch (error) {
        return { status: false, code: 500, data: error };

    }
};

module.exports = addCoupon;
