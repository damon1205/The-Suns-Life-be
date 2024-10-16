const express = require("express");
const categoryController = require("../../modules/Category/controller");

const router = express.Router();

router.route("/add-category").post(categoryController.addCategory);

router.route("/get-category").get(categoryController.getCategoryList);

router.route("/priortizeBrand").put(categoryController.priortizeBrand);

router.route("/getCategoryById/:id").get(categoryController.categoryGetById);

router.route("/delete-category/:id").post(categoryController.deleteCategory);

router.route("/find-product-by-category/:id").get(categoryController.getproductbycategory);

router.route("/add-product-In-category/:id").post(categoryController.updateProductInCatogry);

router.route("/geVatCharge-By-category/:id").get(categoryController.getVatchargeByCategory);

router.route("/updateVatChargeByCategory/:id").put(categoryController.updateVatChargeByCategory);

module.exports = router;
