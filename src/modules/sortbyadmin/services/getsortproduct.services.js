const sortmodel = require("../sortby.modal");
const mongoose = require('mongoose');

const getsortproduct = async (page,limit,filter,sort) => {

    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 32;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = {
          active:true,
        };

        const ProductList = await sortmodel.findOne(filterQuery)
          .skip(skip)
          .limit(length)
          .sort()
          .lean();
        const totalResults = await sortmodel.countDocuments(filterQuery);
    
        const totalPages = Math.ceil(totalResults / length);
        return {
          data: ProductList,
          totalPages,
          totalResults,
          page: start,
          limit: length,
          status: true,
          code: 200,
        };
      } catch (error) {
            console.log("error",error);
        return { status: false, code: 500, msg: error };
      }
}

module.exports = getsortproduct;
