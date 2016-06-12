var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChallengeTypeSchema = require('./ChallengeType');

// TriviaChallenge schema
var TriviaChallengeSchema = new Schema({
	pool: [{
		question: {
			type: String,
			required: true
		},
		answer: {
			type: String,
			required: true
		},
		posibleAnswers: [{
			type: [String],
			required: true
		}]
	}],
	timer: {
		type: Number,
		default: 0
	},
	refreshTime: {
		type: Number,
		default: 0
	},
	total: {
		type: Number,
		default: 1
	}
}, {
	timestamps: true,
	discriminatorKey: 'kind'
});

module.exports = ChallengeTypeSchema.discriminator('TriviaChallenge', TriviaChallengeSchema);