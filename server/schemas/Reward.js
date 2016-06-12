var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Reward schema
var RewardSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: Schema.ObjectId,
		ref: 'RewardCategory'
	},
	type: {
		type: Schema.ObjectId,
		ref: 'RewardType'
	},
	winner: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Reward', RewardSchema);