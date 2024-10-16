const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const getAllProductsAdmin = async (name) => {
    try {
        let filterQuery = { visible: true };

        if (name) {
            filterQuery = {...filterQuery,  name: { $regex: new RegExp(name, 'i')}}
        }


        const product = await ProductModel.find(filterQuery);
           
        if (product?.length > 0) {
        return { data: product, status: true, code: 200 };
        } else {
            return { data: "Product Not Found", status: false, code: 400 };
        }
    } catch (error) {
        console.log(error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllProductsAdmin;
