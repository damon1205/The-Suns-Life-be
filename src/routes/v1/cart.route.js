const express = require("express");
const CartControllers = require("../../modules/cart/controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/add-to-cart").post(auth("manageUsers"), CartControllers.addToCartController);
router.route("/get-my-cart").get(auth("manageUsers"), CartControllers.getMyCartController);
router.route("/sent-abandoned-cart-mails").post(CartControllers.sentAbandonedCartMails);
router.route("/check-products-available").get(auth("manageUsers"), CartControllers.checkProductAvailable);
router.route("/remove-from-cart").post(auth("manageUsers"), CartControllers.removeFromCartController);
router.route("/remove-cart").post(auth("manageUsers"), CartControllers.removeCartController);
router.route("/nouser-add-to-cart").post(CartControllers.nouseraddtocart);
router.route("/nouser-get-my-cart").post(CartControllers.getMyCartByDevice);
router.route("/sync-cart").post(auth("manageUsers"), CartControllers.synccart);
router.route("/mix-add-to-cart").post(auth("manageUsers"), CartControllers.mixaddtocart);
router.route("/nouser-mix-add-to-cart").post(CartControllers.nousermixaddtocart);
router.route("/nouser-remove-cart").post(CartControllers.nouserRemoveCart);
router.route("/nouser-remove-from-cart").post(CartControllers.nouserRemoveFromCart);

module.exports = router;
