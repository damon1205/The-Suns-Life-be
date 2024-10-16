const express = require("express");
const validate = require("../../middlewares/validate")
const productsController = require("../../modules/products/controllers")
const auth = require("../../middlewares/auth")

const router = express.Router();

router.route('/create-products-collection').post(productsController.createProductsCollection);
router.route('/update-all-inventories').post(productsController.updateAllInventories);
router.route('/add-product').post(auth("adminAccess"), productsController.addProduct);
router.route('/delete-product/:id').delete(auth("adminAccess"), productsController.deleteProduct);
router.route('/update-product/:id').put(auth("adminAccess"), productsController.updateProduct);

router.route('/update-product-specific/:id').put(auth("adminAccess"), productsController.updateProductSpecific);

router.route('/update-product-inventory/:id').put(auth("adminAccess"), productsController.updateInventory);
router.route('/get-all-products').get(productsController.getAllProducts)
router.route('/get-productbyId/:id').get(auth("adminAccess"), productsController.getProductById)
router.route('/getproductbyid/:id').get( productsController.getProductById)
router.route('/getproduct-By-name/:name').get(productsController.getproductByName)
router.route('/add-category').post(auth("adminAccess"), productsController.addCategory);
router.route('/getproduct-by-category/:category').get(productsController.youmaylike);

router.route('/getproduct-By-brand/:name').get(auth("adminAccess"), productsController.findProductbyBrand)

router.route('/getallbrand-name/').get(productsController.getallBrandnamesForWebcontroller)

router.route('/getproductBrand-name/').get(productsController.getAllBrandNames)

router.route('/delete-category/:name').put(auth('adminAccess'), productsController.deleteCategory)
router.route('/getallflavour-name').get(productsController.getallFlavournamesForWebcontroller)
router.route('/get-all-product-type').get(productsController.getallProductType)
router.route('/get-number-of-pots').get(productsController.getNumberOfPotscontroller)

router.route('/getfeatured').get(productsController.getFeaturedProduct)
router.route('/admin-get-all-products').get(auth('adminAccess'), productsController.getAllProductsadmin)
router.route('/get-searchproducts').get(productsController.getSerchProducts)

//for admin
router.route('/get-all-Products-admin/').get(productsController.getAllProductsadminontroller)
router.route('/featureToggle/:id').post(auth('adminAccess'), productsController.featureToggle)
router.route('/visibleToggle/:id').post(auth('adminAccess'), productsController.visibleToggle)
router.route('/getProductByNameOfCategory/:name').get( productsController.getProductByNameOfCategory)
router.route('/get-all-products-inventory').get( productsController.getAllProductsInventory)
router.route('/fetch-all-products').get( productsController.fetchAllProducts)

module.exports = router;