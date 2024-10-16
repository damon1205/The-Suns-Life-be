const path = require('path');
const moment = require('moment');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = '417223194';
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'hybrid-robot-406207-a83cdae262cb.json');
const analyticsDataClient = new BetaAnalyticsDataClient();

async function googleDeviceData(filter) {
  let fromDate;

  if (!filter?.fromDate) {
    const currentDate = moment();
    // Subtract 30 days
    const newDate = currentDate.subtract(30, 'days');

    fromDate = newDate;
  } else {
    fromDate = new Date(filter.fromDate);
  }

  let toDate;

  if (!filter?.toDate) {
    toDate = new Date();
  } else {
    toDate = new Date(filter.toDate);
  }

  const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
  const formattedToDate = moment(toDate).format('YYYY-MM-DD');


  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: formattedFromDate,
        endDate: formattedToDate,
      },
    ],
    dimensions: [
      { name: "deviceCategory" }, // Include deviceCategory as a dimension
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'totalUsers' },
      { name: 'sessions' },
      { name: 'newUsers' },
      { name: 'eventCount' },
    ],
  });

  let data = [];
  response.rows.forEach(row => {
    const deviceData = {
      deviceCategory: row.dimensionValues[0].value, // Extract deviceCategory from the response
      activeUsers: parseInt(row.metricValues[0].value),
      totalUsers: parseInt(row.metricValues[1].value),
      sessions: parseInt(row.metricValues[2].value),
      newUsers: parseInt(row.metricValues[3].value),
      eventCount: parseInt(row.metricValues[4].value),
    };

    // Add device data to the object
    data.push(deviceData);
  });

  console.log("Device Data:", data);

  return { status: true, code: 200, data: data };
}

module.exports.googleDeviceData = googleDeviceData;
