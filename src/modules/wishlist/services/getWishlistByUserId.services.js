const WISHLIST = require("../wishlist.model");

const mongoose = require('mongoose');

const getWishlistByUserId = async (user) => {
    let userId=user.userId;
    try {
        const filterQuery = {
          userId: mongoose.Types.ObjectId(userId),
        };
    
        const customPipeline = [
          {
            $match: filterQuery,
          },
    /* 
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userDetail',
            },
          },
          {
            $unwind: {
              path: '$userId',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "userDetail.password": 0
            }
          }, */
          {
            $lookup: {
              from: "products",
              localField:"productId",
              foreignField:"_id",
              as:'productDetails'
    
            }
          },
          {
            $unwind:{
              path: "$product",
              preserveNullAndEmptyArrays: true,
            
            }
    
          },
          {
            $match: filterQuery,
          },
        ];
    
        const result = await WISHLIST.aggregate(customPipeline);
        
        if (result) {
          return {
              data: result,
              totalItems:result.length,
              status: true,
              code: 200
          };
      }
      else {
          return { data: "Product not found", status: false, code: 400 };
      }
      } catch (error) {
        console.log("Error while getting data:", error);
        return { status: false, code: 500, msg: error };
      }
}

module.exports = getWishlistByUserId;
