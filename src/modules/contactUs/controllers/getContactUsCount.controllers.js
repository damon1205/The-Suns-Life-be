const httpStatus = require("http-status");
const getContactUsCountService = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");

const getContactUsCountController = async (req, res) => {
	try {
		const { fromDate, toDate } = req.query;
		const filter = {};
		let fDate = new Date(new Date(fromDate)).setHours(0, 0, 0);
		let tDate = new Date(new Date(toDate)).setHours(23, 59, 59);
		if (fromDate && toDate) {
			filter.createdAt = {
				$gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
				$lte: new Date(new Date(toDate).setHours(23, 59, 59)),
			};
		}
		const data = await getContactUsCountService.getContactUsCountService({ fDate, tDate, filter });
		sendResponse(res, httpStatus.OK, data, null);
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
		sendResponse(res, httpStatus.OK, data?.data?.data?.data, null);
	}
};

module.exports = getContactUsCountController;
