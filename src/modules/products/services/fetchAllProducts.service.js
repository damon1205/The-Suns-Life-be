const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const fetchAllProducts = async (name) => {
	try {
		let filterQuery = { active: true };

		if (name) {
			filterQuery.name = { $regex: new RegExp(name, 'i') };
		}

		let aggregateQuery = [
			{ $match: filterQuery },
			{
				$project: {
					name: 1,
					productImageUrl: 1,
					price: 1,
					inventory: 1
				}
			}
		]
		const products = await ProductModel.aggregate(aggregateQuery);
		if (products?.length > 0) {
			return { data: products, status: true, code: 200 };
		} else {
			return { data: "Product Not Found", status: false, code: 404 };
		}
	} catch (error) {
		console.log(error);
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = fetchAllProducts;
