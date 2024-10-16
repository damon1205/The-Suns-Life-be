const ProductsModel = require("../products.model");

const createProductsCollection = async (produtsData) => {
	try {
		const result = await ProductsModel.create(produtsData);
		if (result?.length) {
			return {
				status: true, code: 201,
				data: {
					result,
					productCount: result.length
				}
			}
		}
	} catch (error) {
		console.log("Error while creating product collection:-", error)
		return { status: false, code: 500, msg: error }
	}
}

module.exports = createProductsCollection