const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const blogServices = require("../services");

const handleLike = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	let userId = req.user._id;
	const body = req.body;
	const insertResult = await blogServices.handleLike(body, id, userId);

	if (insertResult?.status) {
		try {
			sendResponse(res, httpStatus.OK, insertResult.data, null);
		} catch (e) {
			console.log("Something error", e);
		}
	} else {
		sendResponse(
			res,
			insertResult.code == 400
				? httpStatus.BAD_REQUEST
				: insertResult.code == 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			insertResult.msg
		);
	}
});

module.exports = handleLike;
