const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const Services = require('../services');

const userCOuntIncreaseCoupon = catchAsync(async (req, res) => {

  const { id } = await pick(req.params, ['id']);
  const result = await Services.userCountIncrease(id)
  if (result.status) {
    sendResponse(res, httpStatus.OK, result.data, null);
  } else {
    if(result.code == 400){
      sendResponse(res,httpStatus.BAD_REQUEST,null,result)
    }else if(result.code==500){
      sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,result.data)
    }else{
    sendResponse(res, httpStatus.BAD_REQUEST, null, result);
  }
}
});

module.exports = userCOuntIncreaseCoupon
