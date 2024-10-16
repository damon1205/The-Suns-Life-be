const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { trackingNoCustomerEmail, shippingAdminEmail } = require("../../../utils/emailservice");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const moment = require("moment");
const { currencyConversion } = require("../../../utils/currencyConversion");

const sendShippingConfirmationMail = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	const insertResult = await orderServices.getOrdersById(id);
	if (insertResult?.status) {
		try {
			let emailBody = {
				orderNo: insertResult?.data?.orderNo,
				deliveryCharge: insertResult?.data?.deliveryCharge,
				amountToPay: insertResult?.data?.amountToPay,
				trakingNo: insertResult?.data?.trackingNumber,
				trackingURL: insertResult?.data?.trackingURL,
				deliveryMethod: insertResult?.data?.deliveryMethod,
				shippingAdderess: insertResult?.data?.shippingAdderess,
				couponType: insertResult?.data?.couponType,
				couponDiscount: insertResult?.data.couponDiscount,
				couponName: insertResult?.data?.couponName,
				vatCharge: insertResult?.data?.vatCharge,
				deliveryTime: insertResult?.data?.deliveryTime,
				country: insertResult?.data?.shippingAdderess?.shippingAddressObj?.country,
				currency: insertResult?.data?.currency,
				currencyRate: insertResult?.data?.currencyRate,
				amountInGBP: insertResult?.data?.amountInGBP,
				deliveryInGBP: insertResult?.data?.deliveryInGBP,
				couponDiscountInGBP: insertResult?.data?.couponDiscountInGBP,
			};
			let productRows = ``;
			let productRowsWithoutConversion = ``;
			for (let i = 0; i < insertResult?.data?.productDetail.length; i++) {
				const product = insertResult?.data?.productDetail[i];
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
				productRows += `
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
                <div style="display: table-cell; vertical-align: top; width: 50%;">
                    <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                                <tr>
                                    <td style="overflow-wrap: break-word; word-break: break-word; padding: 30px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                    <img src="${productImageUrl}" alt="" title="" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; max-width: 240px; width: 100%;" width="240">
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        
                <div style="display: table-cell; vertical-align: top; width: 50%;">
                    <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                        <tr>
                            <td style="overflow-wrap: break-word; word-break: break-word; padding: 50px 10px 10px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <div><strong>${productName}</strong></div>
                                ${
									product?.productDetailsObj?.selectedVariant
										? `<div>
                                <span style="margin-right:10px">${
									pots ? pots + " " + "pots" : size ? size + " " + "size" : ""
								} </span>
                                </div>`
										: ""
								}
                                <div>
                                ${
									productDiscountedSalePrice
										? `<div>
                                        Price : 
                                         <span style="text-decoration: line-through; padding-right:10px;">
											${currencyConversion(insertResult?.data?.currency, productPrice, insertResult?.data?.currencyRate)}
                                        </span> 
										${currencyConversion(insertResult?.data?.currency, productDiscountedSalePrice, insertResult?.data?.currencyRate)}
                                  </div>`
										: `${currencyConversion(
												insertResult?.data?.currency,
												productPrice,
												insertResult?.data?.currencyRate
										  )}`
								}
                             
                                <div>Qty: ${productQuantity}</div>
                                <div style="color: blue">${couponName ? couponName : ""}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
      
                    `;

				productRowsWithoutConversion += `
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
                <div style="display: table-cell; vertical-align: top; width: 50%;">
                    <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                                <tr>
                                    <td style="overflow-wrap: break-word; word-break: break-word; padding: 30px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                    <img src="${productImageUrl}" alt="" title="" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; max-width: 240px; width: 100%;" width="240">
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        
                <div style="display: table-cell; vertical-align: top; width: 50%;">
                    <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                        <tr>
                            <td style="overflow-wrap: break-word; word-break: break-word; padding: 50px 10px 10px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <div><strong>${productName}</strong></div>
                                ${
									product?.productDetailsObj?.selectedVariant
										? `<div>
                                <span style="margin-right:10px">${
									pots ? pots + " " + "pots" : size ? size + " " + "size" : ""
								} </span>
                                </div>`
										: ""
								}
                                <div>
                                ${
									productDiscountedSalePrice
										? `<div>
                                        Price : 
                                         <span style="text-decoration: line-through; padding-right:10px;">
											${currencyConversion("GBP", productPrice, 1)}
                                        </span> 
										${currencyConversion("GBP", productDiscountedSalePrice, 1)}
                                  </div>`
										: `${currencyConversion("GBP", productPrice, 1)}`
								}
                             
                                <div>Qty: ${productQuantity}</div>
                                <div style="color: blue">${couponName ? couponName : ""}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
      
                    `;
				for (let j = 0; j < insertResult?.data?.productDetail[i]?.subProduct?.length; j++) {
					const product2 = insertResult?.data?.productDetail[i]?.subProduct[j];
					const productImageUrl = product2.productDetailsObj?.productImageUrl;
					const productName = product2?.productDetailsObj?.name;
					const productPrice = product2?.productDetailsObj?.price;
					const productQuantity = product2?.quantity;

					// Add this product to the productRows
					let subProducts = `
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
                          <div style="display: table-cell; vertical-align: top; width: 50%;">
                            <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap: break-word; word-break: break-word; padding: 30px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                            <img src="${productImageUrl}" alt="" title="" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; max-width: 240px; width: 100%;" width="240">
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                      
                          <div style="display: table-cell; vertical-align: top; width: 50%;">
                            <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap: break-word; word-break: break-word; padding: 50px 10px 10px; font-family: Arial, Helvetica, sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <div><strong>${productName}</strong></div>
                                        <div>&nbsp;</div>
                                        <div>
                                        
                                          <div>Qty: ${productQuantity}</div>
                                        </div>
                                        <div>&nbsp;</div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                            `;
					productRows += subProducts;
					productRowsWithoutConversion += subProducts;
				}
			}
			emailBody.productRows = productRows;
			emailBody.productRowsWithoutConversion = productRowsWithoutConversion;
			//}
			let sAdd = insertResult?.data?.shippingAdderess?.shippingAddressObj;
			emailBody.name = `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`;
			let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${sAdd?.lastName || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.address || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
            <p style="margin-bottom:0;">${sAdd?.country || ""}</p>
            <p style="margin-bottom:0;>${sAdd?.phone || ""}</p>
            <p style="margin-bottom:0;>Order Note : ${sAdd?.orderNotes || ""}</p>
            <p>Currency : ${insertResult?.data?.currency || "GBP"}</p>`;

			emailBody.shippingAdderess = shippingAdderess;
			emailBody.orderPlacedAt = moment(insertResult?.data?.createdAt).format("LLL");
			emailBody.updatedAt = moment(insertResult?.data?.updatedAt).format("LLL");
			trackingNoCustomerEmail({ to: sAdd?.email, emailBody });
			shippingAdminEmail(emailBody);
		} catch (e) {
			console.log("Error while sending mail", e);
		}
		sendResponse(res, httpStatus.OK, insertResult.data, null);
	} else {
		if (insertResult.code == 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
		} else if (insertResult.code == 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
		}
	}
});

module.exports = sendShippingConfirmationMail;
