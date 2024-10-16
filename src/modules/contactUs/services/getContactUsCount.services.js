const ContactUsModel = require("../contactUserInfo.model");

const getContactUsCountService = async ({ fDate, tDate, filter }) => {
	try {
		let fD = new Date(fDate);
		let tD = new Date(tDate);
		const today = new Date();
		const Todaysdate = new Date(today);
		const todaysnewdate = new Date(today);
		todaysnewdate.setHours(0, 0, 0, 0);
		Todaysdate.setHours(23, 59, 55, 0);
		Todaysdate.setDate(Todaysdate.getDate());
		const TodaysCount = await ContactUsModel.countDocuments({
			createdAt: {
				$gte: todaysnewdate,
				$lte: Todaysdate,
			},
		});

		const yesterday = new Date();
		const Yesterday = new Date(yesterday);
		const yesterdaynew = new Date(yesterday);
		yesterdaynew.setHours(0, 0, 0, 0);
		Yesterday.setHours(23, 55, 0, 0);
		Yesterday.setDate(yesterday.getDate() - 2);
		const YesterDayCount = await ContactUsModel.countDocuments({
			createdAt: {
				$gte: Yesterday,
				$lt: yesterdaynew,
			},
		});
		const totaleCount = await ContactUsModel.countDocuments(filter);
		const result = await ContactUsModel.aggregate([
			{
				$match: filter,
			},
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
						day: { $dayOfMonth: "$createdAt" },
					},
					count: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					date: {
						$dateFromParts: {
							year: "$_id.year",
							month: "$_id.month",
							day: "$_id.day",
						},
					},
					count: 1,
				},
			},
		]);

		// compare previous slot
		let durationInMillis = tD - fD;

		// Calculate the duration in days
		let durationInDays = durationInMillis / (24 * 60 * 60 * 1000);

		// Create the previous slot start date by subtracting the duration from the start date
		let previousSlotStartDate = new Date(fD.getTime() - durationInMillis);

		// Set the previous slot end date as the day before the start date of the given range
		let previousSlotEndDate = new Date(fD.getTime() - 1);

		const prevTotalCount = await ContactUsModel.countDocuments({
			createdAt: {
				$gte: new Date(previousSlotStartDate),
				$lte: new Date(previousSlotEndDate),
			},
		});
		// // Calculate the percentage differences
		// // let formsPercentageDifference = ((totaleCount - prevTotalCount) / prevTotalCount) * 100;
		// let formsPercentageDifference = prevTotalCount === 0 ? 100 : ((totaleCount - prevTotalCount) / Math.abs(prevTotalCount)) * 100;
		// // Determine if it's growth or loss
		// let formsStatus = formsPercentageDifference >= 0 ? "growth" : "loss";

		// // Display the results
		// console.log(`Form ${formsStatus}: ${Math.abs(formsPercentageDifference).toFixed(2)}%`);

		return { result, prevTotalCount, totaleCount, TodaysCount, YesterDayCount };
	} catch (error) {
		throw error;
	}
};

module.exports = getContactUsCountService;
