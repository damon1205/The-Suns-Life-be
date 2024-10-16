const express = require("express");
const config = require('../../config/config');
const userRoute = require('./user.route');
const productsRoute = require('./products.route');
const cartRoute = require('./cart.route');
const wishlistRoute = require('./wishlist.route')
const authRoute = require('./auth.route');
const addressRoute = require('./address.route')
const orderRoute = require('./order.route')
const transactionRoute = require('./transaction.route')
const contactUsRoute = require('./contactus.route')
const shippingRoute = require('./shipping.route')
const notifyRoute = require('./notify.route')
const couponRoute = require('./coupon.route')
const googleAnalyticRoute = require('./googleAnalytics.route')
const categoryRoute = require("./category.route")
const siteMetaData = require("./siteMetaData.route")
const blogRoute = require("./blog.route")
const sortRoute = require("./sortproduct.route")

const { uploadFile, uploadThumbnail } = require("../../utils/fileUpload");

const router = express.Router();

const defaultRoutes = [
	// {
	// 	path: '/auth',
	// 	route: authRoute,
	// },
	{
		path: '/user',
		route: userRoute,
	},
	{
		path: '/products',
		route: productsRoute,
	},
	{
		path: '/cart',
		route: cartRoute,
	},
	{
		path: '/wishlist',
		route: wishlistRoute
	},
	{
		path: '/auth',
		route: authRoute
	},
	{
		path: '/address',
		route: addressRoute
	},
	{
		path: '/order',
		route: orderRoute
	},
	{
		path: '/transaction',
		route: transactionRoute
	},
	{
		path: '/contact-us',
		route: contactUsRoute
	},
	{
		path: '/shipping',
		route: shippingRoute
	},
	{
		path: '/notify',
		route: notifyRoute
	},
	{
		path: '/coupon',
		route:  couponRoute
	},
	{
		path: '/google-analytics',
		route:  googleAnalyticRoute
	},
	{
		path: '/category',
		route: categoryRoute
	},
	{
		path: '/site-metadata',
		route: siteMetaData
	},
	{
		path: '/blog',
		route: blogRoute
	},
	{
		path: '/product-sort',
		route: sortRoute
	},
	
]

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});
router.route('/upload-file').post(uploadFile);
router.route('/upload-thumbnail').post(uploadThumbnail);


module.exports = router;
