var config = require('../../config/config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// var Profile = require('./Profile');
// var Company = require('./Company');
// mongoose.models = {};
// mongoose.modelSchemas = {};
var Schema = mongoose.Schema;

// User schema
var UserSchema = new Schema({
	avatar: {
		type: String,
		default: '/img/gravatar.jpg',
		required: true
	},
	name: {
		type: String
	},
	country: {
		type: Schema.ObjectId,
		ref: 'Location'
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	shouldChangePassword: {
		type: Boolean,
		default: false
	},
	receiveNotifications: {
		type: Boolean,
		default: false
	},
	canLogin: {
		type: Boolean,
		default: true
	},
	points: {
		type: Number,
		default: 0
	},
	favorites: [{
		type: [Schema.ObjectId],
		ref: 'Brand'
	}],
	notificationsCategory: [{
		type: [Schema.ObjectId],
		ref: 'Category'
	}],
	profile: {
		type: Schema.ObjectId,
		ref: 'Profile',
		required: true
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company'
	}
}, {
	timestamps: true
});

// bcrypt middleware on User schema
UserSchema.pre('save', function (next) {
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(config.SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

// Password verification
UserSchema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);