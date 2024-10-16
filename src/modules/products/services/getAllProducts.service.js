const mongoose = require('mongoose');
const ProductsModel = require("../products.model");

const getAllProducts = async (page, limit, filter, sort,minPrice,maxPrice) => {
	
	try {
	  const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 32;
	  const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
	  const skip = (start - 1) * length;
	  let filterQuery = {
		visible: true,
		active:true,
		/* price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } */
	  };
	 
	 if(maxPrice){
		filterQuery.price =  { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
	 }
	
  
	  if (filter && filter.search !== undefined && filter.search !== "") {
		var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
		filterQuery.$or = [
		  { name: { $regex: searchRegex } },
		];
	  }
  
	  if (filter && filter.brand !== undefined && filter.brand !== "") {
		const branToId = mongoose.Types.ObjectId(filter?.brand) 
		filterQuery= {...filterQuery,categoryArray :{ $in: [branToId] }}
	  }

	  if (filter && filter.flavor !== undefined && filter.flavor !== "") {
		var flavorRegex = new RegExp(`.*${filter.flavor}.*`, "i");
		filterQuery.flavor = {$regex : flavorRegex};
	  }
	  if (filter && filter.pots !== undefined && filter.pots !== "") {
		filterQuery.pots = filter.pots;
	  }
	  if (filter && filter.productType !== undefined && filter.productType !== "") {
		filterQuery.productType = filter.productType;
	  }
	 
	  let sortCriteria = { name: 1 };
	  console.log(sort)
	  // If sort parameter is provided, use it
	  if (sort) {
		  sortCriteria = sort;
		  if (sort?.strength) {
			  sortCriteria = sort;
			  filterQuery = {...filterQuery,...{strength : { $exists: true }}};
		  }
	  }
  
	  // Ensure name field is included in sorting criteria
	//   if (!sortCriteria.name) {
	// 	  sortCriteria.name = "asc"; // Set default sorting by name in ascending order
	//   }
	  const ProductList = await ProductsModel.find(filterQuery)
		.skip(skip)
		.limit(length)
		.sort(sortCriteria)
		.lean();
	  const totalResults = await ProductsModel.countDocuments(filterQuery);
  
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
  };
  

module.exports = getAllProducts