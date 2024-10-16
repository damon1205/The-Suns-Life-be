const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const SEND_GRID_FROM = process.env.SENDGRID_FROM;
const REMOTE_BASE_URL = process.env.REMOTE_BASE_URL;
const { currencySymbol } = require("../utils/currencyConversion");
/**
 * @param {string} to
 * @param {object} emailBody
 */

const placeOrderMailToAdmin = ({ emailBody }) => {
	let templateObj = {
		to: "info@thesnuslife.co.uk",
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `New Order [${emailBody?.orderNo}] ${emailBody?.flag} `,
		html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

			<head>
			  <!--[if gte mso 9]>
			<xml>
			  <o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			  </o:OfficeDocumentSettings>
			</xml>
			<![endif]-->
			  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <meta name="x-apple-disable-message-reformatting">
			  <!--[if !mso]><!-->
			  <meta http-equiv="X-UA-Compatible" content="IE=edge">
			  <!--<![endif]-->
			  <title></title>
			
			  <style type="text/css">
				@media only screen and (min-width: 520px) {
				  .u-row {
					width: 500px !important;
				  }
				  .u-row .u-col {
					vertical-align: top;
				  }
				  .u-row .u-col-33p33 {
					width: 166.65px !important;
				  }
				  .u-row .u-col-25p25 {
					width: 150.65px !important;
				  }
				  .u-row .u-col-66p67 {
					width: 333.35px !important;
				  }
				  .u-row .u-col-100 {
					width: 500px !important;
				  }
				}
				
				@media (max-width: 520px) {
				  .u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				  }
				  .u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				  }
				  .u-row .u-col-33p33 {
					width: 33% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row .u-col-25p25 {
					width: 25% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row .u-col-66p67 {
					width: 66% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row {
					width: 100% !important;
				  }
				  .u-col {
					width: 100% !important;
				  }
				  .u-col>div {
					margin: 0 auto;
				  }
				}
				
				body {
				  margin: 0;
				  padding: 0;
				}
				
				table,
				tr,
				td {
				  vertical-align: top;
				  border-collapse: collapse;
				}
				
				p {
				  margin: 0;
				}
				
				.ie-container table,
				.mso-container table {
				  table-layout: fixed;
				}
				
				* {
				  line-height: inherit;
				}
				
				a[x-apple-data-detectors='true'] {
				  color: inherit !important;
				  text-decoration: none !important;
				}
				
				table,
				td {
				  color: #000000;
				}
				
				#u_body a {
				  color: #0000ee;
				  text-decoration: underline;
				}
				
				@media (max-width: 480px) {
				  #u_content_heading_1 .v-font-size {
					font-size: 14px !important;
				  }
				  #u_content_text_5 .v-text-align {
					text-align: center !important;
				  }
				}
			  </style>
			
			
			
			  <!--[if !mso]><!-->
			  <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
			  <!--<![endif]-->
			
			</head>
			
			<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
			  <!--[if IE]><div class="ie-container"><![endif]-->
			  <!--[if mso]><div class="mso-container"><![endif]-->
			  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
				<tbody>
				  <tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
			
						<table id="u_content_heading_1" style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
						<tbody>
							<tr>
							<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">

								<!--[if mso]><table width="100%"><tr><td><![endif]-->
								<h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 20px; font-weight: 400;">
								<p style="line-height: 140%;">
									<span style="background-color: #ffffff; line-height: 25.2px;">
										${emailBody?.name} placed an order for ${currencySymbol("GBP")} ${emailBody?.amountInGBP}
									</span>
								</p>
								</h1>
								<!--[if mso]></td></tr></table><![endif]-->

							</td>
							</tr>
						</tbody>
						</table>
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;"
												  width="480" />
			
											  </td>
											</tr>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 18px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Thank you for Shopping with us</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Order Number : <span style="line-height: 22.4px;">${emailBody?.orderNo}</span></p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table id="u_content_text_5" style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Hi ${emailBody?.name}, thanks for your order.</p>
											<p style="line-height: 140%;">We'll let you know when your order have been shipped.</p>
											<p style="line-height: 140%;">Comment your order number on our TikTok @Thesnuslife and we'll make packing video of your order.</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span style="text-decoration: underline;">Shipping Information</span></span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											${emailBody?.shippingAdderess}
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 400;"><span><span><span><span style="text-decoration: underline;"><strong>Order Details</strong></span></span>
											</span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
								  <div class="u-row-container" style="padding: 0px;background-color: transparent">
								  	${emailBody?.productRowsWithoutConversion}	
								  </div>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span><span style="text-decoration: underline;">Billing Information</span></span>
											</span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											${emailBody?.shippingAdderess}
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 400;"><span><strong><span style="text-decoration: underline;">Order Summary</span></strong>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											<p style="line-height: 140%;"><strong>Subtotal :</strong> ${currencySymbol("GBP")} ${(
				emailBody?.amountInGBP - emailBody?.deliveryInGBP
			).toFixed(2)}</p>
											<p style="line-height: 140%;"><strong>Shipping charge :</strong> ${emailBody?.couponType == "free_shipping"
				? `<span>
												<span style='margin-right:10px; text-decoration:line-through;'>${currencySymbol(
					"GBP"
				)} ${(emailBody?.couponDiscountInGBP).toFixed(2)}</span>
												<span style=''>${currencySymbol("GBP")} ${(emailBody?.deliveryInGBP).toFixed(2)}</span>
											  </span>`
				: `${currencySymbol("GBP")} ${(emailBody?.deliveryInGBP).toFixed(
					2
				)}`
			}
											</p>
											${emailBody?.couponName || emailBody?.couponDiscountInGBP > 0
				? `<p style="line-height: 140%;"><strong>Coupon ${emailBody?.couponName || ""
				} :</strong> - ${currencySymbol(
					"GBP"
				)} ${(emailBody?.couponDiscountInGBP).toFixed(2)}</p>`
				: ""
			}
											${emailBody?.country === "United Kingdom"
				? `<p style="line-height: 140%;"><strong>VAT :</strong> ${emailBody?.vatCharge}%</p>`
				: ""
			}
											<p style="line-height: 140%;"><strong>Total: :</strong> ${currencySymbol("GBP")} ${(emailBody?.amountInGBP).toFixed(
				2
			)}</p>
											</div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">We'll do everything to make sure you have a great experience with us</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-size: 16px; font-weight: 400; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;"><strong>Need assistance? Contact us.</strong></p>
											<p style="line-height: 140%;">Email us : <a target="_blank" href="mailto:${SEND_GRID_FROM}" rel="noopener">${SEND_GRID_FROM}</a></p>
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
						</div>
					  </div>
			
			
					  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				  </tr>
				</tbody>
			  </table>
			  <!--[if mso]></div><![endif]-->
			  <!--[if IE]></div><![endif]-->
			</body>
			
			</html>`,
	};
	sendEmail(templateObj);
};

const placeOrderCustomerEmail = ({ to, emailBody }) => {
	let templateObj = {
		to,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `Order Confirmation [${emailBody?.orderNo}]`,
		html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
			
			<head>
			  <!--[if gte mso 9]>
			<xml>
			  <o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			  </o:OfficeDocumentSettings>
			</xml>
			<![endif]-->
			  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <meta name="x-apple-disable-message-reformatting">
			  <!--[if !mso]><!-->
			  <meta http-equiv="X-UA-Compatible" content="IE=edge">
			  <!--<![endif]-->
			  <title></title>
			
			  <style type="text/css">
				@media only screen and (min-width: 520px) {
				  .u-row {
					width: 500px !important;
				  }
				  .u-row .u-col {
					vertical-align: top;
				  }
				  .u-row .u-col-33p33 {
					width: 166.65px !important;
				  }
				  .u-row .u-col-25p25 {
					width: 150.65px !important;
				  }
				  .u-row .u-col-66p67 {
					width: 333.35px !important;
				  }
				  .u-row .u-col-100 {
					width: 500px !important;
				  }
				}
				
				@media (max-width: 520px) {
				  .u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				  }
				  .u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				  }
				  .u-row .u-col-33p33 {
					width: 33% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row .u-col-25p25 {
					width: 25% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row .u-col-66p67 {
					width: 66% !important;
					max-width: 100% !important;
					min-width: max-content !important;
				  }
				  .u-row {
					width: 100% !important;
				  }
				  .u-col {
					width: 100% !important;
				  }
				  .u-col>div {
					margin: 0 auto;
				  }
				}
				
				body {
				  margin: 0;
				  padding: 0;
				}
				
				table,
				tr,
				td {
				  vertical-align: top;
				  border-collapse: collapse;
				}
				
				p {
				  margin: 0;
				}
				
				.ie-container table,
				.mso-container table {
				  table-layout: fixed;
				}
				
				* {
				  line-height: inherit;
				}
				
				a[x-apple-data-detectors='true'] {
				  color: inherit !important;
				  text-decoration: none !important;
				}
				
				table,
				td {
				  color: #000000;
				}
				
				#u_body a {
				  color: #0000ee;
				  text-decoration: underline;
				}
				
				@media (max-width: 480px) {
				  #u_content_heading_1 .v-font-size {
					font-size: 14px !important;
				  }
				  #u_content_text_5 .v-text-align {
					text-align: center !important;
				  }
				}
			  </style>
			
			
			
			  <!--[if !mso]><!-->
			  <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
			  <!--<![endif]-->
			
			</head>
			
			<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
			  <!--[if IE]><div class="ie-container"><![endif]-->
			  <!--[if mso]><div class="mso-container"><![endif]-->
			  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
				<tbody>
				  <tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;"
												  width="480" />
			
											  </td>
											</tr>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 18px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Thank you for Shopping with us</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Order Number : <span style="line-height: 22.4px;">${emailBody?.orderNo}</span></p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table id="u_content_text_5" style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">Hi ${emailBody?.name}, thanks for your order.</p>
											<p style="line-height: 140%;">We'll let you know when your order have been shipped.</p>
											<p style="line-height: 140%;">Comment your order number on our TikTok @Thesnuslife and we'll make packing video of your order.</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span style="text-decoration: underline;">Shipping Information</span></span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											${emailBody?.shippingAdderess}
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 400;"><span><span><span><span style="text-decoration: underline;"><strong>Order Details</strong></span></span>
											</span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
								  <div class="u-row-container" style="padding: 0px;background-color: transparent">
								  	${emailBody?.productRows}	
								  </div>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 700;"><span><span><span><span style="text-decoration: underline;">Billing Information</span></span>
											</span>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											${emailBody?.shippingAdderess}
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <!--[if mso]><table width="100%"><tr><td><![endif]-->
										  <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Lato',sans-serif; font-size: 22px; font-weight: 400;"><span><strong><span style="text-decoration: underline;">Order Summary</span></strong>
											</span>
										  </h1>
										  <!--[if mso]></td></tr></table><![endif]-->
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
											<p style="line-height: 140%;"><strong>Subtotal :</strong> ${currencySymbol(emailBody?.currency)} ${(
				emailBody?.amountToPay - emailBody?.deliveryCharge
			).toFixed(2)}</p>
											<p style="line-height: 140%;"><strong>Shipping charge :</strong> ${emailBody?.couponType == "free_shipping"
				? `<span>
												<span style='margin-right:10px; text-decoration:line-through;'>${currencySymbol(
					emailBody?.currency
				)} ${(emailBody?.couponDiscount).toFixed(2)}</span>
												<span style=''>${currencySymbol(emailBody?.currency)} ${(emailBody?.deliveryCharge).toFixed(2)}</span>
											  </span>`
				: `${currencySymbol(
					emailBody?.currency
				)} ${(emailBody?.deliveryCharge).toFixed(2)}`
			}
											</p>
											${emailBody?.couponName || emailBody?.couponDiscount > 0
				? `<p style="line-height: 140%;"><strong>Coupon ${emailBody?.couponName || ""
				} :</strong> - ${currencySymbol(
					emailBody?.currency
				)} ${(emailBody?.couponDiscount).toFixed(2)}</p>`
				: ""
			}
											${emailBody?.country === "United Kingdom"
				? `<p style="line-height: 140%;"><strong>VAT :</strong> ${emailBody?.vatCharge}%</p>`
				: ""
			}
											<p style="line-height: 140%;"><strong>Total: :</strong> ${currencySymbol(
				emailBody?.currency
			)} ${(emailBody?.amountToPay).toFixed(2)}</p>
											</div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">We'll do everything to make sure you have a great experience with us</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-size: 16px; font-weight: 400; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;"><strong>Need assistance? Contact us.</strong></p>
											<p style="line-height: 140%;">Email us : <a target="_blank" href="mailto:${SEND_GRID_FROM}" rel="noopener">${SEND_GRID_FROM}</a></p>
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
						</div>
					  </div>
			
			
					  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				  </tr>
				</tbody>
			  </table>
			  <!--[if mso]></div><![endif]-->
			  <!--[if IE]></div><![endif]-->
			</body>
			
			</html>
			`,
	};
	if (emailBody.country === "United Kingdom") {
		// templateObj["bcc"] = "7cb2f96bc4@invite.trustpilot.com";
	}
	sendEmail(templateObj);
};

const contactUsSendMail = (emailBody) => {
	let templateObj = {
		to: "info@thesnuslife.com",
		bcc: "info@thesnuslife.co.uk",
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `Contact Us Form Submission`,

		html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	
	<head>
	  <!--[if gte mso 9]>
	<xml>
	  <o:OfficeDocumentSettings>
		<o:AllowPNG/>
		<o:PixelsPerInch>96</o:PixelsPerInch>
	  </o:OfficeDocumentSettings>
	</xml>
	<![endif]-->
	  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta name="x-apple-disable-message-reformatting">
	  <!--[if !mso]><!-->
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <!--<![endif]-->
	  <title></title>
	
	  <style type="text/css">
		@media only screen and (min-width: 620px) {
		  .u-row {
			width: 600px !important;
		  }
		  .u-row .u-col {
			vertical-align: top;
		  }
		  .u-row .u-col-100 {
			width: 600px !important;
		  }
		}
		
		@media (max-width: 620px) {
		  .u-row-container {
			max-width: 100% !important;
			padding-left: 0px !important;
			padding-right: 0px !important;
		  }
		  .u-row .u-col {
			min-width: 320px !important;
			max-width: 100% !important;
			display: block !important;
		  }
		  .u-row {
			width: 100% !important;
		  }
		  .u-col {
			width: 100% !important;
		  }
		  .u-col>div {
			margin: 0 auto;
		  }
		}
		
		body {
		  margin: 0;
		  padding: 0;
		}
		
		table,
		tr,
		td {
		  vertical-align: top;
		  border-collapse: collapse;
		}
		
		p {
		  margin: 0;
		}
		
		.ie-container table,
		.mso-container table {
		  table-layout: fixed;
		}
		
		* {
		  line-height: inherit;
		}
		
		a[x-apple-data-detectors='true'] {
		  color: inherit !important;
		  text-decoration: none !important;
		}
		
		table,
		td {
		  color: #000000;
		}
		
		#u_body a {
		  color: #0000ee;
		  text-decoration: underline;
		}
	  </style>
	
	
	
	  <!--[if !mso]><!-->
	  <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
	  <!--<![endif]-->
	
	</head>
	
	<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;>
	<table style="width:100% background-color:#ECF0F1">
	  <!--[if IE]><div class="ie-container"><![endif]-->
	  <!--[if mso]><div class="mso-container"><![endif]-->
	  <table id="u_body"
	  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%"
	  <tbody>
		  <tr style="vertical-align: top">
			<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
			  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
	
			  <div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px; padding: 12px 20px; overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display:  table-cell;vertical-align: top;">
					  <div style="height: 100%;width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="box-sizing: border-box; height: 100%; padding-left: 30px padding-right: 30px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	<div  style="border: 2px solid red padding-right:20px">
						  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
	
								  <table width="100%" cellpadding="0" cellspacing="0" border="0">
									<tr>
									  <td style="padding-right: 0px;padding-left: 0px;" align="center">
	
										<img align="center" border="0" src="https://assets.unlayer.com/projects/202007/1702041064255-snuslife.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 580px;"
										  width="580" />
	
									  </td>
									</tr>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
						  </div>
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				  </div>
				</div>
			  </div>
	
	
	
	
	
			  <div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px; padding:0 20px; background-color: #fff;  overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
				  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
					<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
					  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="box-sizing: border-box; height: 100%; border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
						  <!--<![endif]-->
	
						  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td style="overflow-wrap:break-word;word-break:break-word;font-family:'Cabin',sans-serif;" align="left">
	
								  <div style="font-size: 25px; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="line-height: 140%; background-color: #ffffff" ><span style="line-height: 35px;">You got new contact request</span></p>
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
				</div>
			  </div>
	
	
	
	
	
			  <div border-top: 1px solid #080808; class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px; padding: 12px 20px; overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
					  <div style="height: 100%;width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="box-sizing: border-box; height: 100%;padding-left: 30px padding-right: 30px; border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	




					<table  cellpadding="10" class="table table-dark table-striped table-hover">
					<thead>
					 
					</thead>
					<tbody>
					  
					  <tr>
						<td>Name </td>
						<td>${emailBody?.name}</td>
						
					  </tr>
					  <tr>
						  <td>Email </td>
						  <td>${emailBody?.email}</td>
						  
						</tr>
						<tr>
						  <td>Phone </td>
						  <td>${emailBody?.phone}</td>
						  
						</tr>
						<tr>
						  <td  style="white-space: nowrap;">Company</td>
						  <td>${emailBody?.company}</td>
						  
						</tr>
						<tr>
						  <td>Message</td>
						  <td>${emailBody?.message}</td>
						  
						</tr>
					
					</tbody>
				  </table>
	
						  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left">
	
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
				</div>
			  </div>
	
	
	
	
	
			  <div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
				  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
					  <div style="height: 100%;width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="box-sizing: border-box; height: 100%; padding-left: 30px padding-right: 30px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				  </div>
				</div>
			  </div>
	
	
	
	
	
			  <div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
				  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
					  <div style="height: 100%;width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="box-sizing: border-box; height: 100%;padding-left: 30px padding-right: 30px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				  </div>
				</div>
			  </div>
	
	
	
			  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
			</td>
		  </tr>
		</tbody>
		</table>
	  </table>
	  <!--[if mso]></div><![endif]-->
	  <!--[if IE]></div><![endif]-->
	</body>
	
	</html>`,
	};
	sendEmail(templateObj);
};

const shippingAdminEmail = (emailBody) => {
	let templateObj = {
		to: "info@thesnuslife.co.uk",
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `You shipped the order ${emailBody?.orderNo} for ${emailBody?.name} `,
		html: `<!DOCTYPE HTML
		PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
		xmlns:o="urn:schemas-microsoft-com:office:office">
	
	<head>
		<!--[if gte mso 9]>
				<xml>
				  <o:OfficeDocumentSettings>
					<o:AllowPNG/>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				  </o:OfficeDocumentSettings>
				</xml>
				<![endif]-->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="x-apple-disable-message-reformatting">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!--<![endif]-->
		<title></title>
	
		<style type="text/css">
		.text-line-through{
			text-decoration: line-through;
		  }
			@media only screen and (min-width: 620px) {
				.u-row {
					width: 600px !important;
				}
	
				.u-row .u-col {
					vertical-align: top;
				}
	
				.u-row .u-col-50 {
					width: 300px !important;
				}
	
				.u-row .u-col-100 {
					width: 600px !important;
				}
	
			}
	
			@media (max-width: 620px) {
				.u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				}
	
				.u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				}
	
				.u-row {
					width: 100% !important;
				}
	
				.u-col {
					width: 100% !important;
				}
	
				.u-col>div {
					margin: 0 auto;
				}
			}
	
			body {
				margin: 0;
				padding: 0;
			}
	
			table,
			tr,
			td {
				vertical-align: top;
				border-collapse: collapse;
			}
	
			p {
				margin: 0;
			}
	
			.ie-container table,
			.mso-container table {
				table-layout: fixed;
			}
	
			* {
				line-height: inherit;
			}
	
			a[x-apple-data-detectors='true'] {
				color: inherit !important;
				text-decoration: none !important;
			}
	
			table,
			td {
				color: #000000;
			}
	
			#u_body a {
				color: #0000ee;
				text-decoration: underline;
			}
	
			@media (max-width: 480px) {
				#u_content_image_1 .v-src-width {
					width: auto !important;
				}
	
				#u_content_image_1 .v-src-max-width {
					max-width: 82% !important;
				}
	
				#u_content_text_7 .v-font-size {
					font-size: 12px !important;
				}
	
				#u_content_text_8 .v-text-align {
					text-align: center !important;
				}
	
				#u_content_text_8 .v-line-height {
					line-height: 130% !important;
				}
	
				#u_content_text_12 .v-font-size {
					font-size: 27px !important;
				}
	
				#u_content_text_21 .v-container-padding-padding {
					padding: 50px 10px 10px 31px !important;
				}
			}
		</style>
	
	
	
	</head>
	
	<body class="clean-body u_body"
		style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">
		<!--[if IE]><div class="ie-container"><![endif]-->
		<!--[if mso]><div class="mso-container"><![endif]-->
		<table id="u_body"
			style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%"
			cellpadding="0" cellspacing="0">
			<tbody style="background-color:#ecf0f1;color:#000000;">
				<tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
						<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->
	
	
	
						<div class="u-row-container" style="padding: 0px;background-color: transparent">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table id="u_content_image_1"
													style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:14px 10px 24px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table width="100%" cellpadding="0" cellspacing="0"
																	border="0">
																	<tr>
																		<td class="v-text-align"
																			style="padding-right: 0px;padding-left: 0px;"
																			align="center">
	
																			<img align="center" border="0"
																				src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png"
																				alt="image" title="image"
																				style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 62%;max-width: 359.6px;"
																				width="359.6"
																				class="v-src-width v-src-max-width" />
	
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
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="598" style="background-color: #ffffff;width: 598px;padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 28px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div><span
																				style="color: #000000; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 5.6px;">Order
																				Dispatched</span></div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Order Number: <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff; line-height: 3.2px;">${emailBody?.orderNo
			}</span> 
																		</div>	
																	</div>
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Tracking URL: <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff; text-decoration: underline; line-height: 3.2px;"><a
																					href=${emailBody?.trackingURL}> Track now</a></span> </div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 13px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Tracking no. : <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff;line-height: 3.2px;">${emailBody?.trakingNo
			}</span> 
																		</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table id="u_content_text_7" style="font-family:arial,helvetica,sans-serif;"
													role="presentation" cellpadding="0" cellspacing="0" width="100%"
													border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:21px 32px 32px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 20%;"><span
																			style="color: #000000; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 3.2px;">Hi
																			${emailBody?.name}, Thanks for your order!</span>
																	</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table id="u_content_text_8" style="font-family:arial,helvetica,sans-serif;"
													role="presentation" cellpadding="0" cellspacing="0" width="100%"
													border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 30%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 130%;">Hi ${emailBody?.name}, This
																		is a confirmation to let you know your order has
																		been dispatched </p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 180%; text-align: center; word-wrap: break-word;">
																	<div>You can see the items that have been sent to you
																		below. Be sure to check out our TikTok @thesnuslife
																		where we package your orders!<br />Don't forget to
																		leave a review and let us know what you think!</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 320%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 320%;">Send us a photo of your
																		order on instagram @thesnuslifeltd</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
											
	
												<table id="u_content_text_12"
												style="font-family:arial,helvetica,sans-serif;" role="presentation"
												cellpadding="0" cellspacing="0" width="100%" border="0">
												<tbody>
													<tr>
														<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 10px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 28px; line-height: 140%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Shipping Information</div>
																</div>
															</div>

														</td>
													</tr>
												</tbody>
											</table>

	
												<!--[if (!mso)&(!IE)]><!-->
											
											<!--<![endif]-->
										</div>
									</div>
									<!--[if (mso)|(IE)]></td><![endif]-->
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
	
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 180%; text-align: left; word-wrap: break-word;">
																	<br />
																	${emailBody?.shippingAdderess}
																</div>

															</td>
														</tr>
													</tbody>
												</table>
												<table>
												<tbody>
												<tr>
													<td class="m_-7148323961435086870v-container-padding-padding" style="word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif" align="left">

														<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #080808">
															<tbody>
																<tr style="vertical-align:top">
																	<td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
																		<span>&nbsp;</span>
																	</td>
																</tr>
															</tbody>
														</table>

													</td>
												</tr>
											</tbody>
											</table>
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
													<tr>
														<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 10px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 28px; line-height: 80%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Order details</div>
																</div>
															</div>

														</td>
													</tr>
												</tbody>
												</table>
												<table>
												<table>
												<tbody>
												<tr>
													<td class="m_-7148323961435086870v-container-padding-padding" style="word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif" align="left">

														<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #080808">
															<tbody>
																<tr style="vertical-align:top">
																	<td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
																		<span>&nbsp;</span>
																	</td>
																</tr>
															</tbody>
														</table>

													</td>
												</tr>
											</tbody>
											</table>
												</table>
	
												<!--[if (!mso)&(!IE)]><!-->
											</div>
											<!--<![endif]-->
										</div>
									</div>
									<!--[if (mso)|(IE)]></td><![endif]-->
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
	
						<div  class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							${emailBody?.productRowsWithoutConversion}
						</div>
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 29px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>
																		<div>Billing Information</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px 0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>${emailBody?.shippingAdderess}</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 29px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>
																		<div>Order Summary</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
															<tr>
															<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px 0px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 13px; line-height: 140%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Subtotal : ${currencySymbol("GBP")} ${(emailBody?.amountInGBP - emailBody?.deliveryInGBP).toFixed(2)}</div>
																	<div style="margin-right: 10px">
																		Shipping charge  : ${emailBody?.couponType == "free_shipping"
				? `<span >
																		<span class='text-line-through' style="margin-right: 10px">${currencySymbol(
					"GBP"
				)}${emailBody.couponDiscountInGBP.toFixed(2)}
																		</span> <span  style="margin-right: 5px">${currencySymbol("GBP")} ${emailBody.deliveryInGBP.toFixed(2)}</span>
																
																	  </span>`
				: `<span style="margin-right: 10px">${currencySymbol(
					"GBP"
				)} ${(emailBody?.deliveryInGBP).toFixed(
					2
				)}
				</span>`
			}
																		
																	</div>
																	<div>${emailBody.couponName ||
				emailBody?.couponDiscountInGBP > 0
				? `<div>Coupon   ${emailBody.couponName || ""
				} :<span style="margin-right:5px"> - ${currencySymbol(
					"GBP"
				)} ${emailBody.couponDiscountInGBP.toFixed(
					2
				)} 
				 </span></div>`
				: ""
			}</div>
																	<div>${emailBody?.country === "United Kingdom" ? `<div>VAT : ${emailBody.vatCharge}%</div>` : ""}												
																		</div>
																		
																	<div><strong>Total : ${currencySymbol("GBP")} ${(emailBody?.amountInGBP).toFixed(2)}</strong></div></div>
															</div>

														</td
															</tr>
														</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:51px 35px 0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">We'll do everything we can
																		to make sure you have a great experience with us.
																	</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:28px 35px 8px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 18px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;"><strong>Need assistance?
																			Contact us.</strong></p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:0px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">Email us: <a
																			rel="noopener" href="mailto:${SEND_GRID_FROM}"
																			target="_blank">${SEND_GRID_FROM}</a></p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:28px 35px 91px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">Unsubscribe - Unsubscribe
																		Preferences</p>
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
							</div>
						</div>
	
	
	
						<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				</tr>
			</tbody>
		</table>
		</div>
		<!--[if mso]></div><![endif]-->
		<!--[if IE]></div><![endif]-->
	</body>
	
	</html>`,
	};
	sendEmail(templateObj);
};
const trackingNoCustomerEmail = ({ to, emailBody }) => {
	let templateObj = {
		to,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `Your order is on its way ${emailBody?.orderNo}`,
		html: `<!DOCTYPE HTML
		PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
		xmlns:o="urn:schemas-microsoft-com:office:office">
	
	<head>
		<!--[if gte mso 9]>
				<xml>
				  <o:OfficeDocumentSettings>
					<o:AllowPNG/>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				  </o:OfficeDocumentSettings>
				</xml>
				<![endif]-->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="x-apple-disable-message-reformatting">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!--<![endif]-->
		<title></title>
	
		<style type="text/css">
		.text-line-through{
			text-decoration: line-through;
		  }
			@media only screen and (min-width: 620px) {
				.u-row {
					width: 600px !important;
				}
	
				.u-row .u-col {
					vertical-align: top;
				}
	
				.u-row .u-col-50 {
					width: 300px !important;
				}
	
				.u-row .u-col-100 {
					width: 600px !important;
				}
	
			}
	
			@media (max-width: 620px) {
				.u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				}
	
				.u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				}
	
				.u-row {
					width: 100% !important;
				}
	
				.u-col {
					width: 100% !important;
				}
	
				.u-col>div {
					margin: 0 auto;
				}
			}
	
			body {
				margin: 0;
				padding: 0;
			}
	
			table,
			tr,
			td {
				vertical-align: top;
				border-collapse: collapse;
			}
	
			p {
				margin: 0;
			}
	
			.ie-container table,
			.mso-container table {
				table-layout: fixed;
			}
	
			* {
				line-height: inherit;
			}
	
			a[x-apple-data-detectors='true'] {
				color: inherit !important;
				text-decoration: none !important;
			}
	
			table,
			td {
				color: #000000;
			}
	
			#u_body a {
				color: #0000ee;
				text-decoration: underline;
			}
	
			@media (max-width: 480px) {
				#u_content_image_1 .v-src-width {
					width: auto !important;
				}
	
				#u_content_image_1 .v-src-max-width {
					max-width: 82% !important;
				}
	
				#u_content_text_7 .v-font-size {
					font-size: 12px !important;
				}
	
				#u_content_text_8 .v-text-align {
					text-align: center !important;
				}
	
				#u_content_text_8 .v-line-height {
					line-height: 130% !important;
				}
	
				#u_content_text_12 .v-font-size {
					font-size: 27px !important;
				}
	
				#u_content_text_21 .v-container-padding-padding {
					padding: 50px 10px 10px 31px !important;
				}
			}
		</style>
	
	
	
	</head>
	
	<body class="clean-body u_body"
		style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">
		<!--[if IE]><div class="ie-container"><![endif]-->
		<!--[if mso]><div class="mso-container"><![endif]-->
		<table id="u_body"
			style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%"
			cellpadding="0" cellspacing="0">
			<tbody style="background-color:#ecf0f1;color:#000000;">
				<tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
						<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->
	
	
	
						<div class="u-row-container" style="padding: 0px;background-color: transparent">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table id="u_content_image_1"
													style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:14px 10px 24px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table width="100%" cellpadding="0" cellspacing="0"
																	border="0">
																	<tr>
																		<td class="v-text-align"
																			style="padding-right: 0px;padding-left: 0px;"
																			align="center">
	
																			<img align="center" border="0"
																				src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png"
																				alt="image" title="image"
																				style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 62%;max-width: 359.6px;"
																				width="359.6"
																				class="v-src-width v-src-max-width" />
	
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
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="598" style="background-color: #ffffff;width: 598px;padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #ffffff;border-left: 1px solid #ffffff;border-right: 1px solid #ffffff;border-bottom: 1px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 28px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div><span
																				style="color: #000000; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 5.6px;">Order
																				Dispatched</span></div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Order Number: <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff; line-height: 3.2px;">${emailBody?.orderNo
			}</span> 
																		</div>	
																	</div>
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 21px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Tracking URL: <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff; text-decoration: underline; line-height: 3.2px;"><a
																					href=${emailBody?.trackingURL}> Track now</a></span> </div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:11px 21px 13px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<div>
																		<div>Tracking no. : <span
																				style="color: #000000; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: #ffffff;line-height: 3.2px;">${emailBody?.trakingNo
			}</span> 
																		</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table id="u_content_text_7" style="font-family:arial,helvetica,sans-serif;"
													role="presentation" cellpadding="0" cellspacing="0" width="100%"
													border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:21px 32px 32px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 16px; line-height: 20%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 20%;"><span
																			style="color: #000000; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 3.2px;">Hi
																			${emailBody?.name}, Thanks for your order!</span>
																	</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table id="u_content_text_8" style="font-family:arial,helvetica,sans-serif;"
													role="presentation" cellpadding="0" cellspacing="0" width="100%"
													border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 30%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 130%;">Hi ${emailBody?.name}, This
																		is a confirmation to let you know your order has
																		been dispatched </p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 180%; text-align: center; word-wrap: break-word;">
																	<div>You can see the items that have been sent to you
																		below. Be sure to check out our TikTok @thesnuslife
																		where we package your orders!<br />Don't forget to
																		leave a review and let us know what you think!</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 320%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 320%;">Send us a photo of your
																		order on instagram @thesnuslifeltd</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
											
	
												<table id="u_content_text_12"
												style="font-family:arial,helvetica,sans-serif;" role="presentation"
												cellpadding="0" cellspacing="0" width="100%" border="0">
												<tbody>
													<tr>
														<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 10px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 28px; line-height: 140%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Shipping Information</div>
																</div>
															</div>

														</td>
													</tr>
												</tbody>
											</table>

	
												<!--[if (!mso)&(!IE)]><!-->
											
											<!--<![endif]-->
										</div>
									</div>
									<!--[if (mso)|(IE)]></td><![endif]-->
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
	
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 180%; text-align: left; word-wrap: break-word;">
																	<br />
																	${emailBody?.shippingAdderess}
																</div>

															</td>
														</tr>
													</tbody>
												</table>
												<table>
												<tbody>
												<tr>
													<td class="m_-7148323961435086870v-container-padding-padding" style="word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif" align="left">

														<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #080808">
															<tbody>
																<tr style="vertical-align:top">
																	<td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
																		<span>&nbsp;</span>
																	</td>
																</tr>
															</tbody>
														</table>

													</td>
												</tr>
											</tbody>
											</table>
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
													<tr>
														<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 10px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 28px; line-height: 80%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Order details</div>
																</div>
															</div>

														</td>
													</tr>
												</tbody>
												</table>
												<table>
												<table>
												<tbody>
												<tr>
													<td class="m_-7148323961435086870v-container-padding-padding" style="word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif" align="left">

														<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #080808">
															<tbody>
																<tr style="vertical-align:top">
																	<td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
																		<span>&nbsp;</span>
																	</td>
																</tr>
															</tbody>
														</table>

													</td>
												</tr>
											</tbody>
											</table>
												</table>
	
												<!--[if (!mso)&(!IE)]><!-->
											</div>
											<!--<![endif]-->
										</div>
									</div>
									<!--[if (mso)|(IE)]></td><![endif]-->
									<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
								</div>
							</div>
						</div>
	
	
	
						<div  class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							${emailBody?.productRows}
						</div>
	
	
						<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
							<div class="u-row"
								style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
								<div
									style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
									<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	
									<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
									<div class="u-col u-col-100"
										style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
										<div
											style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
											<!--[if (!mso)&(!IE)]><!-->
											<div
												style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
												<!--<![endif]-->
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 29px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>
																		<div>Billing Information</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px 0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>${emailBody?.shippingAdderess}</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:57px 35px 7px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 29px; line-height: 140%; text-align: left; word-wrap: break-word;">
																	<div>
																		<div>Order Summary</div>
																	</div>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:10px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table height="0px" align="center" border="0"
																	cellpadding="0" cellspacing="0" width="100%"
																	style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #080808;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																	<tbody>
																		<tr style="vertical-align: top">
																			<td
																				style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																				<span>&#160;</span>
																			</td>
																		</tr>
																	</tbody>
																</table>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
															<tr>
															<td class="v-container-padding-padding"
															style="overflow-wrap:break-word;word-break:break-word;padding:7px 35px 0px;font-family:arial,helvetica,sans-serif;"
															align="left">

															<div class="v-text-align v-line-height v-font-size"
																style="font-size: 13px; line-height: 140%; text-align: left; word-wrap: break-word;">
																<div>
																	<div>Subtotal : ${currencySymbol(emailBody?.currency)} ${(emailBody?.amountToPay - emailBody?.deliveryCharge).toFixed(
				2
			)}</div>
																	<div style="margin-right: 10px">
																		Shipping charge  : ${emailBody?.couponType == "free_shipping"
				? `<span >
																		<span class='text-line-through' style="margin-right: 10px">${currencySymbol(
					emailBody?.currency
				)}${emailBody.couponDiscount.toFixed(
					2
				)}</span> <span  style="margin-right: 5px">${currencySymbol(
					emailBody?.currency
				)} ${emailBody.deliveryCharge.toFixed(2)}</span>
																
																	  </span>`
				: `<span style="margin-right: 10px">${currencySymbol(
					emailBody?.currency
				)} ${(emailBody?.deliveryCharge).toFixed(
					2
				)}</span>`
			}
																		
																	</div>
																	<div>${emailBody.couponName ||
				emailBody?.couponDiscount > 0
				? `<div>Coupon   ${emailBody.couponName || ""
				} :<span style="margin-right:5px"> - ${currencySymbol(
					emailBody?.currency
				)} ${emailBody.couponDiscount.toFixed(
					2
				)} </span></div>`
				: ""
			}</div>
																	<div>${emailBody?.country === "United Kingdom" ? `<div>VAT : ${emailBody.vatCharge}%</div>` : ""}												
																		</div>
																		
																	<div><strong>Total : ${currencySymbol(emailBody?.currency)} ${(emailBody?.amountToPay).toFixed(2)}</strong></div></div>
															</div>

														</td
															</tr>
														</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:51px 35px 0px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">We'll do everything we can
																		to make sure you have a great experience with us.
																	</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:28px 35px 8px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 18px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;"><strong>Need assistance?
																			Contact us.</strong></p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:0px 35px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">Email us: <a
																			rel="noopener" href="mailto:${SEND_GRID_FROM}"
																			target="_blank">${SEND_GRID_FROM}</a></p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
	
												<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:28px 35px 91px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">Unsubscribe - Unsubscribe
																		Preferences</p>
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
							</div>
						</div>
	
	
	
						<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				</tr>
			</tbody>
		</table>
		</div>
		<!--[if mso]></div><![endif]-->
		<!--[if IE]></div><![endif]-->
	</body>
	
	</html>`,
	};
	sendEmail(templateObj);
};

const sentCartAbandonMail = ({ to, emailBody }) => {
	let productsHtml = "";
	// Generate HTML for each product in the email body
	emailBody.products.forEach((product) => {
		productsHtml += `
            <div style="display: flex; margin-bottom: 20px;">
                <img src="${product.imageUrl}" alt="${product.name}" style="width: 100px; height: 100px; margin-right: 20px;">
                <div>
                    <h3>${product.name}</h3>
                    <p>Price: £${product.price}</p>
                </div>
            </div>
        `;
	});

	let templateObj = {
		to,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `Did you forget something?`,
		html: `<!doctype html>
        <html ⚡4email data-css-strict>
        <head>
            <meta charset="utf-8">
            <meta name="x-apple-disable-message-reformatting">
            <style amp4email-boilerplate>
                body {Need assistance?
                    visibility: hidden
                }
            </style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <style amp-custom>
                body {
                    margin: 0;
                    padding: 0;
                }
                table,
                tr,
                td {
                    vertical-align: top;
                    border-collapse: collapse;
                }
                p {
                    margin: 0;
                }
                .ie-container table,
                .mso-container table {
                    table-layout: fixed;
                }
                * {
                    line-height: inherit;
                }
                table,
                td {
                    color: #000000;
                }
                #u_body a {
                    color: #0000ee;
                    text-decoration: underline;
                }
            </style>
        </head>
		
        <body class="clean-body u_body" style="margin: 0;padding: 0;background-color: #f9f9f9;color: #000000">
		
            <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
			
                <tbody>
                    <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse;vertical-align: top">
                            <div style="padding: 0px;">
                                <div style="max-width: 600px;margin: 0 auto;background-color: #ffffff;">
                                    <div class="u-row">
                                        <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <div style="width: 100%;padding:0px;">
                                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
													<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:14px 10px 24px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<table width="100%" cellpadding="0" cellspacing="0"
																	border="0">
																	<tr>
																		<td class="v-text-align"
																			style="padding-right: 0px;padding-left: 0px;"
																			align="center">
	
																			<img align="center" border="0"
																				src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png"
																				alt="image" title="image"
																				style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 62%;max-width: 359.6px;"
																				width="359.6"
																				class="v-src-width v-src-max-width" />
	
																		</td>
																	</tr>
																</table>
	
															</td>
														</tr>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
                                                                <div style="text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 24px;"><span style="font-size: 24px; ">We noticed you left something in your cart </span></p>
                                                                </div>
                                                                <div style="margin-left: 100px;  margin: 20px;  text-align: center;">
                                                                    Would you like to complete your purchase?
                                                                </div>
                                                                <!-- Display products -->
                                                                ${productsHtml}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
												<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="center">
											<button style="border-radius:6px; background:#000; height:36px; width:175px;">
											<a style="color: #fff; text-decoration:none; font-weight:600; font-family: sans-serif; font-size: 16px; text-align: center; white-space: normal; " target="_blank" href='${REMOTE_BASE_URL}/cart' rel="noopener">Finish Checkout</a>
											</button>			
										</td>
									  </tr>
									</tbody>
								  </table>
                                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                                                                <!--[if mso]><style>.v-button {background: transparent;}</style><![endif]-->
                                                                <div align="center">
                                                                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:46px; v-text-anchor:middle; width:234px;" arcsize="8.5%"  stroke="f" fillcolor="#ff6600"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                                                    <a target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;text-align: center;color: #FFFFFF; background-color: #ff6600; border-radius: 4px;  width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; font-size: 14px;">
                                                                        </span>
                                                                        </span>
                                                                    </a>
                                                                    <!--[if mso]></center></v:roundrect><![endif]-->
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

												
                                               
												 <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
			
										  <div class="v-text-align v-font-size" style="font-family: 'Lato',sans-serif; font-size: 16px; line-height: 140%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 140%;">We'll do everything to make sure you have a great experience with us</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
								  <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
								  <tbody>
									<tr>
									  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;" align="left">
		  
										<div class="v-text-align v-font-size" style="font-size: 16px; font-weight: 400; line-height: 140%; text-align: center; word-wrap: break-word;">
										  <p style="line-height: 140%; margin: 30px"><strong>Need assistance? Contact us.</strong></p>
										  <p style="line-height: 140%; ">Email us : <a target="_blank" href="mailto:${SEND_GRID_FROM}" rel="noopener">${SEND_GRID_FROM}</a></p>
										</div>
		  
									  </td>
									</tr>
								  </tbody>
								</table>
								<table style="font-family:arial,helvetica,sans-serif;" role="presentation"
													cellpadding="0" cellspacing="0" width="100%" border="0">
													<tbody>
														<tr>
															<td class="v-container-padding-padding"
																style="overflow-wrap:break-word;word-break:break-word;padding:28px 35px 91px;font-family:arial,helvetica,sans-serif;"
																align="left">
	
																<div class="v-text-align v-line-height v-font-size"
																	style="font-size: 13px; line-height: 140%; text-align: center; word-wrap: break-word;">
																	<p style="line-height: 140%;">Unsubscribe - Unsubscribe
																		Preferences</p>
																</div>
	
															</td>
														</tr>
													</tbody>
												</table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>`,
	};
	sendEmail(templateObj);
};

const resetPasswordMail = ({ to, emailBody }) => {
	let templateObj = {
		to,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `Reset Password Link`,
		html: `<!DOCTYPE html>
		<html>

		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Order Confirmation</title>
		</head>
		
		<body>
		<div>
		Click on below button to reset your password :
		</div>
		<div>
		<a style="padding:'5px 10px!important'; background-color:'#0396ff !important'; text-decoration:'none'; border-radius:'5px'" href=${process.env.REMOTE_BASE_URL}/reset-password/${emailBody} target='_blank'>Reset Password here</a>
		</div>
				
		</body>
		
		</html>`,
	};
	sendEmail(templateObj);
};

const notifyAdminProduct = (email, productDetails) => {
	let templateObj = {
		to: "info@thesnuslife.co.uk",
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `You have a new request for ${productDetails?.name}`,
		html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
			
			<head>
			  <!--[if gte mso 9]>
			<xml>
			  <o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			  </o:OfficeDocumentSettings>
			</xml>
			<![endif]-->
			  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <meta name="x-apple-disable-message-reformatting">
			  <!--[if !mso]><!-->
			  <meta http-equiv="X-UA-Compatible" content="IE=edge">
			  <!--<![endif]-->
			  <title></title>
			
			  <style type="text/css">
				@media only screen and (min-width: 620px) {
				  .u-row {
					width: 600px !important;
				  }
				  .u-row .u-col {
					vertical-align: top;
				  }
				  .u-row .u-col-100 {
					width: 600px !important;
				  }
				}
				
				@media (max-width: 620px) {
				  .u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				  }
				  .u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				  }
				  .u-row {
					width: 100% !important;
				  }
				  .u-col {
					width: 100% !important;
				  }
				  .u-col>div {
					margin: 0 auto;
				  }
				}
				
				body {
				  margin: 0;
				  padding: 0;
				}
				
				table,
				tr,
				td {
				  vertical-align: top;
				  border-collapse: collapse;
				}
				
				p {
				  margin: 0;
				}
				
				.ie-container table,
				.mso-container table {
				  table-layout: fixed;
				}
				
				* {
				  line-height: inherit;
				}
				
				a[x-apple-data-detectors='true'] {
				  color: inherit !important;
				  text-decoration: none !important;
				}
				
				table,
				td {
				  color: #000000;
				}
				
				#u_body a {
				  color: #0000ee;
				  text-decoration: underline;
				}
			  </style>
			
			
			
			  <!--[if !mso]><!-->
			  <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
			  <!--<![endif]-->
			
			</head>
			
			<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
			  <!--[if IE]><div class="ie-container"><![endif]-->
			  <!--[if mso]><div class="mso-container"><![endif]-->
			  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
				<tbody>
				  <tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="https://assets.unlayer.com/projects/196971/1699953703675-Group%204101%20(1)%201.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;"
												  width="179.2" />
			
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
							<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
						  </div>
						</div>
					  </div>
			
			
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: #ecf0f1;color: #000000">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 120%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 120%;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 19.2px;">You have a new request</span></p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 120%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 120%;"><a style="color: #1155cc; font-family: sans-serif; font-size: 16px; font-weight: 300; text-align: center; white-space: normal; background-color: #ffffff;" target="_blank" href='mailto:${email}' rel="noopener">${email}</a>
											  <span
												style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: 300; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 19.2px;">&nbsp;would like to know when this product is back in stock.</span>
											</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="${productDetails?.productImageUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 47%;max-width: 263.2px;"
												  width="263.2" />
			
											  </td>
											</tr>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 160%;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;">${productDetails?.name}</span></p>
											<p style="line-height: 160%;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;">£${productDetails?.price}</span>                                  </span>
											</p>
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
						</div>
					  </div>
			
			
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
			
										  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<tbody>
											  <tr style="vertical-align: top">
												<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
												  <span>&#160;</span>
												</td>
											  </tr>
											</tbody>
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
							<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
						  </div>
						</div>
					  </div>
			
			
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								  <!--<![endif]-->
			
							
			
			
								  <!--[if (!mso)&(!IE)]><!-->
								</div>
								<!--<![endif]-->
							  </div>
							</div>
							<!--[if (mso)|(IE)]></td><![endif]-->
							<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
						  </div>
						</div>
					  </div>
			
			
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
								  <!--<![endif]-->
			
								
			
								 
			
								 
			
								  <!--[if (!mso)&(!IE)]><!-->
								</div>
								<!--<![endif]-->
							  </div>
							</div>
							<!--[if (mso)|(IE)]></td><![endif]-->
							<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
						  </div>
						</div>
					  </div>
			
			
			
					  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				  </tr>
				</tbody>
			  </table>
			  <!--[if mso]></div><![endif]-->
			  <!--[if IE]></div><![endif]-->
			</body>
			
			</html>
   			`,
	};
	sendEmail(templateObj);
};

const notifyCustomerProduct = (to, productDetails) => {
	let templateObj = {
		to: to,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: `${productDetails?.name} is back in stock`,
		html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
			
			<head>
			  <!--[if gte mso 9]>
			<xml>
			  <o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			  </o:OfficeDocumentSettings>
			</xml>
			<![endif]-->
			  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <meta name="x-apple-disable-message-reformatting">
			  <!--[if !mso]><!-->
			  <meta http-equiv="X-UA-Compatible" content="IE=edge">
			  <!--<![endif]-->
			  <title></title>
			
			  <style type="text/css">
				@media only screen and (min-width: 620px) {
				  .u-row {
					width: 600px !important;
				  }
				  .u-row .u-col {
					vertical-align: top;
				  }
				  .u-row .u-col-100 {
					width: 600px !important;
				  }
				}
				
				@media (max-width: 620px) {
				  .u-row-container {
					max-width: 100% !important;
					padding-left: 0px !important;
					padding-right: 0px !important;
				  }
				  .u-row .u-col {
					min-width: 320px !important;
					max-width: 100% !important;
					display: block !important;
				  }
				  .u-row {
					width: 100% !important;
				  }
				  .u-col {
					width: 100% !important;
				  }
				  .u-col>div {
					margin: 0 auto;
				  }
				}
				
				body {
				  margin: 0;
				  padding: 0;
				}
				
				table,
				tr,
				td {
				  vertical-align: top;
				  border-collapse: collapse;
				}
				
				p {
				  margin: 0;
				}
				
				.ie-container table,
				.mso-container table {
				  table-layout: fixed;
				}
				
				* {
				  line-height: inherit;
				}
				
				a[x-apple-data-detectors='true'] {
				  color: inherit !important;
				  text-decoration: none !important;
				}
				
				table,
				td {
				  color: #000000;
				}
			  </style>
			
			
			
			  <!--[if !mso]><!-->
			  <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
			  <!--<![endif]-->
			
			</head>
			
			<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
			  <!--[if IE]><div class="ie-container"><![endif]-->
			  <!--[if mso]><div class="mso-container"><![endif]-->
			  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
				<tbody>
				  <tr style="vertical-align: top">
					<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="https://assets.unlayer.com/projects/196971/1699953703675-Group%204101%20(1)%201.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;"
												  width="179.2" />
			
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
							<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
						  </div>
						</div>
					  </div>
			
			
			
			
			
					  <div class="u-row-container" style="padding: 0px;background-color: transparent">
						<div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
						  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
			
							<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
							<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
							  <div style="height: 100%;width: 100% !important;">
								<!--[if (!mso)&(!IE)]><!-->
								<div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
								  <!--<![endif]-->
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 120%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 120%;"><strong><span style="font-size: 16px; line-height: 19.2px;">Great news!</span></strong></p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 120%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 120%;"> <span style="color: #343434; font-family: sans-serif; font-size: 14px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 16.8px;">${productDetails?.name
			}</span> is now back in stock. Grab it while stocks last!</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
			
										  <table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
											  <td style="padding-right: 0px;padding-left: 0px;" align="center">
			
												<img align="center" border="0" src="${productDetails?.productImageUrl
			}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 47%;max-width: 263.2px;"
												  width="263.2" />
			
											  </td>
											</tr>
										  </table>
			
										</td>
									  </tr>
									</tbody>
								  </table>
			
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:'Cabin',sans-serif;" align="left">
			
										  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
											<p style="line-height: 160%;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;">${productDetails?.name
			}</span></p>
											<p style="line-height: 160%;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;"><span style="color: #343434; font-family: sans-serif; font-size: 16px; font-weight: bold; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 25.6px;">£${productDetails?.price
			}</span>                                  </span>
											</p>
										  </div>
			
										</td>
									  </tr>
									</tbody>
								  </table>
								  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
									<tbody>
									  <tr>
										<td style="overflow-wrap:break-word;word-break:break-word;padding:17px 55px;font-family:'Cabin',sans-serif;" align="center">
											<button style="border-radius:6px; background:#000; height:36px; width:175px;">
											${productDetails?.name.includes("Pick 'n' Mix")
				? `<a style="color: #fff; text-decoration:none; font-weight:600; font-family: sans-serif; font-size: 16px; text-align: center; white-space: normal; " target="_blank" href='${REMOTE_BASE_URL}/mix-match/${productDetails?._id}' rel="noopener">View Product</a>`
				: `<a style="color: #fff; text-decoration:none; font-weight:600; font-family: sans-serif; font-size: 16px; text-align: center; white-space: normal; " target="_blank" href='${REMOTE_BASE_URL}/product-page/${encodeURIComponent(
					productDetails?.name
				)}' rel="noopener">View Product</a>`
			}
											</button>			
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
						</div>
					  </div>
			
			
			
					  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
					</td>
				  </tr>
				</tbody>
			  </table>
			  <!--[if mso]></div><![endif]-->
			  <!--[if IE]></div><![endif]-->
			</body>
			
			</html>
   			`,
	};
	sendEmail(templateObj);
};

async function sendEmail(templateObj) {
	try {
		await sendGridMail.send(templateObj);
		console.log("Email sent successfully");
	} catch (error) {
		console.error("Error Email");
		console.error(error);
		if (error.response) {
			console.error(error.response.body);
		}
	}
}

const UserloginwithGoogle = (user) => {
	const templateObj = {
		to: user.email,
		from: {
			email: SEND_GRID_FROM,
			name: `THE SNUS LIFE`,
		},
		subject: "Welcome to TheSnusLife",
		html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to THE SNUS LIFE</title>
        </head>
        
        <body>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->
                      <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;"
                        role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif;"
                              align="left">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align"
                                    style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                    <img align="center" border="0"
                                      src="https://assets.unlayer.com/projects/196042/1699512014627-Group%204101%20(1)%201.png"
                                      alt="image" title="image"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 62%;max-width: 359.6px;"
                                      width="359.6" class="v-src-width v-src-max-width" />
        
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
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
              <div style="display: table-cell; vertical-align: top; width: 50%;">
                <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap: break-word; word-break: break-word; padding: 20px; font-family: Arial, Helvetica, sans-serif;"
                          align="left">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right: 0px; padding-left: 0px;">
                              Welcome to TheSnusLife!
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 10px;">
                                An account has been created for the email
                                ${user?.email}. In your account you can view and track all of your
                                orders from one place, update autofilled addresses and create Wishlists.
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 10px;">
                                The default password is "@Thesnuslife1", but be sure to update it.
                              </td>
                            </tr>
                          </table>
        
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                            cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding-top:20px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
                                  <div class="v-text-align v-line-height v-font-size"
                                    style="font-size: 13px; line-height: 140%; word-wrap: break-word;">
                                    <p style="line-height: 140%;">
                                      For any questions or assistance,
                                      reply to this email or email us at:
                                      <a rel="noopener" href="mailto:${SEND_GRID_FROM}"
                                        target="_blank">
                                        ${SEND_GRID_FROM}
                                      </a>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </body>
        
        </html>`,
	};
	sendEmail(templateObj);
};

module.exports = {
	placeOrderMailToAdmin,
	placeOrderCustomerEmail,
	shippingAdminEmail,
	trackingNoCustomerEmail,
	sentCartAbandonMail,
	contactUsSendMail,
	resetPasswordMail,
	notifyAdminProduct,
	notifyCustomerProduct,
	sendEmail,
	UserloginwithGoogle,
};
