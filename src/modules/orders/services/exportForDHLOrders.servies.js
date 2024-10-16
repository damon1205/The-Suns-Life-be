const OrdersModel = require("./../order.model");

const getOrdersForDHL = async (page, limit, filter, sort) => {
	try {
		const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
		const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
		const skip = (start - 1) * length;
		let filterQuery = {
			active: true,
			paymentType: "pay360",
			archiveStatus: filter?.isArchiveStatus ? true : false,
		};
		let sortQuery = { orderNo: -1 };

		let andFilter = [];
		let paymentStatusFilter = [];
		let orderStatusFilter = [];
		let searchFilter = [];
		let deliveryFilter = [];
		let dateFilter = [];

		if (filter && filter.search !== undefined && filter.search !== "") {
			var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
			filterQuery.$or = [
				{ name: { $regex: searchRegex } },
				{ orderNo: { $regex: searchRegex } },
				{ couponName: { $regex: searchRegex } },
			]
		}

		if (filter?.DatePayload?.fromDate && filter?.DatePayload?.toDate) {
			/* const fromDate = new Date(filter.DatePayload.fromDate);
				  const toDate = new Date(filter.DatePayload.toDate);
				  toDate.setHours(23, 59, 59); */

			filter.DatePayload = {
				createdAt: {
					$gte: new Date(
						new Date(filter.DatePayload.fromDate).setHours(0, 0, 0, 0)
					),
					$lte: new Date(
						new Date(filter.DatePayload.toDate).setHours(23, 59, 59, 999)
					),
				},
			};

			dateFilter.push(filter.DatePayload);
		}

		if (filter?.orderNo) {
			searchFilter.push({ orderNo: { $regex: filter.orderNo, $options: "i" } });
			searchFilter.push({"couponName": { $regex: filter.orderNo, $options: "i" },});
			searchFilter.push({"usersObj.username": { $regex: filter.orderNo, $options: "i" },});
			searchFilter.push({ "shippingAdderess.shippingAddressObj.firstName": { $regex: filter.orderNo, $options: "i" } })
			searchFilter.push({ "shippingAdderess.shippingAddressObj.lastName": { $regex: filter.orderNo, $options: "i" } })
		}
		if (filter?.fulfilledChecked == true)
			orderStatusFilter.push({ orderStatus: "fulfilled" });
		if (filter?.unfulfilledChecked == true)
			orderStatusFilter.push({ orderStatus: "unfulfilled" });
		if (filter?.partiallyFulfilledChecked == true)
			orderStatusFilter.push({ orderStatus: "partiallyfulfilled" });
		if (filter?.canceledChecked == true)
			orderStatusFilter.push({ orderStatus: "canceled" });

		if (filter?.paidChecked == true)
			paymentStatusFilter.push({ paymentStatus: "paid" });
		if (filter?.unpaidChecked == true)
			paymentStatusFilter.push({ paymentStatus: "unpaid" });
		if (filter?.partiallyPaidChecked == true)
			paymentStatusFilter.push({ paymentStatus: "partiallypaid" });
		if (filter?.refundedChecked == true)
			paymentStatusFilter.push({ paymentStatus: "refunded" });

		// if (filter?.allInternationalDelivery == true) {
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail International Tracked" })
		// }
		// if (filter?.royalMailDelivery == true) {
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail International Tracked" })
		//   deliveryFilter.push({ deliveryMethod: "Free Royal Mail 2nd Class; Non-tracked" })
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 24" })
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 48" })
		// }
		// if (filter?.allDomesticDelivery == true) {
		//   deliveryFilter.push({ deliveryMethod: "Free Royal Mail 2nd Class; Non-tracked" })
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 24" })
		//   deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 48" })
		// }
		deliveryFilter.push({ deliveryMethod: "DHL Express" })

		if (paymentStatusFilter?.length)
			andFilter.push({ $or: paymentStatusFilter });
		if (orderStatusFilter?.length) andFilter.push({ $or: orderStatusFilter });
		if (searchFilter?.length) andFilter.push({ $or: searchFilter });
		if (deliveryFilter?.length) andFilter.push({ $or: deliveryFilter });
		if (dateFilter?.length) andFilter.push({ $or: dateFilter });

		if (andFilter?.length)
			filterQuery = { ...filterQuery, ...{ $and: andFilter } };

		if (sort != null) {
			for (let key in sort) {
				if (sort.hasOwnProperty(key)) {
					let value = sort[key];
					let numericValue = Number(value);
					if (!isNaN(numericValue)) {
						sort[key] = numericValue;
					}
				}
			}
			sortQuery = sort;
		}


		const aggregateQuery = [
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "usersObj",
				},
			},
			{
				$unwind: {
					path: "$usersObj",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: filterQuery,
			},
			{
				$addFields: {
					amountInGBP: {
						$divide: [
							"$amountToPay",
							{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
						]
					},
					deliveryInGBP: {
						$divide: [
							{ $cond: { if: { $gt: ["$deliveryCharge", 0] }, then: "$deliveryCharge", else: 4 } },
							{ $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
						]
					}
				}
			},
			{
				$sort: sortQuery,
			},
			{
				$project: {
					recipientName: "Dylan Moore",
					deliveryCompany: "TSL Limited",
					senderEmail: "info@thesnuslife.com",
					recipientPhoneCountryCode: "+44",
					recipientPhoneNumber: "7712884955",
					AddressOne: "New Hall, New Road",
					deliveryCity: "Lambourne End",
					ZipCode: "RM41AJ",
					CountryCode: "GB",

					recipientEmail: "$shippingAdderess.shippingAddressObj.email",
					NameShipTo: {
						$concat: [
							"$shippingAdderess.shippingAddressObj.firstName",
							" ",
							"$shippingAdderess.shippingAddressObj.lastName",
						],
					},
					phoneNumberShipTo: "$shippingAdderess.shippingAddressObj.phone",
					phoneCountryCodeShipTo: "+1",
					deliveryCountry: "$shippingAdderess.shippingAddressObj.country",
					deliveryState: "$shippingAdderess.shippingAddressObj.state",
					CityShipTo: "$shippingAdderess.shippingAddressObj.city",
					AddressOneShipTo: "$shippingAdderess.shippingAddressObj.address",
					deliveryAddressLine2: "$shippingAdderess.shippingAddressObj.addressLine2",
					CountryCodeShipTo: "$shippingAdderess.shippingAddressObj.iso",
					DeclaredValue: {
						$round: [
							{
								$divide: [
									{ $subtract: ["$amountInGBP", "$deliveryInGBP"] },
									4
								]
							},
							2
						]
					},
					DeclaredValueCurrency: "GBP",
					AccountNumberShipper: "425353532",
					productCodeLocal: "P",
					ProductCodethreeLetter: "WPX",
					SummaryOfContents: "Haribo and Jawbreaker",
					ShipmentType: "P",
					TotalShipmentPieces: "1",
					PieceDimensions: "CM",
					PieceWeight: 'KG',

					CommodityCode: {
						$cond: {
							if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "Canada"] },
							then: "1704.90.9050",
							else: {
								$cond: {
									if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "Saudi Arabia"] },
									then: "17.04.90.10.00.01",
									else: {
										$cond: {
											if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "USA"] },
											then: "1704.10.0000",
											else: {
												$cond: {
													if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "Australia"] },
													then: "1704.90.00.45",
													else: {
														$cond: {
															if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "United Kingdom"] },
															then: "1704.90.9050",
															else: {
																$cond: {
																	if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "Ireland"] },
																	then: "1704.90.6500",
																	else: {
																		$cond: {
																			if: { $eq: ["$shippingAdderess.shippingAddressObj.country", "New Zealand"] },
																			then: "1704.90.00.45",
																			else: "00",
																		},
																	},
																}
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
					TotalWeight: {
						$sum: {
							$map: {
								input: "$productDetail",
								as: "product",
								in: {
									$multiply: [
										"$$product.quantity",
										"$$product.productDetailsObj.weight",
									],
								},
							},
						},
					},

					ZipCodeShipTo: "$shippingAdderess.shippingAddressObj.zip",
					createdAt: 1,
					totalItems: {
						$add: [
							{
								$cond: {
									if: {
										$gt: [
											{
												$size: {
													$ifNull: [
														"$productDetail.productDetailsObj.pots",
														[],
													],
												},
											},
											0,
										],
									},
									then: {
										$sum: {
											$map: {
												input: "$productDetail.productDetailsObj.pots",
												in: { $toInt: "$$this" },
											},
										},
									},
									else: 0,
								},
							},
							{ $sum: "$productDetail.quantity" },
						],
					},
					customsTermsOfTrade: 'DAP'
				},
			},
		];


		let result = await OrdersModel.aggregate(aggregateQuery);

		if (result.length) {
			const totalResults = await OrdersModel.countDocuments(filterQuery);
			const totalPages = Math.ceil(totalResults / length);
			return {
				data: result,
				totalResults,
				status: true,
				code: 200,
			};
		} else {
			return {
				status: false,
				code: 400,
				msg: "Something went wrong, please try after some time.",
			};
		}
	} catch (error) {
		console.log("Error while getting orders :", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = getOrdersForDHL;

