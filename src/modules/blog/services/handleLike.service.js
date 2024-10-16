const Blog = require("../blog.model");
const mongoose = require("mongoose");

const handleLike = async (body, id, userId) => {
	try {
		const objectIdUserId = mongoose.Types.ObjectId(userId);
		const filterQuery = { _id: mongoose.Types.ObjectId(id) };

		// Use the $addToSet and $pull operators in a single update to efficiently handle the like/unlike logic
		const update = {
			$addToSet: {}, // Initialize empty; this will add userId to likesBy if not present
			$pull: {}, // Initialize empty; this will remove userId from likesBy if present
		};

		// Retrieve the current state of likesBy for the blog
		const blogData = await Blog.findById(id, "likesBy");

		if (!blogData) {
			return { msg: "Blog not found", status: false, code: 400 };
		}

		// Determine if the userId is already in the likesBy array
		const isLiked = blogData.likesBy.some((likeUserId) => objectIdUserId.equals(likeUserId));

		if (isLiked) {
			// If liked, prepare to remove the like
			update.$pull.likesBy = objectIdUserId;
		} else {
			// If not liked, prepare to add the like
			update.$addToSet.likesBy = objectIdUserId;
		}

		// Perform the update in a single operation
		const updateResult = await Blog.findOneAndUpdate(filterQuery, update, { new: true });

		if (updateResult) {
			return { data: updateResult, status: true, code: 200 };
		} else {
			return { msg: "Blog update failed", status: false, code: 400 };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = handleLike;
