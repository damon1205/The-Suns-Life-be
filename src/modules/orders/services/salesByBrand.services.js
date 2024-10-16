const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const CategoryModel = require('../../Category/category.modal');

const SalesByBrand = async ({ filter, name }) => {

    try {
        const categoryAggregation = await OrderModel.aggregate([
            {
                $match: filter
            },
            {
                $unwind: '$productDetail',
            },
            {
                $unwind: '$productDetail.productDetailsObj.categoryArray',
            },
            {
                $group: {
                    _id: "$productDetail.productDetailsObj.categoryArray",
                    totalQuantity: { $sum: "$productDetail.quantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$productDetail.quantity",
                                {
                                    $cond: {
                                        if: { $gt: ["$productDetail.productDetailsObj.discountedSalePrice", 0] },
                                        then: "$productDetail.productDetailsObj.discountedSalePrice",
                                        else: "$productDetail.productDetailsObj.price"
                                    }
                                },
                                // {
                                //     $cond: {
                                //         if: '$currencyRate',
                                //         then: '$currencyRate',
                                //         else: 1
                                //     }
                                // }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            },
            {
                $sort: { totalRevenue: -1 }
            },
        ]);

        if (categoryAggregation?.length === 0) {
            return { status: false, code: 404, msg: "No records matched." }
        }
        const categoryIds = categoryAggregation.map(category => mongoose.Types.ObjectId(category._id));

        const categories = await CategoryModel.aggregate([
            { $match: { _id: { $in: categoryIds }, name: new RegExp(`.*${name}.*`, "i") } },
            {
                $lookup: {
                    from: "products",
                    localField: "image",
                    foreignField: "_id",
                    as: "productObj"
                }
            },
            {
                $unwind: {
                    path: '$productObj',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $project: { _id: 1, name: 1, image: '$productObj.productImageUrl' } }
        ]);

        const combinedResult = categories.map(itemA => {
            const match = categoryAggregation.find(itemB => String(itemB._id) === String(itemA._id));
            return match && { ...itemA, totalQuantity: match.totalQuantity, totalRevenue: Number(match.totalRevenue.toFixed(2)) } ;
        });

        combinedResult.sort((a, b) => b.totalRevenue - a.totalRevenue);

        if (combinedResult?.length) {
            return {
                data: combinedResult,
                status: true,
                code: 200,
            };
        } else {
            return { status: false, code: 404, msg: "No records matched." }
        }
    } catch (error) {
        console.log("error", error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = SalesByBrand;
