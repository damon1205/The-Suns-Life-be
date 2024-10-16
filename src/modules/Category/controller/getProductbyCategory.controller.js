const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const categoryServices = require("../Services");

const getproductbycategory = async (req, res) => {
	const { id, page, limit, filter, sort } = await pick(req.params, ["id"]);
	let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;

	const result = await categoryServices.getproductbycategory(id, page, limit, filter_Json_data, sort);
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

module.exports = getproductbycategory;
