const express = require("express");
const validate = require("../../middlewares/validate")
const couponValidation = require("../../modules/coupons/coupons.validation")
const couponController = require("../../modules/coupons/controllers");
const auth = require("../../middlewares/auth");


const router = express.Router();

router.route('/add-coupon').post(auth("adminAccess"),validate(couponValidation.addCoupon), couponController.addCoupon);
router.route('/get-all-coupons').get(auth("adminAccess"), couponController.getAllCoupons)
router.route('/delete-coupons/:id').post(auth("adminAccess"), couponController.deleteCoupon)
router.route('/increase-coupons-count/:id').post(couponController.userCountIncrease)
router.route('/apply-coupon').post(couponController.applyCoupon)
router.route('/get-couponBy-id/:id').get(auth("adminAccess"), couponController.getCouponByid)
router.route('/apply-auto-discount').post(couponController.applyAutomaticDiscount)

module.exports = router;