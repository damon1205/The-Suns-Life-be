const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const CategoryModel = require('../../Category/category.modal');


const getProductByCategoryId = async (id, page, limit, filter, sort) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;

        let filterQuery = { 
            active: true, 
            paymentStatus: "paid",
           'productDetail.productDetailsObj.categoryArray': {$in: [id]} ,

        };       
        let sortQuery = { _id: -1 };

        if (sort != null) {
            sortQuery = sort;
        }

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }

        const orders = await OrderModel.find(filterQuery);

        if (!orders || orders.length === 0) {
            return { data: "Product not found for this category", status: false, code: 400 };
        }



        const categories = await CategoryModel.find({ _id: { $in: id } }, { _id: 1, name: 1 });


        let productSales = {};

        orders.forEach(order => {
            order.productDetail.forEach(product => {
                if (product.productDetailsObj?.categoryArray.includes(id)) {
                    const productId = product.productDetailsObj._id;
                    const quantity = product.quantity;
                    const price = product.productDetailsObj.price;
                    const discountedSalePrice = product.productDetailsObj.discountedSalePrice || 0;
                    const selectedVariant = product.productDetailsObj.selectedVariant;

                    const salePrice = discountedSalePrice ? discountedSalePrice : (selectedVariant && selectedVariant.price ? selectedVariant.price : price);

                    if (!productSales[productId]) {
                        productSales[productId] = {
                            totalSales: 0,
                            totalQuantity: 0,
                            details: product.productDetailsObj,
                        };
                    }

                    productSales[productId].totalSales += quantity * salePrice;
                    productSales[productId].totalQuantity += quantity;
                }
            });
        });

        let result = Object.keys(productSales).map(productId => ({
            productId,
            totalSales: productSales[productId].totalSales.toFixed(2),
            totalQuantity: productSales[productId].totalQuantity,
            productName: productSales[productId].details.name,
            productImage: productSales[productId].details.productImageUrl,
            selectedVariantPrice: productSales[productId]?.details?.selectedVariant?.price,
            selectedVariantPots: productSales[productId]?.details?.selectedVariant?.pots,
            selectedVariantsize: productSales[productId]?.details?.selectedVariant?.size,
            categoryName : categories
        }));

        // Apply name filter if provided
        if (filter?.name) {
            const searchRegex = new RegExp(`.*${filter.name}.*`, "i");
            result = result.filter(product => searchRegex.test(product.productName));
        }

        return { data: result, status: true, code: 200 };

    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getProductByCategoryId;
