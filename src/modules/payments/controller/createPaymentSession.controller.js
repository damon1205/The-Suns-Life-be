
const httpStatus = require('http-status');

const transactionServices = require("../services");
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const createPaymentSession = async (req, res) => {


  

   let result = await transactionServices.createPaymentSession(req);
   console.log("received result-----",result)
   if (result.status) {
    sendResponse(res,httpStatus.OK,result.data,null)
   } else {
      sendResponse(res,httpStatus.BAD_REQUEST,null,result.msg)
   }
 
 
};

module.exports = createPaymentSession;
