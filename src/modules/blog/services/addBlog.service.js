const Blog = require("../blog.model");

const addBlog = async (body) => {
	try {
		const updatedResult = await Blog.create(body);

		if (updatedResult) {
			return { data: updatedResult, status: true, code: 200 };
		} else {
			return { data: "Blog not added", status: false, code: 400 };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = addBlog;
