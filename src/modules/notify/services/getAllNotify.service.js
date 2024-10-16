const mongoose = require('mongoose');
const notifyModel = require('../notifyProduct.model');

/**
 * Get all notifications with pagination, filtering, and sorting
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @param {Object} filter - Filtering criteria
 * @param {Object} sort - Sorting criteria
 * @returns {Promise<{ data: Series | string, totalPages: number, totalResults: number, page: number, limit: number, status: boolean, code: number }>}
 */
const getAllNotify = async (page, limit, filter, sort) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;
    const filterQuery = {};

    if (filter && filter.search !== undefined && filter.search !== "") {
      var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
      filterQuery.$or = [
        { name: { $regex: searchRegex } },
      ]
    }

    let sortQuery = { _id: -1 };

    const notifyList = await notifyModel.aggregate([
      {
        $match: filterQuery
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: skip, // Add the $skip stage here
      },
      {
        $limit: length,
      },
    ]);

    const totalResults = await notifyModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);

    return {
      data: notifyList,
      totalPages,
      totalResults,
      page: start,
      limit: length,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.log("Error while notify list :", error);
    return { status: false, code: 500, msg: error };
  }
};

module.exports = getAllNotify;
