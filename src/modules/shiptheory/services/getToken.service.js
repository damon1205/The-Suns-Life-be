const mongoose = require("mongoose");
const axios = require("axios");
const FormData = require("form-data");
const {addShipment} = require("./addShipment.service");
const { callAddShipment } = require("./updateTrackingId");

const getToken =  async(payload,orderId) => {
  try {
    

    let data = new FormData();
    
    data.append("email", process.env.SHIPTHEORY_EMAIL);
    data.append("password", process.env.SHIPTHEORY_PASSWORD);
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.shiptheory.com/v1/token",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then(async(response) => {
        console.log("response for shiptheory token----",JSON.stringify(response.data));
        console.log("response data tokend----",response.data.data.token);
        let token= response.data.data.token;
       
        let newData={
          token:token,
          payload:payload,
          orderId:orderId
        }
        console.log("call to get for new trnasaction 2")
        await callAddShipment(newData)
          



      })
      .catch((error) => {
        console.log("error for shiptheory token----",error);
      });

    //  return { data: insertResult, status: true, code: 200 };
  } catch (error) {
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = getToken;
