var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Location schema
var LocationSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	short: {
		type: String
	},
	flag: {
		type: String
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);