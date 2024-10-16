const objectId = (value, helpers) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message('"{{#label}}" must be a valid mongo id');
	}
	return value;
};

const password = (value, helpers) => {
	if (!value.match(/(?=.*[0-9])/)) {
		return helpers.message('Password must contain at least one digit.');
	}
	if (!value.match(/(?=.*[a-z])/)) {
		return helpers.message('Password must contain at least one lowercase letter.');
	}
	if (!value.match(/(?=.*[A-Z])/)) {
		return helpers.message('Password must contain at one uppercase letter.');
	}
	if (!value.match(/(?=.*[@#$%^&-+=()])/)) {
		return helpers.message('Password must contain at least one special character.');
	}
	if (value.match(/(?=\s+)/)) {
		return helpers.message('Password must not contain empty spaces.');
	}
	if (!value.match(/.{8,20}/)) {
		return helpers.message('Password must be 8 to 20 character long.');
	}
	return value;
};

const emailCustom = (value, helpers) => {
	const passRE = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

	if (!passRE.test(value)) {
		return helpers.message('Please Enter Valid Email.');
	}
	return value;
};

module.exports = {
	objectId,
	password,
	emailCustom,
};
