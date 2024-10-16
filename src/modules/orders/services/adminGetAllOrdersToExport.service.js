const OrderModel = require("./../order.model");

const adminGetAllOrdersToExport = async (filter, sort) => {

	try {
		let filterQuery = {
			active: true,
		};

		if (filter && filter.search !== undefined && filter.search !== "") {
			var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
			filterQuery.$or = [
				{ name: { $regex: searchRegex } },
				{ orderNo: { $regex: searchRegex } },
			]
		}

		let multiFilter = [];
		let andFilter = []
        let paymentStatusFilter = []
        let orderStatusFilter = []
        let searchFilter = []
        let deliveryFilter = []
		let dateFilter = []
		if (filter?.DatePayload) {
			if (filter?.DatePayload.fromDate && filter?.DatePayload.toDate) {
				const fromDate = new Date(filter?.DatePayload.fromDate);
				let toDate = new Date(filter?.DatePayload.toDate);
				toDate.setHours(23);
				toDate.setMinutes(59);
				toDate.setSeconds(59);
				filter.DatePayload = {
					...filter?.DatePayload,
					createdAt: { $gte: fromDate, $lt: toDate },
				};
				delete filter?.DatePayload.fromDate;
				delete filter?.DatePayload.toDate;

				dateFilter.push(filter?.DatePayload)
				// filterQuery = { ...filterQuery, ...filter?.DatePayload }
			}
		}
		if (filter?.orderNo) {
			searchFilter.push({ orderNo: { $regex: filter.orderNo, $options: "i" } })
			searchFilter.push({ "usersObj.username": { $regex: filter.orderNo, $options: "i" } })
		}

		if (filter?.fulfilledChecked == true) orderStatusFilter.push({ orderStatus: "fulfilled" })
		if (filter?.unfulfilledChecked == true) orderStatusFilter.push({ orderStatus: "unfulfilled" })
		if (filter?.partiallyFulfilledChecked == true) orderStatusFilter.push({ orderStatus: "partiallyfulfilled" })
		if (filter?.canceledChecked == true) orderStatusFilter.push({ orderStatus: "canceled" })

		if (filter?.paidChecked == true) paymentStatusFilter.push({ paymentStatus: "paid" })
		if (filter?.unpaidChecked == true) paymentStatusFilter.push({ paymentStatus: "unpaid" })
		if (filter?.partiallyPaidChecked == true) paymentStatusFilter.push({ paymentStatus: "partiallypaid" })
		if (filter?.refundedChecked == true) paymentStatusFilter.push({ paymentStatus: "refunded" })

		if (filter?.allInternationalDelivery==true) deliveryFilter.push({ deliveryMethod:"Royal Mail International Tracked" })
        if (filter?.allDomesticDelivery==true){
            deliveryFilter.push({ deliveryMethod:"Free Royal Mail 2nd Class; Non-tracked" })
            deliveryFilter.push({ deliveryMethod:"Royal Mail Tracked 24" })
            deliveryFilter.push({ deliveryMethod:"Royal Mail Tracked 48" })
        }

		if(paymentStatusFilter.length) andFilter.push({$or:paymentStatusFilter})
        if(orderStatusFilter.length) andFilter.push({$or:orderStatusFilter})
        if(searchFilter.length) andFilter.push({$or:searchFilter})
        if(deliveryFilter.length) andFilter.push({$or:deliveryFilter})
        if(dateFilter.length) andFilter.push({$or:dateFilter})

        if(andFilter.length) filterQuery = {...filterQuery, ...{$and:andFilter}}

		let sortQuery = { _id: -1 };

		for (let key in sort) {
			if (sort.hasOwnProperty(key)) {
				let value = sort[key];
				let numericValue = Number(value);
				if (!isNaN(numericValue)) {
					sort[key] = numericValue;
				}
			}
		}
		if (sort != null) {
			sortQuery = sort;
		}

		const aggregateQuery = [
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "usersObj"
				}
			},
			{
				$unwind: {
					path: '$usersObj',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$match: filterQuery,
			},
			{
				$sort: sortQuery
			}
		];
		const ordersList = await OrderModel.aggregate(aggregateQuery);
		const totalResults = await OrderModel.countDocuments(filterQuery);
		if (ordersList.length) {
			return {
				data: ordersList,
				totalResults,
				status: true,
				code: 200,
			};
		} else {
			return {
				status: false,
				code: 404,
				msg: "No order found"
			}
		}
	} catch (error) {
		console.log("Error while getting orders list :", error)
		return { status: false, code: 500, msg: error }
	}
}

module.exports = adminGetAllOrdersToExport