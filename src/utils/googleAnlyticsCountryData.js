const path = require('path');
const moment = require('moment');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = '417223194';
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'hybrid-robot-406207-a83cdae262cb.json');
const analyticsDataClient = new BetaAnalyticsDataClient();

async function googleAnylticCountryData(filter) {
  let fromDate;

  if (!filter?.fromDate) {
    const currentDate = moment();
    // Subtract 30 days
    const newDate = currentDate.subtract(30, 'days');

    // Format the new date in 'YYYY-MM-DD' format
    console.log("newDate: " + moment(newDate).format('YYYY-MM-DD'));
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

  console.log(toDate);
  const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
  const formattedToDate = moment(toDate).format('YYYY-MM-DD');

  console.log("formattedFromDate: ", formattedFromDate, formattedToDate);

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: formattedFromDate,
        endDate: formattedToDate,
      },
    ],
    dimensions: [
      
      { name: "country" }, // Include country as a dimension
    ],
    metrics: [
      { name: 'totalUsers' }, // Use totalUsers as a metric
      { name: 'sessions' }, // Include sessions as a metric
    ],
  });

  let data = [];
  response.rows.forEach(row => {
    const countryData = {
      country: row.dimensionValues[0].value, // Extract country from the response
      totalUsers: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value), // Extract sessions from the response
    };

    // Add country data to the object
    data.push(countryData);
  });

  console.log("Country Data:", data);

  return { status: true, code: 200, data: data };
}

module.exports.googleAnylticCountryData = googleAnylticCountryData;
