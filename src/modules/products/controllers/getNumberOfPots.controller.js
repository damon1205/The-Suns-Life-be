
const productServices = require("../services");
const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");

  const getNumberOfPotsController = catchAsync(async (req, res) => {
   

    const  numberOfPots= await productServices.getNumberOfPots();
    if ( numberOfPots.status) {
      sendResponse(res, httpStatus.OK,  numberOfPots, null);
    } else {
      if ( numberOfPots.code == 400) {
        sendResponse(res, httpStatus.BAD_REQUEST, null,  numberOfPots.data);
      } else if ( numberOfPots.code == 500) {
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null,  numberOfPots.data);
      } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null,  numberOfPots.data);
      }
    }
  });
  


module.exports =getNumberOfPotsController;
  