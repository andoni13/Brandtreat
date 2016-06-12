var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChallengeTypeSchema = require('./ChallengeType');

// SocialShareChallenge schema
var SocialShareChallengeSchema = new Schema({
	message: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	image: {
		type: String
	}
}, {
	timestamps: true,
	discriminatorKey: 'kind'
});

module.exports = ChallengeTypeSchema.discriminator('SocialShareChallenge', SocialShareChallengeSchema);