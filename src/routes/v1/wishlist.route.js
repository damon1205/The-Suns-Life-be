const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const WishlistController= require("../../modules/wishlist/controllers");
const auth = require("../../middlewares/auth");


const router = express.Router();

router.route('/add-to-wishlist').post(auth('manageUsers'), WishlistController.addToWishlistController);
router.route('/get-wishlist-by-userId').get(auth('manageUsers'), WishlistController.getWishlistByUserIdController);
router.route('/delete').post(auth('manageUsers'), WishlistController.removeWishlistByProductIdController); 
router.route('/check-wishlist-product/:productId').get(auth('manageUsers'), WishlistController.checkWishlistByProductIdController); 

module.exports = router;
