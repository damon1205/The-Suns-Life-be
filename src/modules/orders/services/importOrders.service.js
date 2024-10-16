const OrdersModel = require("../order.model");

const importOrders = async (orderDetailsArray) => {
	try {
		const result = await OrdersModel.create(orderDetailsArray);
		if (result?.length) {
			return {
				status: true, code: 201,
				data: {
					// result,
					importedOrders: result.length
				}
			}
		} else {
			return {status:false, code:400,msg:"Something went wrong."}
		}
	} catch (error) {
		console.log("Error while importing orders :-", error)
		return { status: false, code: 500, msg: error }
	}
}

module.exports = importOrders