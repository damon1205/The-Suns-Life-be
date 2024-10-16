const ProductsModel = require("../products.model");

const getAllFlavourNames = async () => {
	try {
		const filterQuery = {
			visible: true,
			active: true,
			flavor: { $nin: [null, ""], $exists: true },
		};

		const aggregateQuery = [
			{
				$match: filterQuery,
			},
			{
				$group: {
					_id: { $toLower: "$flavor" }, // Convert flavor to lowercase
				},
			},
			{
				$project: {
					_id: 0,
					flavor: { $toLower: "$_id" }, // Convert back to lowercase
				},
			},
			{
				$sort: {
					flavor: 1, // 1 for ascending order
				},
			},
		];

		const flavourNames = await ProductsModel.aggregate(aggregateQuery);

		if (flavourNames) {
			return { data: flavourNames, status: true, code: 200 };
		} else {
			return { data: "Flavour not found", status: false, code: 400 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getAllFlavourNames;