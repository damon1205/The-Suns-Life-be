const CART_MODEL = require("../cart.model");
const moment = require("moment");
const { sentCartAbandonMail } = require("../../../utils/emailservice");

const sentAbandonedCartMails = async () => {
	try {
		let carts = await CART_MODEL.aggregate([
			{
				$match: {
					userId: { $exists: true, $ne: null },
					// isActive: true,
					createdAt: {
						$lte: moment().subtract(2, "hours").toDate(),
					},
					abandonedEmail: false,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "userDetail",
				},
			},
			{
				$unwind: {
					path: "$userDetail",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					userDetail: { $exists: true },
				},
			},
			{
				$addFields: {
					userEmail: "$userDetail.email", // Extract email from userDetail
				},
			},
			{
				$lookup: {
					from: "products",
					localField: "productId",
					foreignField: "_id",
					as: "productsInfo",
				},
			},
			{
				$unwind: {
					path: "$productsInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: "$userEmail", // Group by userEmail
					userEmail: { $first: "$userEmail" }, // Preserve userEmail field
					carts: { $push: "$$ROOT" }, // Group the carts by userEmail
				},
			},
		]);

		for (let i = 0; i < carts.length; i++) {
			const cart = carts[i];
			const userEmail = cart?._id;
			const productsArray = [];

			for (let j = 0; j < cart?.carts?.length; j++) {
				const product = cart.carts[j];
				if (
					product &&
					product.productsInfo &&
					product.productsInfo.name &&
					product.productsInfo.price &&
					product.productsInfo.productImageUrl
				) {
					const productName = product.productsInfo.name;
					const productPrice = product.productsInfo.price;
					const productImageUrl = product.productsInfo.productImageUrl;
					const id = product._id;
					productsArray.push({
						id: id,
						name: productName,
						price: productPrice,
						imageUrl: productImageUrl,
					});
				}
			}

			const emailBody = { products: productsArray };
			sentCartAbandonMail({ to: userEmail, emailBody });

			for (const product of productsArray) {
				await CART_MODEL.updateOne({ _id: product.id }, { abandonedEmail: true });
			}
		}
		console.log("Abandoned mails sent.");
		// return { data: carts, status: true, code: 200 };
	} catch (error) {
		console.log("Error to send abandoned cart mails:-", error);
		// return { msg: error, status: false, code: 500 };
	}
};

module.exports = sentAbandonedCartMails;
