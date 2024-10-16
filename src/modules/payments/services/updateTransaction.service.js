const mongoose = require("mongoose");
const trasactionModel = require("../transaction.model");
const addressModel = require("../../addresses/addresses.model");
const ordersModal = require("../../orders/order.model");
const orderServices = require("../../orders/services");
const couponServices = require("../../coupons/services");
const addressservices = require("../../addresses/services");
const addRoyalMailOrder = require("../../royalMail/services/addRoyalMailOrder");
const { getUserById } = require("../../user/user.services");
const addShipment = require("../../shiptheory/services/addShipment.service");
const getToken = require("../../shiptheory/services/getToken.service");
const { placeOrderCustomerEmail, placeOrderMailToAdmin } = require("../../../utils/emailservice");
const moment = require("moment");
const ProductModel = require("../../products/products.model");
const CartModel = require("../../cart/cart.model");
const counterIncrementor = require("../../../utils/counterIncrementer");
const { getFlagEmoji } = require("../../../utils/helper");
const { currencyConversion } = require("../../../utils/currencyConversion");

const updateTransaction = async (transactionDeta) => {
	try {
		if (transactionDeta?.transaction?.status == "SUCCESS") {
			console.log("update transaction data-----", transactionDeta, moment().format());
			const trxnID = transactionDeta?.customFields?.fieldState[0]?.value;
			const serviceId = transactionDeta?.customFields?.fieldState[1]?.value;
			const orderId = transactionDeta?.customFields?.fieldState[2]?.value;
			console.log("order ID---", trxnID, serviceId, orderId);
			const previousData = await trasactionModel.findOne({ trnxNo: trxnID });

			// try {
			// 	// Assuming you have a method to find the order by ID
			// 	const order = await ordersModal.findById(orderId);

			// 	if (!order) {
			// 		console.log("order not found");
			// 	}

			// 	// Apply the logic from the pre-save middleware
			// 	if (!order.seqId) {
			// 		order.seqId = await counterIncrementor("Order");
			// 	}
			// 	order.orderNo = `#` + (26149 + order.seqId);
			// 	//  order.orderNo = `#` + (42256);

			// 	// Save the updated order
			// 	await order.save();

			// 	//res.json({ message: 'Order updated successfully', order });
			// } catch (error) {
			// 	console.error(error);
			// 	//  res.status(500).json({ error: 'Internal Server Error' });
			// }

			// if (
			//   parseFloat(previousData.totalToPay) >
			//     parseFloat(transactionDeta.amount) ||
			//   parseFloat(previousData.totalToPay) < parseFloat(transactionDeta.amount)
			// ) {
			//   return {
			//     data: "Your not paid sufficient amount, you transaction is not going to consider it will return soon.",
			//     status: false,
			//     code: 400,
			//   };

			const payload = {
				paymentStatus: "paid",
				trxnResponse: transactionDeta,
				isFullAmountTransfer: true,
				isActive: true,
				originalTransactionId: transactionDeta?.transaction?.transactionId,
			};

			const addResult = await trasactionModel.findOneAndUpdate({ trnxNo: trxnID }, payload);
			// Fix below service
			// const result = await addressservices.resetOrderNotes(addResult?.userId, id, orderNotes);
			const user = await getUserById(addResult?.userId);

			if (addResult) {
				let id = orderId;
				let addressId = addResult?.shippingAdderess?.shippingAddressId;
				let address = await addressModel.findById(addressId);
				let ordersDetails = await ordersModal.findById(id);

				// deduct inventory
				for (let i = 0; i < ordersDetails?.productDetail.length; i++) {
					let currentProduct = ordersDetails?.productDetail[i];
					let productRes = await ProductModel.findOne({
						_id: mongoose.Types.ObjectId(currentProduct?.productId),
						active: true,
					});

					if (currentProduct?.productDetailsObj?.selectedVariant && productRes?.variants?.length) {
						let variant = currentProduct?.productDetailsObj?.selectedVariant;
						let variantType = variant?.pots ? "pots" : variant?.size ? "size" : null;

						if (variantType) {
							let variantValue = variant[variantType];

							let productVariant = productRes.variants.find((v) => v[variantType] === variantValue);

							if (productVariant) {
								if (
									productVariant.inventory.trim() === "0" ||
									productVariant.inventory.trim().toLowerCase() === "out of stock"
								) {
									console.log("variant-", `${productRes.name} is out of stock.`);
									return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
								} else if (Number(productVariant.inventory) < currentProduct.quantity) {
									console.log(
										"variant-",
										`Item name ${productRes.name} has ${productVariant.inventory} items left in stock.`
									);
									return {
										msg: `Item name ${productRes.name} has ${productVariant.inventory} items left in stock.`,
										status: false,
										code: 400,
									};
								} else if (
									productVariant.inventory !== "InStock" &&
									Number(productVariant.inventory) >= currentProduct.quantity
								) {
									let deductInventory = String(
										Number(productVariant.inventory) - currentProduct.quantity
									);

									let updateRes = await ProductModel.findOneAndUpdate(
										{
											_id: mongoose.Types.ObjectId(currentProduct.productId),
											active: true,
											[`variants.${variantType}`]: variantValue,
										},
										{
											$set: {
												"variants.$.inventory": deductInventory,
											},
										},
										{ new: true }
									);
								}
							}
						}
					} else if (currentProduct?.subProduct?.length) {
						for (let subProduct of currentProduct?.subProduct) {
							let subProductRes = await ProductModel.findOne({
								_id: mongoose.Types.ObjectId(subProduct?.productId),
								active: true,
							});
							if (
								subProductRes?.inventory.trim() === "0" ||
								subProductRes?.inventory.trim().toLowerCase() === "out of stock"
							) {
								console.log("Pick n mix -", `${subProductRes.name} is out of stock.`);
								return { msg: `${subProductRes.name} is out of stock.`, status: false, code: 400 };
							} else if (Number(subProductRes?.inventory) < subProduct.quantity) {
								console.log(
									"Pick n mix -",
									`Item name ${subProductRes.name} has ${subProductRes?.inventory} items left in stock.`
								);
								return {
									msg: `Item name ${subProductRes.name} has ${subProductRes?.inventory} items left in stock.`,
									status: false,
									code: 400,
								};
							} else if (
								subProductRes.inventory !== "InStock" &&
								Number(subProductRes.inventory) >= subProduct.quantity
							) {
								let deductInventory = String(Number(subProductRes.inventory) - subProduct.quantity);
								let updateRes = await ProductModel.findOneAndUpdate(
									{ _id: mongoose.Types.ObjectId(subProduct.productId), active: true },
									{ inventory: deductInventory }
								);
							}
						}
					} else {
						if (
							productRes?.inventory.trim() === "0" ||
							productRes?.inventory.trim().toLowerCase() === "out of stock"
						) {
							console.log("Product -", `${productRes.name} is out of stock.`);
							return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
						} else if (Number(productRes?.inventory) < currentProduct.quantity) {
							console.log(
								"Product -",
								`Item name ${productRes.name} has ${productRes?.inventory} items left in stock.`
							);
							return {
								msg: `Item name ${productRes.name} has ${productRes?.inventory} items left in stock.`,
								status: false,
								code: 400,
							};
						} else if (
							productRes.inventory !== "InStock" &&
							Number(productRes.inventory) >= currentProduct.quantity
						) {
							let deductInventory = String(Number(productRes.inventory) - currentProduct.quantity);
							let updateRes = await ProductModel.findOneAndUpdate(
								{ _id: mongoose.Types.ObjectId(currentProduct.productId), active: true },
								{ inventory: deductInventory }
							);
						}
					}
				}

				console.log("Inventory Deduction Success.");
				let body = {
					// productDetail: addResult?.productDetail,
					// paymentMode: addResult?.paymentMode,
					paymentStatus: "paid",
					paymentType: "pay360",
					// shippingAdderess: addResult?.shippingAdderess,
					//  // deliveryMethod: addResult?.deliveryMethod,
					// userId: addResult?.userId,
					isActive: true,

					//   amountToPay: addResult?.amountToPay,
					//  deliveryCharge: addResult?.deliveryCharge,
					//transactionId: mongoose.Types.ObjectId(addResult?._id),
				};
				const insertResult = await orderServices.updateOrderById({ id, body });
				await CartModel.deleteMany({ userId: mongoose.Types.ObjectId(ordersDetails?.userId) });

				if (ordersDetails?.couponId && ordersDetails?.couponId != null) {
					await couponServices.userCountIncrease(ordersDetails?.couponId);
				}

				//trigger place order email
				try {
					let sAdd = ordersDetails?.shippingAdderess?.shippingAddressObj;

					let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${
						sAdd?.lastName || ""
					}</p>
          <p style="margin-bottom:0;">${sAdd?.address || ""}</p>
          <p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
          <p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
          <p style="margin-bottom:0;">${sAdd?.country || ""}</p>
            <p style="margin-bottom:0;>${sAdd?.phone || ""}</p>
            <p style="margin-bottom:0;>Order Note : ${sAdd?.orderNotes || ""}</p>
            <p>Currency : ${ordersDetails?.currency || "GBP"}</p>`;
					let country = sAdd?.country;
					// emailBody.shippingAdderess = shippingAdderess;
					let emailBody = {
						orderNo: ordersDetails?.orderNo,
						productCount: ordersDetails?.productDetail?.length,
						deliveryCharge: ordersDetails?.deliveryCharge,
						name: `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`,
						shippingAdderess: shippingAdderess,
						amountToPay: ordersDetails?.amountToPay,
						couponType: ordersDetails?.couponType,
						couponDiscount: ordersDetails.couponDiscount,
						couponName: ordersDetails.couponName,
						vatCharge: ordersDetails.vatCharge,
						deliveryMethod: ordersDetails?.deliveryMethod,
						currency: ordersDetails?.currency,
						currencyRate: ordersDetails?.currencyRate,
						amountInGBP: Number(
							(ordersDetails?.amountToPay / (ordersDetails?.currencyRate || 1)).toFixed(2)
						),
						deliveryInGBP: Number(
							(ordersDetails?.deliveryCharge / (ordersDetails?.currencyRate || 1)).toFixed(2)
						),
						couponDiscountInGBP: Number(
							(ordersDetails?.couponDiscount / (ordersDetails?.currencyRate || 1)).toFixed(2)
						),
					};
					let productRows = ``;
					let productRowsWithoutConversion = ``;

					for (let i = 0; i < ordersDetails?.productDetail.length; i++) {
						const product = ordersDetails?.productDetail[i];
						// Extract product details
						const productImageUrl = product.productDetailsObj?.productImageUrl;
						const productName = product?.productDetailsObj?.name;
						const productPrice = product?.productDetailsObj?.price;
						const productQuantity = product?.quantity;
						const productDiscountedSalePrice = product?.productDetailsObj?.discountedSalePrice;
						const couponName = product?.productDetailsObj?.couponName;
						const pots = product?.productDetailsObj?.selectedVariant?.pots;
						const size = product?.productDetailsObj?.selectedVariant?.size;

						// Add this product to the productRows
						productRows += `<div class="u-row" style="margin: 0 auto; border-bottom:1px solid #BBBBBB; min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: flex; width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="${productImageUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 146.67px;"
                                      width="146.67" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="333" style="width: 333px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-66p67" style="max-width: 320px;min-width: 333.33px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">

                              <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;"><strong>${productName}</strong></p>
                                ${
									product?.productDetailsObj?.selectedVariant
										? `<p style="line-height: 140%;"><strong>Variant - </strong>
                                ${pots ? pots + " pots" : size ? size + " size" : ""}</p>`
										: ""
								}
                                ${
									productDiscountedSalePrice
										? `<p style="line-height: 140%;">
                                  <strong>Price - </strong><span style="text-decoration: line-through; padding-right:8px; ; line-height: 19.6px;">
								  ${currencyConversion(ordersDetails?.currency, productPrice, ordersDetails?.currencyRate)}
										</span> ${currencyConversion(ordersDetails?.currency, productDiscountedSalePrice, ordersDetails?.currencyRate)}</p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong> ${currencyConversion(
												ordersDetails?.currency,
												productPrice,
												ordersDetails?.currencyRate
										  )}
										</p>`
								}
                                <p style="line-height: 140%;"><strong>Qty -</strong> ${productQuantity}</p>
                                ${
									couponName
										? `<p style="line-height: 140%;"><strong><span style="color: #3598db; line-height: 19.6px;">${couponName}</span></strong></p>`
										: ""
								}
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>`;
						productRowsWithoutConversion += `<div class="u-row" style="margin: 0 auto; border-bottom:1px solid #BBBBBB; min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: flex; width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="${productImageUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 146.67px;"
                                      width="146.67" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="333" style="width: 333px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-66p67" style="max-width: 320px;min-width: 333.33px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">

                              <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;"><strong>${productName}</strong></p>
                                ${
									product?.productDetailsObj?.selectedVariant
										? `<p style="line-height: 140%;"><strong>Variant - </strong>
                                ${pots ? pots + " pots" : size ? size + " size" : ""}</p>`
										: ""
								}
                                ${
									productDiscountedSalePrice
										? `<p style="line-height: 140%;">
                                  <strong>Price - </strong><span style="text-decoration: line-through; padding-right:8px; ; line-height: 19.6px;">
								  ${currencyConversion("GBP", productPrice, 1)}
										</span> ${currencyConversion("GBP", productDiscountedSalePrice, 1)}</p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong> ${currencyConversion(
												"GBP",
												productPrice,
												1
										  )}
										</p>`
								}
                                <p style="line-height: 140%;"><strong>Qty -</strong> ${productQuantity}</p>
                                ${
									couponName
										? `<p style="line-height: 140%;"><strong><span style="color: #3598db; line-height: 19.6px;">${couponName}</span></strong></p>`
										: ""
								}
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div>
                    <!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>`;

						for (let j = 0; j < ordersDetails?.productDetail[i]?.subProduct?.length; j++) {
							const product2 = ordersDetails?.productDetail[i]?.subProduct[j];
							const productImageUrl = product2.productDetailsObj?.productImageUrl;
							const productName = product2?.productDetailsObj?.name;
							const productPrice = product2?.productDetailsObj?.price;
							const productQuantity = product2?.quantity;

							// Add this product to the productRows
							let subProducts = `<div class="u-row" style="margin: 0 auto; border-bottom:1px solid #BBBBBB; min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                        <div style="border-collapse: collapse;display: flex; width: 100%;height: 100%;background-color: transparent;">
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
          
                          <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div class="u-col u-col-25p25" style="max-width: 320px; padding-left:16px; min-width: 150.67px;display: table-cell;vertical-align: top;">
                            <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                              <!--[if (!mso)&(!IE)]><!-->
                              <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--<![endif]-->
          
                                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
          
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                          <tr>
                                            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
          
                                              <img align="center" border="0" src="${productImageUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 146.67px;"
                                                width="146.67" />
          
                                            </td>
                                          </tr>
                                        </table>
          
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
          
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="333" style="width: 333px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div class="u-col u-col-66p67" style="max-width: 320px;min-width: 333.33px;display: table-cell;vertical-align: top;">
                            <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                              <!--[if (!mso)&(!IE)]><!-->
                              <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--<![endif]-->
          
                                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
          
                                        <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                          <p style="line-height: 140%;"><strong>${productName}</strong></p>
                                          <p style="line-height: 140%;"><strong>Qty -</strong> ${productQuantity}</p>
                                        </div>
          
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
          
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>`;

							productRows += subProducts;
							productRowsWithoutConversion += subProducts;
						}
					}
					emailBody.productRows = productRows;
					emailBody.productRowsWithoutConversion = productRowsWithoutConversion;
					emailBody.country = country;
					emailBody.flag = getFlagEmoji(sAdd?.iso);
					emailBody.orderPlacedAt = moment(ordersDetails?.createdAt).format("LLL");
					const mail = placeOrderCustomerEmail({
						to: ordersDetails?.shippingAdderess?.shippingAddressObj?.email,
						emailBody,
					});

					placeOrderMailToAdmin({
						emailBody,
					});
				} catch (e) {
					console.log("e----", e);
				}

				try {
					//Ship Theory payload
					let arr = [];
					let arrayOfProducts = ordersDetails?.productDetail.forEach((t) => {
						arr.push({
							name: t?.productDetailsObj?.name,
							sku: t?.productDetailsObj?.name,
							qty: t?.quantity,
							value: t?.productDetailsObj?.price,
							weight: t?.productDetailsObj?.weight,
						});
					});

					let total = 0;
					let taxes = arr;
					let i;
					for (i = 0; i < taxes.length; i++) {
						total += taxes[i]?.weight * taxes[i]?.qty;
					}
					console.log(total);

					let shipTheoryPayload = JSON.stringify({
						reference: ordersDetails?.orderNo?.replace("#", ""),
						reference2: ordersDetails?.orderNo?.replace("#", ""),
						shipment_detail: {
							weight: total,
							parcels: 1,
							value: ordersDetails?.amountToPay,
							channel_shipservice_name: serviceId,
						},
						recipient: {
							firstname: address?.firstName,
							lastname: address?.lastName,
							address_line_1: address?.address,
							address_line_2: address?.addressLine2,
							city: address?.city,
							postcode: address?.zip,
							country: address?.iso,
							email: address?.email,
							mobile: address?.phone,
						},
						products: arr,
					});

					//Add  success order  to RoyalMail call ti api
					// const checkRoyalEmail = addRoyalMailOrder(royalMailPayload);
					console.log("Ship theory payload", arr, shipTheoryPayload);
					console.log("call to get for new trnasaction 1");

					const token = getToken(shipTheoryPayload, orderId);
				} catch (e) {
					console.log("erroe in shiptheory--------------", e);
				}

				//Add Ship thoery
				// const addShipThoery = addShipment(shipTheoryPayload);

				return { data: insertResult, status: true, code: 200 };
			} else {
				return {
					msg: "Something went wrong, please try again",
					status: false,
					code: 400,
				};
			}
		} else {
			const payload = {
				paymentStatus: transactionDeta?.transaction?.status == "SUCCESS" ? "paid" : "failed",
				trxnResponse: transactionDeta,
			};
			const trxnID = transactionDeta?.customFields?.fieldState[0]?.value;
			const addResult = await trasactionModel.findOneAndUpdate({ trnxNo: trxnID }, payload);

			return { msg: "Payment failed, please try again", status: false, code: 400 };
		}
	} catch (error) {
		// const trxnID = transactionDeta?.customFields?.fieldState[0]?.value;
		// const serviceId = transactionDeta?.customFields?.fieldState[1]?.value;
		// const orderId = transactionDeta?.customFields?.fieldState[2]?.value;
		// try {
		//   // Assuming you have a method to find the order by ID
		//   const order = await ordersModal.findById(orderId);

		//   if (!order) {
		//     console.log("order not found")
		//   }

		// Apply the logic from the pre-save middleware
		// if (!order.seqId) {
		//   order.seqId = await counterIncrementor("Order");
		// }
		//order.orderNo = `#` + (26149 + order.seqId);
		// order.paymentType="pay360"
		// Save the updated order
		//  await order.save();

		//res.json({ message: 'Order updated successfully', order });

		console.error(error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = updateTransaction;
