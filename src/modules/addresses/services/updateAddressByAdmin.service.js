const ADDRESS_MODEL = require("../addresses.model");
const OrderModel = require("../../orders/order.model");
const mongoose = require("mongoose");

const updateAddressByAdmin = async (addressData, id) => {
	try {
		if (addressData) {
			const { userId, isDefault } = addressData;
			const addressId = id;
			const filterQuery = { _id: mongoose.Types.ObjectId(addressId) };

			if (isDefault) {
				await ADDRESS_MODEL.updateMany({ isDefault: true }, { $set: { isDefault: false } });
			}

			const updateResult = await ADDRESS_MODEL.findOneAndUpdate(
				filterQuery,
				{ $set: { ...addressData } },
				{ new: true }
			);
			const update = {
				$set: { "shippingAdderess.shippingAddressObj": updateResult },
			};
			const updateadderes = await OrderModel.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(addressData?.orderId) },
				update,
				{ new: true }
			);

			if (updateResult) {
				return { data: updateResult, status: true, code: 200 };
			} else {
				return { data: "Address not found or update failed", status: false, code: 400 };
			}
		}
	} catch (error) {
		console.log("Error while updating address:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = updateAddressByAdmin;