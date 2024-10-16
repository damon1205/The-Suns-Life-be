const httpStatus = require('http-status');

const transactionServices = require("../services");
const { sendResponse } = require('../../../utils/responseHandler');
const updateTransaction = async (req, res) => {

	let data = req.body;
	let result = await transactionServices.updateTransaction(data)

	if (result?.status) {
		res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Your Payment</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
      
              <h1 style="color: #00a65a;">Thank You for Your Payment!</h1>
      
              <p style="font-size: 18px; color: #333;">Your payment has been successfully processed.</p>
      
              <p style="font-size: 16px; color: #555; margin-top: 20px;">We appreciate your business. If you have any questions or need assistance, please don't hesitate to contact us.</p>
      
              <div style="margin-top: 20px;">
                  <button style="background-color: #00a65a; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px;" id="continueShoppingBtn"><a href="http://206.189.130.110:3000/" style="text-decoration: none; color:white">Continue Shopping</a></button>
              </div>
              
              <!-- Container to display the response from the URL -->
              <div id="responseContainer" style="margin-top: 20px;"></div>
          </div>
      

      </body>
      </html>
      `)
	} else {
		sendResponse(res,
			result?.code == 500 ? httpStatus?.INTERNAL_SERVER_ERROR 
			: httpStatus.BAD_REQUEST,
			null,
			result?.msg
		)
	}


};

module.exports = updateTransaction;
