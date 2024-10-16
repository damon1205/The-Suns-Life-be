const Blog = require("../blog.model");

const getAllBlog = async (page, limit) => {
	try {
		const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
		const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
		const skip = (start - 1) * length;

		const listResult = await Blog.aggregate([
			{ $sort: { _id: -1 } },
			{
				$project: {
					authorName: 1,
					title: 1,
					likesBy: 1,
					comments: 1,
					views: 1,
					active: 1,
				},
			},
		])
			.skip(skip)
			.limit(length);

		if (listResult?.length > 0) {
			const totalResults = await Blog.countDocuments({});
			const totalPages = Math.ceil(totalResults / length);
			return {
				data: listResult,
				totalResults,
				totalPages,
				page: start,
				limit: length,
				status: true,
				code: 200,
			};
		} else {
			return { data: "No blogs found", status: false, code: 404 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getAllBlog;
