const mongoose = require("mongoose");
const axios = require("axios");
const orderModel = require("../../orders/order.model");

const addShipment = async (token, payload, orderId) => {
  try {
    const data = payload;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.shiptheory.com/v1/shipments",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token} `,
      },
      data: data,
    };

    const response = await axios.request(config);

    console.log("response to add shipment", JSON.stringify(response.data));

    if (response.data?.error) {
      await updateOrderModel(orderId, {
        shipTheoryRemarks: JSON.stringify(response.data),
      });
    }

    if (response.data?.success === true) {
      console.log(
        "yes updating ship theory details----",
        orderId,
        response.data.message,
        response.data.status
      );

      await updateOrderModel(orderId, {
        shipTheoryRemarks: response.data.message,
        shipTheoryStatus: response.data.status,
      });
    }

    // You can add a return statement here if needed
  } catch (error) {
    console.log("error to add shipment", error);
    await updateOrderModel(orderId, {
      shipTheoryRemarks: JSON.stringify(error),
    });
    return { status: false, code: 500, msg: error.message };
  }
};

const updateOrderModel = async (orderId, updateData) => {
  try {
    const updateResult = await orderModel.findByIdAndUpdate(orderId, updateData);
    // Log or handle the updateResult if needed
  } catch (error) {
    console.error("Error updating order model", error);
    // Handle the error as needed
  }
};

module.exports.addShipment = addShipment;
