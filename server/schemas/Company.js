var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Company schema
var CompanySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	vat: {
		type: String,
		unique: true
	},
	logo: {
		type: String,
		default: '/img/gravatar.jpg'
	},
	address: {
		type: String
	},
	phones: {
		type: [String]
	},
	freeService: {
		type: Boolean,
		default: false
	},
	canLogin: {
		type: Boolean,
		default: true
	},
	plan: {
		type: Schema.ObjectId,
		ref: 'Plan',
		required: true
	},
	brands: [{
		type: [Schema.ObjectId],
		ref: 'Brand',
	}],
	users: [{
		type: [Schema.ObjectId],
		ref: 'User',
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);