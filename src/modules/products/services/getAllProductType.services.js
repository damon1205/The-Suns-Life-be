const ProductsModel = require("../products.model");

const getAllProductType = async () => {
  try {
    const filterQuery = {
      visible: true,
      active:true,
      productType: { $nin: [null, ""] , $exists: true },
    };

    const aggregateQuery = [
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$productType",
        },
      },
      {
        $project: {
          _id: 0,
          productType: "$_id",
        },
      },
      {
        $sort: {
          productType: 1, // 1 for ascending order
        },
      },
    ];

    const productType = await ProductsModel.aggregate(aggregateQuery);

    if (productType) {
      return { data: productType, status: true, code: 200 };
    } else {
      return { data: "Flavour not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getAllProductType;
