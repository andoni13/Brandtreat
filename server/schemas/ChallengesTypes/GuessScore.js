var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChallengeTypeSchema = require('./ChallengeType');

// GuessScoreChallenge schema
var GuessScoreChallengeSchema = new Schema({
	matches: [{
		teamA: {
			name: {
				type: String
			},
			logo: {
				type: String
			},
			score: {
				type: Number
			}
		},
		teamB: {
			name: {
				type: String
			},
			logo: {
				type: String
			},
			score: {
				type: Number
			}
		},
		startGuess: {
			type: Date
		},
		endGuess: {
			type: Date
		},
		startMatch: {
			type: Date
		},
		endMatch: {
			type: Date
		},
		matchPoints: {
			type: Number,
			default: 1
		},
		resultPoints: {
			type: Number,
			default: 2
		}
	}]
}, {
	timestamps: true,
	discriminatorKey: 'kind'
});

module.exports = ChallengeTypeSchema.discriminator('GuessScoreChallenge', GuessScoreChallengeSchema);