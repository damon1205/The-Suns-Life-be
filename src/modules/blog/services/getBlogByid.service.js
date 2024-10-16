const Blog = require("../blog.model");
const mongoose = require("mongoose");

const getBlogByid = async (id) => {
	try {
		const passsQuery = { _id: mongoose.Types.ObjectId(id) };
		const listResult = await Blog.findOne(passsQuery);

		if (listResult) {
			return { data: listResult, status: true, code: 200 };
		} else {
			return { data: "Blog not found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getBlogByid;
