const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { placeOrderCustomerEmail, placeOrderMailToAdmin } = require("../../../utils/emailservice");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const moment = require("moment");
const { getOrdersById } = require(".");
const { getFlagEmoji } = require("../../../utils/helper");
const { currencyConversion } = require("../../../utils/currencyConversion");

const addOrder = catchAsync(async (req, res) => {
	const {
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		amountToPay,
		deliveryCharge,
		deliveryTime,
		transactionId,
		paymentType,
		couponId,
		couponType,
		couponName,
		couponDiscount,
		vatCharge,
		currency,
		currencyRate,
	} = await pick(req.body, [
		"productDetail",
		"paymentMode",
		"paymentStatus",
		"orderStatus",
		"shippingAdderess",
		"deliveryMethod",
		"amountToPay",
		"deliveryCharge",
		"deliveryTime",
		"transactionId",
		"paymentType",
		"couponId",
		"couponType",
		"couponName",
		"couponDiscount",
		"vatCharge",
		"currency",
		"currencyRate",
	]);

	const userId = req.user?.id;

	const insertResult = await orderServices.addOrder({
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		userId: userId,
		amountToPay,
		deliveryCharge,
		deliveryTime,
		transactionId,
		paymentType,
		couponId,
		couponType,
		couponName,
		couponDiscount,
		vatCharge,
		currency,
		currencyRate,
	});

	if (insertResult?.status) {
		if (insertResult?.data?.paymentType == "pay360") {
			let ordersDetails = await orderServices.getOrdersById(insertResult?.data?._id);
			//trigger place order email
			try {
				let sAdd = ordersDetails?.data?.shippingAdderess?.shippingAddressObj;

				let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${sAdd?.lastName || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.address || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.country || ""}</p>
            <p style="margin-bottom:0;>${sAdd?.phone || ""}</p>
            <p style="margin-bottom:0;>Order Note : ${sAdd?.orderNotes || ""}</p>
            <p>Currency : ${insertResult?.data?.currency || "GBP"}</p>`;

				let country = sAdd?.country;
				// emailBody.shippingAdderess = shippingAdderess;
				let emailBody = {
					orderNo: ordersDetails?.data?.orderNo,
					productCount: ordersDetails?.data?.productDetail?.length,
					deliveryCharge: ordersDetails?.data?.deliveryCharge,
					name: `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`,
					shippingAdderess: shippingAdderess,
					amountToPay: ordersDetails?.data?.amountToPay,
					shippingAdderess: ordersDetails.data?.shippingAdderess,
					couponType: ordersDetails?.data?.couponType,
					couponDiscount: ordersDetails?.data.couponDiscount,
					couponName: ordersDetails?.data?.couponName,
					deliveryMethod: ordersDetails?.data?.deliveryMethod,
					//   deliveryTime: ordersDetails?.data?.deliveryTime,
					vatCharge: ordersDetails?.data?.vatCharge,
					currency: ordersDetails?.currency,
					currencyRate: ordersDetails?.currencyRate,
					amountInGBP: ordersDetails?.amountInGBP,
					deliveryInGBP: ordersDetails?.deliveryInGBP,
					couponDiscountInGBP: ordersDetails?.couponDiscountInGBP,
				};

				let productRows = ``;
				let productRowsWithoutConversion = ``;

				for (let i = 0; i < ordersDetails?.data?.productDetail.length; i++) {
					const product = ordersDetails?.data?.productDetail[i];
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
										: `<p style="line-height: 140%;"><strong>Price - </strong> 
							${currencyConversion(ordersDetails?.currency, productPrice, ordersDetails?.currencyRate)}</p>`
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

					for (let j = 0; j < ordersDetails?.data?.productDetail[i]?.subProduct?.length; j++) {
						const product2 = ordersDetails?.data?.productDetail[i]?.subProduct[j];
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
				emailBody.orderPlacedAt = moment(ordersDetails?.data?.createdAt).format("LLL");
				const mail = placeOrderCustomerEmail({
					to: ordersDetails?.data?.shippingAdderess?.shippingAddressObj?.email,
					emailBody,
				});
				placeOrderMailToAdmin({
					emailBody,
				});
				sendResponse(res, httpStatus.OK, insertResult.data, null);
			} catch (e) {
				console.log("erro ehilw sending mail", e);
			}
		} else {
			sendResponse(res, httpStatus.OK, insertResult.data, null);
		}
		return;
	} else {
		sendResponse(
			res,
			insertResult.code == 400
				? httpStatus.BAD_REQUEST
				: insertResult.code == 500
				? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			insertResult.msg
		);
	}
});

module.exports = addOrder;
