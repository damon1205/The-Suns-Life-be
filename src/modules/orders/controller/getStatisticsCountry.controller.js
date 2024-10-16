const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const getStatisticsCountry = catchAsync(async (req, res) => {
  let { fromDate, toDate,country } = await pick(req.query, ['fromDate', 'toDate','country'])
  let filterQuery = { active: true ,paymentType:"pay360"};
  filterQuery.paymentStatus = "paid";

  if (!fromDate) {
    const currentDate = new Date();
    fromDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
  
  }

  if (!toDate) {
    toDate = new Date();
  }

  if (fromDate && toDate) {
    filterQuery['createdAt'] = {
      '$gte': new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
      '$lte': new Date(new Date(toDate).setHours(23, 59, 59, 999))
    };
  }

  let result = await orderServices.getStatisticsCountry({ fromDate, toDate, filterQuery,country });

  if (result.status) {
    sendResponse(res, httpStatus.OK, result?.data, null);
  } else {
    sendResponse(res, result?.code === 400 ? httpStatus.BAD_REQUEST
      : result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
        : httpStatus.BAD_REQUEST,
      null, result?.msg);
  }
});

module.exports = getStatisticsCountry;
