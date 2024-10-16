// getBrandNames.service.js
const ProductsModel = require("../products.model");

const getAllBrandNames = async () => {
  try {

    const filterQuery = {
      active: true
    };


    const projectStage = {

    };

    const aggregateQuery = [
      {
        $match:filterQuery
      },
      {
        $group: {
          _id: "$brand",
        }
      },
      {
        $project: {
          _id: 0,
          brand: "$_id",
        }
      },
     {
        $sort: {
          brand: 1, // -1 for descending order
        },
      },


    ];
    const brandNames = await ProductsModel.aggregate(aggregateQuery);
    console.log(brandNames);
    return {
      status: true,
      code: 200,
      data: brandNames,
    };
  } catch (error) {
    console.error("Error while getting brand names:", error);
    return {
      status: false,
      code: 500,
      msg: error.message,
    };
  }
};

module.exports = getAllBrandNames;
