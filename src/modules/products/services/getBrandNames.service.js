const ProductsModel = require("../products.model");

const getAllBrandNames = async () => {
  try {
    const filterQuery = {
      active: true
    };

    const aggregateQuery = [
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$brand",
          imageUrls: { $push: "$productImageUrl" },
          prioritizedBrand: { $max: "$prioritizedBrand" },
        },
      },
      {
        $sort: {
          prioritizedBrand: -1,
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          brand: "$_id",
          imageUrls: 1,
          prioritizedBrand: 1,
        },
      },
    ];

    const brandNames = await ProductsModel.aggregate(aggregateQuery);
    const filteredBrandNames = brandNames.filter(item => item?.brand !== null && item?.brand !== "");

    return {
      status: true,
      code: 200,
      data: filteredBrandNames,
    };
  } catch (error) {
    console.error("Error while getting brand names:", error);
    return {
      status: false,
      code: 500,
      msg: error?.message,
    };
  }
};

module.exports = getAllBrandNames;
