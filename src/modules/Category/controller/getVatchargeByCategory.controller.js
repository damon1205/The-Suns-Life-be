const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const categoryServices = require("../Services");

const getVatchargeByCategory = async (req, res) => {
	const { id } = await pick(req.params, ["id"]);

	const result = await categoryServices.getVatchargeByCategory(id);
	if (result) {
		sendResponse(res, httpStatus.OK, result.data, null);
	} else {
		if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else if (result?.code === 404) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	}
};

module.exports = getVatchargeByCategory;
