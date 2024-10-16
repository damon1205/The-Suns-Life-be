const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
const { roles } = require('../../config/roles');


const userSchema = mongoose.Schema(
	{
		fName: {
			type: String,
			trim: true,
			default: '',
		},
		lName: {
			type: String,
			trim: true,
			default: '',
		},
		userTitle: {
			type: String,
			trim: true,
			default: '',
		},
		phoneNo: {
			type: Number,
			trim: true,
			default: '',
		},
		username: {
			type: String,
			trim: true,
			required: false,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		password: {
			type: String,
			required: false,
			trim: true,
			minlength: 8,
			validate(value) {
				if (!value.match(/(?=.*[0-9])/)) {
					throw new Error('Password must contain at least one digit.');
				}
				if (!value.match(/(?=.*[a-z])/)) {
					throw new Error('Password must contain at least one lowercase letter.');
				}
				/* if (!value.match(/(?=.*[A-Z])/)) {
					throw new Error('Password must contain at one uppercase letter.');
				} */
				if (!value.match(/(?=.*[@#$%^&-+=()])/)) {
					throw new Error('Password must contain at least one special character.');
				}
				if (value.match(/(?=\s+)/)) {
					throw new Error('Password must not contain empty spaces.');
				}
				if (!value.match(/.{8,20}/)) {
					throw new Error('Password must be 8 to 20 character long.');
				}
			},
			private: true, // used by the toJSON plugin
		},
		role: {
			type: String,
			enum: roles,
			required: true,
			default: 'user',
			enum: ['user', 'admin','employee'],
		},
		country: {
			type: String,
			default: '',
			trim: true,
		},
		profilePic: {
			type: String,
			default:
				'https://stardust-asset-qa.s3.ap-southeast-1.amazonaws.com/uploads/1672037958245Group-2205%402x.png',
		},
		bio: {
			type: String,
			default: '',
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		facebookId: {
			type: String,
			default: null
		  },
		gender: {
			type: Number,
			default: null,
			enum: ['male', 'female', 'others', null]
		},
		source: {
			type: String,
			default: 'web'
		},
		active: {
			type: Boolean,
			default: true,
		},
		seqId: {
			type: Number
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
  };
  userSchema.statics.isUserNameTaken = async function (username, excludeUserId) {
	const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
	return !!user;
  };
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

userSchema.pre('findOneAndUpdate', async function (next) {
	const user = this;
	if (user._update && user._update.password) {
		user._update.password = await bcrypt.hash(user._update.password, 8);
	}
	next();
});

userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	if (user.role) {
		user.seqId = await counterIncrementor('user')
	} else {
		user.seqId = await counterIncrementor(user.role)
	}
	next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
