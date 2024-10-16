const mongoose = require('mongoose');
const couponModel = require('../coupons.model');

const deleteCoupon = async (seriesId) => {
  try {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(seriesId) }

      const removed = await couponModel.findOneAndDelete(filterQuery)
      if (removed) {
        return { data: removed, message: "Coupon Deleted Successfully", status: true, code: 200 }
      } else {
        return { data: "Coupon Not Found", status: false, code: 400 }
      }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deleteCoupon



