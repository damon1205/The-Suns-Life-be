const mongoose = require('mongoose');
const Coupon = require('../coupons.model');
const PRODUCT_MODEL = require('../../products/products.model');
const { categoryGetById } = require('../../Category/Services');

const getcouponByid = async (id) => {
    try {
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
        let coupon = await Coupon.findById(filterQuery);
      
        if (coupon) {
            let products =[]
            if (coupon?.specific_products?.length>0) {
                const productIds = coupon.specific_products;
                products = await PRODUCT_MODEL.find({ _id: { $in: productIds } });
            } else if (coupon?.specific_products_automatic?.length>0) {
             
                for (const productId of coupon?.specific_products_automatic) {
                    const product = await PRODUCT_MODEL.findById(productId);

                    if (product) {
                        products.push(product);
                    } else {
                        console.log(`Product with ID ${productId} not found`);
                    }
                }
            }
            else if (coupon?.specific_brand){
                const brandName = await categoryGetById(coupon?.specific_brand);
                const update = "specific_brand" 
                coupon[update]=brandName?.data?.name;
            
            }   
            return { data: { coupon: coupon, productDetail: products }, status: true, code: 200 };
        } else {
            return { data: "Coupon not found", status: false, code: 400 };
        }
    } catch (error) {
        // console.log(error.message);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getcouponByid
