const express = require("express");
const blogControllers = require("../../modules/blog/controller");

const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/add-blog").post(auth("adminAccess"), blogControllers.addBlog);
router.route("/get-all-blog").get(auth("adminAccess"), blogControllers.getAllBlog);
router.route("/get-all-blog-public").get(blogControllers.getAllBlogsPublic);
router.route("/get-blog-by-title/:title").get(blogControllers.getBlogByTitle);
router.route("/handle-like/:id").put(auth("manageUsers"), blogControllers.handleLike);
router.route("/remove-blog/:id").delete(auth("adminAccess"), blogControllers.removeBlog);
router.route("/get-blog-by-id/:id").get(auth("adminAccess"), blogControllers.getBlogById);
router.route("/update-blog/:id").put(auth("adminAccess"), blogControllers.updateBlog);
router.route("/update-blog-views/:blogId").put(blogControllers.updateBlogViews);

module.exports = router;
