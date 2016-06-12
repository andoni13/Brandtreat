var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ChallengeType schema
var ChallengeTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	instructions: {
		type: [String]
	},
	category: {
		name: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			required: true
		}
	},
	points: {
		type: Number,
		default: 0
	},
	hasWinner: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true,
	discriminatorKey: 'kind'
});

module.exports = mongoose.model('ChallengeType', ChallengeTypeSchema);