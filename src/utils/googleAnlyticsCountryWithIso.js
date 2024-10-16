const path = require('path');
const moment = require('moment');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = '417223194';
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'hybrid-robot-406207-a83cdae262cb.json');
const analyticsDataClient = new BetaAnalyticsDataClient();

async function googleAnlyticsCountryWithIso(filter) {
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
      { name: "countryIsoCode" }, // Include ISO code as a dimension
    ],
    metrics: [
      { name: 'sessions' }, // Include sessions as a metric
    ],
  });

  let data = [];
  response.rows.forEach(row => {
    const isoCode = row.dimensionValues[0].value;
    const value = parseInt(row.metricValues[0].value);

    // Push an object with country and value properties to the data array
    data.push({ country: isoCode, value: value });
  });

  console.log("Country Data:", data);

  return { status: true, code: 200, data: data };
}

module.exports.googleAnlyticsCountryWithIso = googleAnlyticsCountryWithIso;
