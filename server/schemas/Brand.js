var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Brand schema
var BrandSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	logo: {
		type: String,
		default: '/img/gravatar.jpg'
	},
	challenges: [{
		type: [Schema.ObjectId],
		ref: 'Challenge',
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Brand', BrandSchema);