const COUPON_MODEL = require('../coupons.model');

const getAllCoupons = async (page, limit, filter) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) :  10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        const filterQuery = { active: true };
        const sortQuery = { _id: -1 };

        if (filter && filter.search !== undefined && filter.search !== "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
            filterQuery.$or = [
                { code: { $regex: searchRegex } },
            ];
        }
        if (filter && filter.type !== undefined && filter.type !== "") {
            filterQuery.type = filter.type;
        }
        const coupons = await COUPON_MODEL.find(filterQuery)
            .skip(skip)
            .limit(length)
            .sort(sortQuery)
            .lean();
        const totalResults = await COUPON_MODEL.countDocuments(filterQuery);

        const totalPages = Math.ceil(totalResults / length);
        return {
            data: coupons,
            totalPages,
            totalResults,
            page: start,
            limit: length,
            status: true,
            code: 200,
        };
    } catch (error) {
        console.error('Error while getting all coupons:', error);
        return { status: false, code: 500, msg: error.message };
    }
};

module.exports = getAllCoupons;