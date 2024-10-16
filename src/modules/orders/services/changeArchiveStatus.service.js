const mongoose = require('mongoose');
const orderModel = require('../order.model');

const changeArchiveStatus = async ({ orderIds }) => {
	try {
		if (orderIds.length > 0) {
			const objectIdArray = orderIds.map(id => mongoose.Types.ObjectId(id));
			const filterQuery = {
				active: true,
				archiveStatus: false,
				paymentStatus: { $in: ["paid", "unpaid"] },
				paymentType: "pay360",
				orderStatus: "unfulfilled",
				_id: { $in: objectIdArray }
			  };
			const updateResult = await orderModel.updateMany(filterQuery, { archiveStatus: true }, { new: true });
			if (updateResult?.nModified > 0) {
				return { data: `${updateResult?.nModified} orders archived.`, status: true, code: 200 }
			} else {
				return { msg: "No Orders to archive or already archived.", status: false, code: 400 }
			}
		} else {
			return { status: false, code: 400, msg: "No Orders Provided." }
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
};

module.exports = changeArchiveStatus