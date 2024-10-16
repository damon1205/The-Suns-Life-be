const Blog = require("../blog.model");
const mongoose = require("mongoose");

const removeBlog = async (id, reqBody) => {
	try {
		let filterQuery = { _id: mongoose.Types.ObjectId(id) };
		const updateResult = await Blog.findOne(filterQuery);
		if (updateResult) {
			const deleteBlog = await Blog.findOneAndDelete(filterQuery);

			if (deleteBlog) {
				return { data: deleteBlog, message: "Blog deleted successfully", status: true, code: 200 };
			} else {
				return { data: "Something went wrong", status: false, code: 400 };
			}
		} else {
			return { data: "Blog Not Found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = removeBlog;
