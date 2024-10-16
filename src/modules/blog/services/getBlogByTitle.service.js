const Blog = require("../blog.model");

const getBlogByTitle = async (title) => {
	try {
		const listResult = await Blog.find({ title: title, active: true }).lean();

		if (listResult) {
			return { data: listResult, status: true, code: 200 };
		} else {
			return { data: "Blog not found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getBlogByTitle;
