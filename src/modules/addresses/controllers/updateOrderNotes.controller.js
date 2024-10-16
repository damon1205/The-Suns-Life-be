const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");
const pick = require("../../../utils/pick");

const updateOrderNotes = catchAsync(async (req, res) => {
	try {
		const userId = req?.user?.id;
		const { id } = await pick(req.params, ["id"]);
		const { orderNotes } = await pick(req.body, ["orderNotes"]);

		const result = await Services.updateOrderNotes(userId, id, orderNotes);

		if (result?.code === 200) {
			sendResponse(
				res,
				httpStatus.OK,
				{
					data: result?.data,
				},
				null
			);
		} else if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	} catch (error) {
		console.log("Error while updating address:", error);
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
	}
});

module.exports = updateOrderNotes;