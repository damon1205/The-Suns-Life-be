const ProductsModel = require("../products.model");

const getFeaturedProduct = async () => {

	try {
	
		const filterQuery = {
			isFeatured: true,
			visible : true,
		};


		const ProductList = await ProductsModel.find(filterQuery)
			
		const totalResults = await ProductsModel.countDocuments(filterQuery);

		return {
			data: ProductList,
		
			totalResults,
			status: true,
			code: 200,
		};
	} catch (error) {
		console.log("Error while getting product list :", error)
		return { status: false, code: 500, msg: error }
	}
}

module.exports = getFeaturedProduct