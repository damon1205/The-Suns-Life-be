
const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const getStatisticsCountry = async ({fromDate,toDate,  filterQuery,country }) => {
  try {
    const localTimeZone =momentTimezone.tz.guess();
    let countryArray=JSON.parse(country);
    const countriesToExclude = ["USA","Canada","United States","CAN", 'AUS', 'Australia', 'New Zealand', 'NZL'];
    if(countryArray=="United Kingdom"){
      
        filterQuery['shippingAdderess.shippingAddressObj.country'] = {$nin: countriesToExclude};
    }
    else{
      filterQuery['shippingAdderess.shippingAddressObj.country'] = { $in: JSON.parse(country) };
    }
    const pipeline = [
      { $match: filterQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt",timezone:localTimeZone } },
          dailytotalSales: { $sum: "$amountToPay" },
          totalOrders: { $sum: 1 },
          averageValue: { $avg: "$amountToPay" }
        },
      },
      
      {
        $sort:{
          _id: 1
        }
      }
    ];
    
    const dailyAggregates = await OrderModel.aggregate(pipeline)
    let price = 0;
    let sumOfTotalOrders = 0;
    for(let i = 0 ; i<dailyAggregates.length; i++) {
          price += Number(dailyAggregates[i].dailytotalSales)?Number(dailyAggregates[i].dailytotalSales):0;
          sumOfTotalOrders +=(Number(dailyAggregates[i].totalOrders)?Number(dailyAggregates[i].totalOrders):0)
       
    }

    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    console.log('yesterday', previousDate);
    const YesterdayOrders = await OrderModel.countDocuments({
      paymentStatus: "paid",
      ['shippingAdderess.shippingAddressObj.country'] : filterQuery['shippingAdderess.shippingAddressObj.country'],
      createdAt: {
        '$gte': new Date(new Date(previousDate).setHours(0, 0, 0, 0)),
      '$lte': new Date(new Date(previousDate).setHours(23, 59, 59, 999))
      }
    });

    const YesterdaySales = await OrderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          ['shippingAdderess.shippingAddressObj.country'] : filterQuery['shippingAdderess.shippingAddressObj.country'],
          createdAt: {
            '$gte': new Date(new Date(previousDate).setHours(0, 0, 0, 0)),
          '$lte': new Date(new Date(previousDate).setHours(23, 59, 59, 999))
          }
        } 
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amountToPay" }
        }
      }
    ]);
   const YesterdaySale = YesterdaySales[0]?.totalSales || 0;
   const averageValue = sumOfTotalOrders > 0 ? Number((price / sumOfTotalOrders)) : 0;
   const today = new Date();

  const todayOrders = await OrderModel.countDocuments({
  paymentStatus: "paid",
  ['shippingAdderess.shippingAddressObj.country'] : filterQuery['shippingAdderess.shippingAddressObj.country'],
  createdAt: {
    '$gte': new Date(new Date(today).setHours(0, 0, 0, 0)),
  '$lte': new Date(new Date(today).setHours(23, 59, 59, 999))
  }
});

const todaySales = await OrderModel.aggregate([
  {
    $match: {
      paymentStatus: "paid",
      ['shippingAdderess.shippingAddressObj.country'] : filterQuery['shippingAdderess.shippingAddressObj.country'],
      createdAt: {
        '$gte': new Date(new Date(today).setHours(0, 0, 0, 0)),
      '$lte': new Date(new Date(today).setHours(23, 59, 59, 999))
      }
    }
  },
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$amountToPay" }
    }
  }
]);

  const todaySale = todaySales[0]?.totalSales || 0;
  let durationInMillis = new Date(toDate) - new Date(fromDate);
  let durationInDays = durationInMillis / (24 * 60 * 60 * 1000);
  const newSatrtDate =   moment(fromDate).subtract(durationInDays == 0?1:durationInDays, 'days').format('YYYY-MM-DD');
    
  const filterQueryPrev = {
      paymentStatus: "paid",
       createdAt: {
        '$gte': new Date(new Date(newSatrtDate).setHours(0, 0, 0, 0)),
      '$lte': new Date(new Date(fromDate).setHours(0, 0, 0, 0))
      }
    }
    filterQueryPrev['shippingAdderess.shippingAddressObj.country'] =filterQuery['shippingAdderess.shippingAddressObj.country'];
    const pipeline2 = [
      { $match: filterQueryPrev },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$amountToPay" },
          totalOrders: { $sum: 1 },
          averageValue: { $avg: "$amountToPay" }
        },
      },
      
      {
        $sort:{
          _id: 1
        }
      }
    ];
    
    const prevAggegate = await OrderModel.aggregate(pipeline2)
    let prevPrice = 0;
    let prevTotalOrder = 0;
    for(let i = 0 ; i<prevAggegate.length; i++) {
      prevPrice += Number(prevAggegate[i].totalSales)? Number(prevAggegate[i].totalSales):0;
      prevTotalOrder += (Number(prevAggegate[i].totalOrders)? Number(prevAggegate[i].totalOrders):0)
       
    }
  
if(dailyAggregates){
    return {
      data: {
        prevTotalPrice: Number( (prevPrice).toFixed(2)),
        prevTotalOrders: prevTotalOrder,
        totalSales: Number(price.toFixed(2)) || 0,
        totalOrders: sumOfTotalOrders|| 0,
        averageValue: Number((averageValue).toFixed(2)),
        todayOrders: todayOrders || 0,
         todaySales: Number((todaySale).toFixed(2)) || 0,
        YesterdayOrders: YesterdayOrders || 0,
        YesterdaySales: YesterdaySale,
        dailyData:dailyAggregates, 
  
      },

      status: true,
      code: 200
    };
  }
  else{
    return {data:data, status:false, code:400                                                                                                          }
  }
  } catch (error) {
   
   
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getStatisticsCountry;
