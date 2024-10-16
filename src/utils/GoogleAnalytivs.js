const path = require('path');
const moment = require('moment');
/**
   * TODO(developer): Uncomment this variable and replace with your
   *   Google Analytics 4 property ID before running the sample.
   */
  propertyId = '417223194';

  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'hybrid-robot-406207-a83cdae262cb.json');
  // Imports the Google Analytics Data API client library.


const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport(filter) {
  let fromDate;

  if (!filter?.fromDate) {
    const currentDate = moment();
  // Subtract 30 days
const newDate = currentDate.subtract(30, 'days');

// Format the new date in 'YYYY-MM-DD' format
fromDate = newDate

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
      { name: "date" }
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
  let total = {
    activeUsers: 0,
    totalUsers: 0,
    sessions: 0,
    newUsers: 0,
    eventCount: 0,
  };

  response.rows.forEach(row => {
    const dateValue = row.dimensionValues[0].value;
	let formattedDate = `${dateValue.substring(0, 4)}-${dateValue.substring(4, 6)}-${dateValue.substring(6)}`;

    const dailyData = {
      date: formattedDate,
      activeUsers: parseInt(row.metricValues[0].value),
      totalUsers: parseInt(row.metricValues[1].value),
      sessions: parseInt(row.metricValues[2].value),
      newUsers: parseInt(row.metricValues[3].value),
      eventCount: parseInt(row.metricValues[4].value),
    };

    // Add daily data to the object with the date as the key
    data.push(dailyData);

    // Update the total
    total.activeUsers += dailyData.activeUsers;
    total.totalUsers += dailyData.totalUsers;
    total.sessions += dailyData.sessions;
    total.newUsers += dailyData.newUsers;
    total.eventCount += dailyData.eventCount;
  });
 data.sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log("Daily Data:", data);
  // console.log("Total Data:", total);

  return { status: true, code: 200, data: { daily: data, total: total } };
}

module.exports.runReport = runReport;
