var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// RewardType schema
var RewardTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('RewardType', RewardTypeSchema);