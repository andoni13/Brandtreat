var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Profile schema
var ProfileSchema = new Schema({
	type: {
		type: String,
		required: true,
		unique: true
	},
	isSuperAdmin: {
		type: Boolean,
		default: false
	},
	isMobileUser: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);