const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const catchAsync = require("../../../utils/catchAsync");
const orderServices = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const { placeOrderCustomerEmail, placeOrderMailToAdmin } = require("../../../utils/emailservice");
const moment = require("moment");
const { getFlagEmoji } = require("../../../utils/helper");
const { currencyConversion } = require("../../../utils/currencyConversion");

const confirmOrderEMail = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);

	const result = await orderServices.getOrdersById(id);

	if (result?.status) {
		let ordersDetails = result?.data;
		try {
			let sAdd = ordersDetails?.shippingAdderess?.shippingAddressObj;

			let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${sAdd?.lastName || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.address || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.country || ""}</p>
            <p style="margin-bottom:0;>${sAdd?.phone || ""}</p>
            <p style="margin-bottom:0;>Order Note : ${sAdd?.orderNotes || ""}</p>
            <p>Currency : ${ordersDetails?.currency || "GBP"}</p>
            `;
			let country = sAdd?.country;
			// emailBody.shippingAdderess = shippingAdderess;
			let emailBody = {
				currency: ordersDetails?.currency,
				currencyRate: ordersDetails?.currencyRate,
				orderNo: ordersDetails?.orderNo,
				productCount: ordersDetails?.productDetail?.length,
				deliveryCharge: ordersDetails?.deliveryCharge,
				name: `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`,
				shippingAdderess: shippingAdderess,
				amountToPay: ordersDetails?.amountToPay,
				couponType: ordersDetails?.couponType,
				couponDiscount: ordersDetails.couponDiscount,
				couponName: ordersDetails.couponName,
				vatCharge: ordersDetails?.vatCharge,
				deliveryMethod: ordersDetails?.deliveryMethod,
				amountInGBP: ordersDetails?.amountInGBP,
				deliveryInGBP: ordersDetails?.deliveryInGBP,
				couponDiscountInGBP: ordersDetails?.couponDiscountInGBP,
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
                                  <strong>Price - </strong>
                                    <span style="text-decoration: line-through; line-height: 19.6px; padding-right:8px; ;">
                                      ${currencyConversion(
											ordersDetails?.currency,
											productPrice,
											ordersDetails?.currencyRate
										)}
                                    </span> ${currencyConversion(
										ordersDetails?.currency,
										productDiscountedSalePrice,
										ordersDetails?.currencyRate
									)}
                                  </p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong> ${currencyConversion(
												ordersDetails?.currency,
												productPrice,
												ordersDetails?.currencyRate
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
                                    <span style="text-decoration: line-through; line-height: 19.6px; padding-right:8px; ;">
                                      ${currencyConversion("GBP", productPrice, 1)}
                                    </span> ${currencyConversion("GBP", productDiscountedSalePrice, 1)}
                                  </p>`
										: `<p style="line-height: 140%;"><strong>Price - </strong> ${currencyConversion(
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
			placeOrderCustomerEmail({
				to: ordersDetails?.shippingAdderess?.shippingAddressObj?.email,
				emailBody,
			});
			placeOrderMailToAdmin({
				emailBody,
			});
		} catch (e) {
			console.log("e----", e);
		}

		sendResponse(res, httpStatus.OK, "Email send", null);
	} else {
		if (result.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result.data);
		} else if (result.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result.data);
		}
	}
});

module.exports = confirmOrderEMail;
