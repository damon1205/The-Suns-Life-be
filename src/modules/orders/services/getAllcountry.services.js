const Order = require('../order.model');

/**
 * Get all shipping data
 * @returns {Promise<Object>} Result object
 */
const getAllCountryOrders = async () => {
	const filterQuery = {
		active: true,
	};

	try {
		const countries = await Order.find(filterQuery).distinct('shippingAdderess.shippingAddressObj.country');
		return { data: countries, status: true, code: 200 };

	} catch (error) {
		console.log("error", error);
		return { data: error.message, status: false, code: 500 };
	}
}

module.exports = getAllCountryOrders;
