const ProductsModel = require("../products.model");

const youmaylike = async (category) => {
	
	try {
	  const length =  4;
	  const start = 1;
	  const skip = (start - 1) * length;
	  const filterQuery = {
		visible: true,
	  };
  
	
		
     var query = { description: { $regex: new RegExp(`${category}`) } };
     const ProductList = await ProductsModel.find(query).limit(4)
		
	
		
	
	  const totalResults = await ProductsModel.countDocuments(query);
  
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
	  console.log("Error while getting product list :", error);
	  return { status: false, code: 500, msg: error };
	}
  };
  

module.exports = youmaylike;