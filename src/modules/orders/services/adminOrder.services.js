const OrderModel = require("./../order.model");
const ProductModel = require("./../../products/products.model");
const AddressModel = require("../../addresses/addresses.model");
const mongoose = require("mongoose");
const moment = require("moment");
const counterIncrementor = require("../../../utils/counterIncrementer");
const { placeOrderCustomerEmail, placeOrderMailToAdmin } = require("../../../utils/emailservice");
const { getFlagEmoji } = require("../../../utils/helper");
const { currencyConversion } = require("../../../utils/currencyConversion");

const AdminAddOrder = async (orderData) => {
	try {
		for (let i = 0; i < orderData?.productDetail?.length; i++) {
			let currentProduct = orderData?.productDetail[i];
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
							return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
						} else if (Number(productVariant.inventory) < currentProduct.quantity) {
							return {
								msg: `Item name ${productRes.name} has ${productVariant.inventory} items left in stock`,
								status: false,
								code: 400,
							};
						} else if (
							productVariant.inventory !== "InStock" &&
							Number(productVariant.inventory) >= currentProduct.quantity
						) {
							let deductInventory = String(Number(productVariant.inventory) - currentProduct.quantity);
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
						return { msg: `${subProductRes.name} is out of stock.`, status: false, code: 400 };
					} else if (Number(subProductRes?.inventory) < subProduct.quantity) {
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
					return { msg: `${productRes.name} is out of stock.`, status: false, code: 400 };
				} else if (Number(productRes?.inventory) < currentProduct.quantity) {
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

		if (orderData?.shippingAdderess) {
			let currentshipAddr = orderData?.shippingAdderess;
			let addressRes = await AddressModel.findOne({
				_id: mongoose.Types.ObjectId(currentshipAddr?.shippingAddressId),
				active: true,
			});
			if (addressRes) {
				currentshipAddr.shippingAddressObj = addressRes;
			}
		}

		if (!orderData.seqId) {
			orderData.seqId = await counterIncrementor("Order");
		}
		orderData.orderNo = `#` + (26149 + orderData.seqId);

		const addResult = await OrderModel.create({ ...orderData });

		if (addResult) {
			try {
				let sAdd = addResult?.shippingAdderess?.shippingAddressObj;

				let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${sAdd?.lastName || ""}</p>
			<p style="margin-bottom:0;">${sAdd?.address || ""}</p>
			<p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
			<p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
			<p style="margin-bottom:0;">${sAdd?.country || ""}</p>
            <p style="margin-bottom:0;>${sAdd?.phone || ""}</p>
            <p style="margin-bottom:0;>Order Note : ${sAdd?.orderNotes || ""}</p>
            <p>Currency : ${addResult?.currency || "GBP"}</p>`;
				let country = sAdd?.country;
				// emailBody.shippingAdderess = shippingAdderess;
				let emailBody = {
					orderNo: addResult?.orderNo,
					productCount: addResult?.productDetail?.length,
					deliveryCharge: addResult?.deliveryCharge,
					name: `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`,
					shippingAdderess: shippingAdderess,
					amountToPay: addResult?.amountToPay,
					couponType: addResult?.couponType,
					couponDiscount: addResult.couponDiscount,
					couponName: addResult.couponName,
					vatCharge: addResult.vatCharge,
					deliveryMethod: addResult?.deliveryMethod,
					currency: addResult?.currency,
					currencyRate: addResult?.currencyRate,
					amountInGBP: Number((addResult?.amountToPay / (addResult?.currencyRate || 1)).toFixed(2)),
					deliveryInGBP: Number((addResult?.deliveryCharge / (addResult?.currencyRate || 1)).toFixed(2)),
					couponDiscountInGBP: Number(
						(addResult?.couponDiscount / (addResult?.currencyRate || 1)).toFixed(2)
					),
				};
				let productRows = ``;
				let productRowsWithoutConversion = ``;

				for (let i = 0; i < addResult?.productDetail.length; i++) {
					const product = addResult?.productDetail[i];
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
                                  <strong>Price - </strong>
								  <span style="text-decoration: line-through; line-height: 19.6px; padding-right:8px; ">
								  ${currencyConversion(addResult?.currency, productPrice, addResult?.currencyRate)}</span> ${currencyConversion(
										addResult?.currency,
										productDiscountedSalePrice,
										addResult?.currencyRate
									)}</p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong>${currencyConversion(
												addResult?.currency,
												productPrice,
												addResult?.currencyRate
										  )}</p>`
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
                                  <strong>Price - </strong>
								  <span style="text-decoration: line-through; line-height: 19.6px; padding-right:8px; ">
								  ${currencyConversion("GBP", productPrice, 1)}</span> ${currencyConversion("GBP", productDiscountedSalePrice, 1)}</p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong>${currencyConversion(
												"GBP",
												productPrice,
												1
										  )}</p>`
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

					for (let j = 0; j < addResult?.productDetail[i]?.subProduct?.length; j++) {
						const product2 = addResult?.productDetail[i]?.subProduct[j];
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
				emailBody.orderPlacedAt = moment(addResult?.createdAt).format("LLL");
				placeOrderCustomerEmail({
					to: addResult?.shippingAdderess?.shippingAddressObj?.email,
					emailBody,
				});
				placeOrderMailToAdmin({
					emailBody,
				});
			} catch (e) {
				console.log("Error in mail send -", e);
			}

			return { data: `Order create with order no ${addResult?.orderNo}`, status: true, code: 201 };
		} else {
			return { msg: "Something went wrong, please try again", status: false, code: 400 };
		}
	} catch (error) {
		console.log("error--------------", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = AdminAddOrder;
