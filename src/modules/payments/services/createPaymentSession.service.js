const mongoose = require("mongoose");
const TransactionModel = require("../transaction.model"); // Fixed the typo in variable name
const ProductModel = require("../../products/products.model");
const axios = require("axios");

const createPaymentSession = async (req) => {
  try {
    // Serialize the request body to JSON
    const requestData = JSON.stringify(req.body);

    const config = {
      method: "post",
      url: `https://api.pay360.com/hosted/rest/sessions/${process.env.PAY360INSTALLATIONID}/payments`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAY360USERNAME}:${process.env.PAY360PASSWORD}`
        ).toString("base64")}`,
      },
    data: requestData,
    };

    const response = await axios(config);

    console.log("success ----", JSON.stringify(response.data));

    if (response.data) {
      return { status: true, data: response.data, code: 200, msg: "success" };
    }
  } catch (error) {
    console.error("error -------", error);

    if (error.response) {
      // If the error is from the API response
      return {
        status: false,
        code: error.response.status,
        msg: error.response.data,
      };
    }

    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = createPaymentSession;
