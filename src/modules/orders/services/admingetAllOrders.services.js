const OrdersModel = require("./../order.model");

const admingetAllOrders = async (page, limit, filter, sort, dateSort_Json_data) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 500
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = {
            active: true,
            paymentType: "pay360",
            archiveStatus: filter?.isArchiveStatus ? true : false
        };
        let sortQuery;
        if (dateSort_Json_data?.orderSort) {
            sortQuery = { orderNo: dateSort_Json_data?.orderSort };

        }
        else {
            sortQuery = { orderNo: dateSort_Json_data?.sort };
        }

        let andFilter = []
        let paymentStatusFilter = []
        let orderStatusFilter = []
        let searchFilter = []
        let deliveryFilter = []
        let dateFilter = []
        let countryOrders = []

        if (filter && filter.search !== undefined && filter.search !== "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
                { orderNo: { $regex: searchRegex } },
                { couponName: { $regex: searchRegex } },
            ]
        }

        if (filter?.DatePayload?.fromDate && filter?.DatePayload?.toDate) {
            /*  const fromDate = new Date(filter.DatePayload.fromDate);
             const toDate = new Date(filter.DatePayload.toDate);
             toDate.setHours(23, 59, 59); */

            filter.DatePayload = {
                createdAt: {
                    '$gte': new Date(new Date(filter.DatePayload.fromDate).setHours(0, 0, 0, 0)),
                    '$lte': new Date(new Date(filter.DatePayload.toDate).setHours(23, 59, 59, 999))
                },
            };

            dateFilter.push(filter.DatePayload);
        }

        if (filter?.orderNo) {
            searchFilter.push({ orderNo: { $regex: filter.orderNo, $options: "i" } })
            searchFilter.push({ "couponName": { $regex: filter.orderNo, $options: "i" } })
            searchFilter.push({ "usersObj.username": { $regex: filter.orderNo, $options: "i" } })
            searchFilter.push({ "shippingAdderess.shippingAddressObj.firstName": { $regex: filter.orderNo, $options: "i" } })
            searchFilter.push({ "shippingAdderess.shippingAddressObj.lastName": { $regex: filter.orderNo, $options: "i" } })
        }

        if (filter?.countryOrders) {
            searchFilter.push({
                "shippingAdderess.shippingAddressObj.country": {
                    $regex: filter.countryOrders,
                    $options: "i"
                }
            });
        }
        if (filter?.fulfilledChecked == true) orderStatusFilter.push({ orderStatus: "fulfilled" })
        if (filter?.unfulfilledChecked == true) orderStatusFilter.push({ orderStatus: "unfulfilled" })
        if (filter?.partiallyFulfilledChecked == true) orderStatusFilter.push({ orderStatus: "partiallyfulfilled" })
        if (filter?.canceledChecked == true) orderStatusFilter.push({ orderStatus: "canceled" })

        if (filter?.paidChecked == true) paymentStatusFilter.push({ paymentStatus: "paid" })
        if (filter?.unpaidChecked == true) paymentStatusFilter.push({ paymentStatus: "unpaid" })
        if (filter?.partiallyPaidChecked == true) paymentStatusFilter.push({ paymentStatus: "partiallypaid" })
        if (filter?.refundedChecked == true) paymentStatusFilter.push({ paymentStatus: "refunded" })

        if (filter?.allInternationalDelivery == true) {
            deliveryFilter.push({ deliveryMethod: "Royal Mail International Tracked" })
            deliveryFilter.push({ deliveryMethod: "DHL Express" })
        }
        if (filter?.royalMailDelivery == true) {
            deliveryFilter.push({ deliveryMethod: "Royal Mail International Tracked" })
        }
        if (filter?.allDomesticDelivery == true) {
            deliveryFilter.push({ deliveryMethod: "Free Royal Mail 2nd Class; Non-tracked" })
            deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 24" })
            deliveryFilter.push({ deliveryMethod: "Royal Mail Tracked 48" })
        }
        if (filter?.allDHLOrders == true) deliveryFilter.push({ deliveryMethod: "DHL Express" })
        if (paymentStatusFilter?.length) andFilter.push({ $or: paymentStatusFilter })
        if (orderStatusFilter?.length) andFilter.push({ $or: orderStatusFilter })
        if (searchFilter?.length) andFilter.push({ $or: searchFilter })
        if (deliveryFilter?.length) andFilter.push({ $or: deliveryFilter })
        if (dateFilter?.length) andFilter.push({ $or: dateFilter })
        if (countryOrders?.length) countryOrders.push({ $or: countryOrders })

        if (andFilter?.length) filterQuery = { ...filterQuery, ...{ $and: andFilter } }

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
                $addFields: {
                    amountInGBP: {
                        $divide: [
                            "$amountToPay",
                            { $cond: { if: { $gt: ["$currencyRate", 0] }, then: "$currencyRate", else: 1 } }
                        ]
                    }
                }
            },
            {
                $sort: sortQuery
            },
            {
                $project: {
                    orderNo: 1,
                    shipTheoryStatus: 1,
                    createdAt: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    amountToPay: 1,
                    amountInGBP: 1,
                    currency: 1,
                    currencyRate: 1,
                    recipientName: {
                        $concat: [
                            '$shippingAdderess.shippingAddressObj.firstName',
                            ' ',
                            '$shippingAdderess.shippingAddressObj.lastName'
                        ]
                    },
                    recipientEmail: '$shippingAdderess.shippingAddressObj.email',
                    recipientPhone: '$shippingAdderess.shippingAddressObj.phone',
                    deliveryCountry: '$shippingAdderess.shippingAddressObj.country',
                    deliveryState: '$shippingAdderess.shippingAddressObj.state',
                    deliveryCity: '$shippingAdderess.shippingAddressObj.city',
                    deliveryAddress: '$shippingAdderess.shippingAddressObj.address',
                    deliveryAddressLine2: '$shippingAdderess.shippingAddressObj.addressLine2',
                    deliveryZip: '$shippingAdderess.shippingAddressObj.zip',
                    deliveryMethod: 1,
                    shipTheoryRemarks: 1,
                    createdAt: dateSort_Json_data?.sort ? dateSort_Json_data?.sort : 1,
                    totalItems: {
                        $add: [
                            {
                                $cond: {
                                    if: { $gt: [{ $size: { $ifNull: ["$productDetail.productDetailsObj.pots", []] } }, 0] },
                                    then: { $sum: { $map: { input: "$productDetail", in: { $multiply: [{ $toInt: "$$this.productDetailsObj.pots" }, "$$this.quantity"] } } } },
                                    else: 0
                                }
                            },
                            {
                                $sum: {
                                    $map: {
                                        input: "$productDetail",
                                        as: "detail",
                                        in: {
                                            $cond: {
                                                if: { $gt: [{ $size: { $ifNull: ["$$detail.subProduct", []] } }, 0] },
                                                then: 0,
                                                else: { $toInt: "$$detail.quantity" }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
        ];


        const result = await OrdersModel.aggregate(aggregateQuery).skip(skip).limit(length);



        if (result.length > 0) {
            const totalResults = await OrdersModel.countDocuments(filterQuery);
            const totalPages = Math.ceil(totalResults / length);
            return {
                data: result,
                totalPages,
                totalResults,
                page: start,
                limit: length,
                status: true,
                code: 200,
            };
        } else {
            // If there's no data on the requested page, return data from the first page
            const firstPageResult = await OrdersModel.aggregate(aggregateQuery).skip(0).limit(length);
            const totalResults = await OrdersModel.countDocuments(filterQuery);
            const totalPages = Math.ceil(totalResults / length);
            if (firstPageResult.length > 0) {
                return {
                    data: firstPageResult,
                    totalPages,
                    totalResults,
                    page: 1,
                    limit: length,
                    status: true,
                    code: 200,
                };
            } else {
                return { status: false, code: 400, msg: "No order matches." };
            }
        }
    } catch (error) {
        console.log("Error while getting orders :", error)
        return { status: false, code: 500, msg: error.message }
    }
}

module.exports = admingetAllOrders