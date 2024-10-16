const mongoose = require('mongoose');
const couponModel = require('../coupons.model');

const CouserCOuntIncreaseCouponupon = async (seriesId) => {
    try {
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(seriesId) }

        const updatedCoupon = await couponModel.findOneAndUpdate(
            filterQuery,
            {
                $inc: { used_count: 1 } 
            },
            { new: true }
        );
        if (updatedCoupon) {
            return { data: updatedCoupon, message: "Coupon called Successfully", status: true, code: 200 }
        } else {
            return { data: "Coupon Not Found", status: false, code: 400 }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = CouserCOuntIncreaseCouponupon



