const { contactUsSendMail } = require("../../../utils/emailservice");
const CONTACT_US_MODEL = require("../contactUserInfo.model");

const addContactusUserInfo = async (data) => {
	try {
		if (data) {
			const addResult = await CONTACT_US_MODEL.create({ ...data });
			if (addResult) {
				contactUsSendMail(data);
				return { data: addResult, status: true, code: 200 };
			} else {
				return { data: "Can not details", status: false, code: 400 };
			}
		}
	} catch (error) {
		console.log("Error while getting data:", error);
		return { status: false, code: 500, msg: error };
	}
};

module.exports = addContactusUserInfo;
