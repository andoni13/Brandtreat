var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// RewardCategory schema
var RewardCategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	icon: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('RewardCategory', RewardCategorySchema);