const ProductsModel = require("../products.model");


const getNumberOfPots = async () => {
  try {


    const filterQuery = {
      visible: true,
      active:true,
      pots: { $nin: [null, ""] ,$exists: true },

    };

    const aggregateQuery = [
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$pots",
          name: { $first: "$name" }, // Assuming you want the first 'name' value for each group
          productId: { $first: "$_id" }, // Assuming you want the first 'name' value for each group
        },
      },
      {
        $project: {
          _id: 0,
          pots: "$_id",
          //name:1,
          //productId:1
        },
      },
      {
        $sort: {
          pots: -1, // -1 for descending order
          
        },
      },
    ];

    const numberOfPots = await ProductsModel.aggregate(aggregateQuery);
     
     
      if (numberOfPots) {
          return { data: numberOfPots, status: true, code: 200 };
      }
      else {
          return { data: "Pots not found", status: false, code: 400 };
      }
  } catch (error) {
      return { data: error.message, status: false, code: 500 };

  }
}
module.exports = getNumberOfPots;
