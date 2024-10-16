const BlogModel = require("../blog.model");
const mongoose = require("mongoose");

const updateBlogViews = async (blogId, ipAddress) => {
	try {
		const checkBlogExists = await BlogModel.findOne({ _id: mongoose.Types.ObjectId(blogId), active: true });
		if (checkBlogExists) {
			if (checkBlogExists?.views?.length) {
				let updateRes = await BlogModel.updateOne(
					{
						_id: mongoose.Types.ObjectId(blogId),
						active: true,
						views: { $nin: [String(ipAddress)] },
					},
					{ $push: { views: String(ipAddress) } }
				);
				if (updateRes?.nModified == 1) {
					return { msg: "Already viewed.", status: false, code: 400 };
				} else {
					return { msg: "Already viewed.", status: false, code: 400 };
				}
			} else {
				let updateRes = await BlogModel.updateOne(
					{ _id: mongoose.Types.ObjectId(blogId), active: true },
					{ $set: { views: [String(ipAddress)] } }
				);
				if (updateRes?.nModified == 1) {
					return { data: "Blog views updated", status: true, code: 200 };
				} else {
					return { data: "Blog views not updated", status: false, code: 400 };
				}
			}
		} else {
			return { msg: "Blog not found", status: false, code: 404 };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = updateBlogViews;
