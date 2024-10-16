const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const couponServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getCouponseByid = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id']);

  const coupon = await couponServices.getcouponByid(id);
  if (coupon.status) {
    sendResponse(res, httpStatus.OK, coupon.data, null);
  } else {
    if (coupon.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, coupon.data);
    }
    else if (coupon.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, coupon.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, coupon.data);
    }
  }

});

module.exports = getCouponseByid
