const Blog = require("../blog.model");
const mongoose = require("mongoose");

const updateBlog = async (id, reqBody) => {
	try {
		const passsearchQuery = { _id: mongoose.Types.ObjectId(id) };

		const updateResult = await Blog.findOneAndUpdate(passsearchQuery, { ...reqBody }, { new: true });
		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		} else {
			return { data: "Blog Not Found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = updateBlog;
