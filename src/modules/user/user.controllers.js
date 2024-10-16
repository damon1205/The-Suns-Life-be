const httpStatus = require('http-status');
const catchAsync = require("../../utils/catchAsync");
const pick = require('../../utils/pick');
const { sendResponse } = require("../../utils/responseHandler");
const userServices = require("./user.services");
const tokenServices = require("../token/token.services");
const { convertToJSON } = require('../../utils/helper');
const { tokenTypes } = require('../../config/tokens');
const contacts = require('../../databaseJson/contacts.json');
const { resetPasswordMail, contactUsSendMail, sendEmail } = require('../../utils/emailservice');
const User = require('./user.model');
const SEND_GRID_FROM = process.env.SENDGRID_FROM;





const importUsers = catchAsync(async (req, res) => {
	if (contacts.length) {

		try {
			const uniqueUsers = [];

			for (let contact of contacts) {
				if (contact["Email 1"] !== "") {
					// Check if a user with this email already exists in the database
					const userExists = await User.findOne({ email: contact["Email 1"] });

					if (!userExists) {
						// If user exists, add to the list
						uniqueUsers.push({
							fName: contact["First Name"] || "",
							lName: contact["Last Name"] || "",
							email: contact["Email 1"],
							password: "@Thesnuslife1",
							phoneNo: parseInt(contact["Phone 1"]) || null,
							createdAt: new Date(contact["Created At (UTC+0)"]) || null
						});
					}
				}
			}

			if (uniqueUsers?.length > 0) {
				let addResponse = await userServices.importUsers(uniqueUsers);
				if (addResponse?.code === 201) {
					sendResponse(res, httpStatus.CREATED, addResponse?.data, null);
				} else {
					sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, addResponse?.msg);
				}
			} else {
				sendResponse(res, httpStatus.BAD_REQUEST, null, "No unique users to import.");
			}
		} catch (error) {
			console.error(error);
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Internal Server Error');
		}
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, 'Contacts Array Is Empty!');
	}
});

const signupUser = catchAsync(async (req, res) => {
	let user = req.body;
	let duplicateUsername = await userServices.isUsernameTaken(user?.username || "");
	if (duplicateUsername) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `This username already taken, please use different username.`);
		return
	}
	let duplicateEmail = await userServices.isEmailTaken(user?.email);
	if (duplicateEmail) {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `This email already registered with us, please login.`);
		return
	}

	if (user) {
		let addResponse = await userServices.signupUser(user)
		if (addResponse) {

			const tokens = await tokenServices.generateAuthTokens(addResponse);

			return sendResponse(res, httpStatus.OK, { user: addResponse, tokens }, null);
		}
	} else {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, `User not added`);

	}
});


const newUser = catchAsync(async (req, res) => {
	let user = req.body;
	user["password"] = "@Thesnuslife1";
  
	let duplicateEmail = await userServices.isEmailTaken(user?.email);
	if (duplicateEmail) {
	  sendResponse(res, httpStatus.BAD_REQUEST, null, `This email already registered with us, please login.`);
	  return;
	}
  
	if (user) {
	  let addResponse = await userServices.newUser(user);
	  if (addResponse) {
		try {
			const emailBody = `<!DOCTYPE html>
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
															Thanks for your recent order !
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
			
			</html>`;
  
		  const templateObj = {
			to: user.email,
			from: SEND_GRID_FROM,
			subject: 'Welcome to TheSnusLife', 
			html: emailBody,
		  };
  
		  await sendEmail(templateObj);
		} catch (e) {
		  console.log("Error while sending mail", e);
		}
  
		const tokens = await tokenServices.generateAuthTokens(addResponse);
		sendResponse(res, httpStatus.OK, { user: addResponse, tokens }, null);
	  } else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, `User not added`);
	  }
	} else {
	  sendResponse(res, httpStatus.BAD_REQUEST, null, `Invalid user data`);
	}
  });
  


const login = catchAsync(async (req, res) => {
	const { email = "", username = "", password } = await pick(req.body, ["email", "username", "password"]);
	let user = null;
	if (email) {
		user = await userServices.isEmailTaken(email);
	} else if (username) {
		user = await userServices.isUsernameTaken(username);
	}
	if (user) {
		if(!user?.password){
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Please update your password, use the forgotten password button");
			return
		}
		let checkPasswordMatch = await userServices.isPasswordMatch(password, user)
		if (checkPasswordMatch) {
			const tokens = await tokenServices.generateAuthTokens(user);
			sendResponse(res, httpStatus.OK, { user, tokens }, null);
			return
		} else {
			sendResponse(res, httpStatus.UNAUTHORIZED, "Incorrect Password", null);
			return
		}
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "User not found, please signup to login.");
		return
	}
});

const getCurrentUser = catchAsync(async (req, res) => {
	const user = req.user;
	if (user) {
		sendResponse(res, httpStatus.OK, user, null)
		return
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Something wen wrong!");
		return
	}
	// const userRes = await userServices.getCurrentUser(token);
	// if (userRes && userRes?.user) {
	//     sendResponse(res, httpStatus.OK, userRes?.user, null)
	//     return
	// } else if (userRes && userRes?.code == 401) {
	//     sendResponse(res, httpStatus.UNAUTHORIZED, null, userRes?.msg);
	//     return
	// } else if (userRes && userRes?.code == 500) {
	//     sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, userRes?.msg);
	//     return
	// } else {
	//     sendResponse(res, httpStatus.BAD_REQUEST, null, "Something wen wrong!");
	//     return
	// }
});

const updateMyAccount = catchAsync(async (req, res) => {
	let userbody = req.body;
	let user = req.user;

	if (user) {
		let addResponse = await userServices.updateMyAccount({
			userId: user?.id,
			userbody,
		});
		if (addResponse.status) {
			return sendResponse(res, httpStatus.OK, addResponse.data, null);
		}
	} else {
		return sendResponse(
			res,
			httpStatus.BAD_REQUEST,
			null,
			addResponse?.msg
		);
	}
});


const admingetUsers = catchAsync(async (req, res) => {
	const { page, limit, filter, sort,hidelimit } = req.query;

	let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
	let result = await userServices.admingetUsersServices(page, limit, filter_Json_data, sort);
	if (result.status) {
		sendResponse(res, httpStatus.OK, {
			data: result?.data,
			totalResults: result?.totalResults,
			totalPages: result?.totalPages,
			page: result?.page,
			limit: result?.limit
		}, null);
	} else {
		if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	}
});

const admingetAllUsers = catchAsync(async (req, res) => {
	const { searchUser="" } = await pick(req?.query, ['searchUser'])

    let fetchResult = await userServices.admingetAllUsersServices(searchUser);
    if (fetchResult.status) {
        sendResponse(res, httpStatus.OK, fetchResult?.data, null);
    } else {
		sendResponse(res,
			fetchResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: fetchResult?.code == 404 ? httpStatus.NOT_FOUND : httpStatus.BAD_REQUEST,
			null,
			fetchResult?.data
		);
    }
});

const adminGetUserById = catchAsync(async (req, res) => {
	const { id="" } = await pick(req?.params, ['id'])

    let fetchResult = await userServices.adminGetUserById(id);
    if (fetchResult.status) {
        sendResponse(res, httpStatus.OK, fetchResult?.data, null);
    } else {
		sendResponse(res,
			fetchResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: fetchResult?.code == 404 ? httpStatus.NOT_FOUND : httpStatus.BAD_REQUEST,
			null,
			fetchResult?.data
		);
    }
});


const resetPassword = catchAsync(async (req, res) => {

	const { newPassword, token } = await pick(req.body, ["newPassword", "token"]);


	try {

		if (token) {
			const updateResult = await userServices.resetPassword(newPassword, token);

			if (updateResult.status) {
				sendResponse(res, httpStatus.OK, { message: 'Password reset successfully' }, null);
			} else if (updateResult.code === 400) {
				sendResponse(res, httpStatus.BAD_REQUEST, { message: 'Reset Password link expired or invalid !! ' }, "Reset Password link expired or invalid !!");

			} else {
				sendResponse(res, httpStatus.BAD_REQUEST, null, 'Password reset failed');
			}
		} else {
			sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Invalid or expired reset password token');
		}
	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error.message);
	}
});

const generateResetPasswordToken = catchAsync(async (req, res) => {
	const { email } = await pick(req.body, ["email"]);

	try {
		const resetPasswordToken = await userServices.generateResetPasswordToken(email);

		if (resetPasswordToken) {
			resetPasswordMail({ to: email, emailBody: resetPasswordToken.resetPasswordToken })
			sendResponse(res, httpStatus.OK, resetPasswordToken, null);

		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, 'User not found or Failed to generate reset password token');
		}
	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error.message);
	}
});

const verifyToken = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ["id"]);
	try {
		const result = await userServices.verifyToken(id);
		if (result.status) {
			sendResponse(res, httpStatus.OK, null, 'Email verified !!');
		}else if(result.code === 400){
			sendResponse( res, httpStatus.BAD_REQUEST, null,'Reset Password link expired !!' );
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, 'Failed to generate reset password token');
		}

	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred: ' + error);
	}

})

const adminAddEmployee = catchAsync(async (req, res) => {
	
    const {
		fName,
		lName,
       email,
       isEmailVerified,
       password,
       role
    } = await pick(req.body,
        [
       "fName",
       "lName",
       "email",
       "isEmailVerified",
       "password",
       "role"]);

	   let duplicateEmail = await userServices.isEmailTaken(email);
	   console.log("duplicateEmail",duplicateEmail);
	   if (duplicateEmail) {
		   sendResponse(res, httpStatus.BAD_REQUEST, null, `This email already registered with us, please use different email.`);
		   return
	   }



    const insertResult = await userServices.adminAddEmployee({
        fName,
        lName,
        email,
        isEmailVerified,
        password,
        role
    });

	
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if (insertResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if (insertResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
    }
});

const adminDeleteUser = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id'])
    const removed = await userServices.adminDeleteUser(id)
    if (removed.status) {
        sendResponse(res, httpStatus.OK, removed?.data, null);
    } else {
        if (removed.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, removed.data);
        }
        else if (removed.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, removed.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, removed.data);
        }
    }
})

const adminExportUserEmail = catchAsync(async (req, res) => {
	const { page, limit } = req.query;

	let result = await userServices.adminExportUserEmail(page, limit);
	if (result.status) {
		sendResponse(res, httpStatus.OK, {
			data: result?.data,
			totalResults: result?.totalResults,
			totalPages: result?.totalPages,
			page: result?.page,
			limit: result?.limit
		}, null);
	} else {
		if (result?.code === 400) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
		} else if (result?.code === 500) {
			sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
		} else {
			sendResponse(res, httpStatus.BAD_REQUEST, null, result);
		}
	}
});

module.exports = {
	signupUser,
	login,
	getCurrentUser,
	updateMyAccount,
	admingetUsers,
	resetPassword,
	generateResetPasswordToken,
	verifyToken,
	newUser,
	importUsers,
	adminAddEmployee,
	adminDeleteUser,
	admingetAllUsers,
	adminExportUserEmail,
	adminGetUserById

}