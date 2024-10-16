const CategoryModel = require("../category.modal");

const getCategoryList = async () => {
	try {
		const filterQuery = { active: true };
		const aggregateQuery = [
			{
				$match: filterQuery,
			},
			{
				$lookup: {
					from: "products",
					localField: "image",
					foreignField: "_id",
					as: "products",
					pipeline: [
						{
							$project: {
								productImageUrl: 1,
							},
						},
					],
				},
			},
			{
				$unwind: {
					path: "$products",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					prioritizedBrand: 1,
					productImageUrl: { $ifNull: ["$products.productImageUrl", ""] },
					lowercaseName: { $toLower: "$name" }, // Convert name to lowercase
				},
			},
			{
				$sort: {
					prioritizedBrand: -1, // Sort by prioritizedBrand in descending order
					lowercaseName: 1, // Then sort by lowercaseName in ascending order (case-insensitive)
				},
			},
		];


		let result = await CategoryModel.aggregate(aggregateQuery);
		let countrDoucment = await CategoryModel.countDocuments(filterQuery);
		if (result.length) {
			return {
				data: result,
				status: true,
				code: 200,
			};
		} else {
			return {
				status: false,
				code: 400,
				msg: "Category Not Found",
			};
		}
	} catch (error) {
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = getCategoryList;
