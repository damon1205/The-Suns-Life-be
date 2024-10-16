const Blog = require("../blog.model");

const getAllBlogsPublic = async () => {
	try {
		const listResult = await Blog.aggregate([{ $match: { active: true } }, { $sort: { _id: -1 } }]);
		if (listResult) {
			return { data: listResult, status: true, code: 200 };
		} else {
			return { data: "No blogs found", status: false, code: 404 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getAllBlogsPublic;
