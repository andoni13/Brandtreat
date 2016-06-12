var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Participant schema
var ParticipantSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	challenge: {
		type: Schema.ObjectId,
		ref: 'Challenge'
	},
	points: {
		type: Number
	},
	winner: {
		type: Boolean,
		default: false
	},
	challengesCompleted: [{
		challengeType: {
			type: Schema.ObjectId,
			required: true
		},
		completed: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			default: 'New'
		}
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Participant', ParticipantSchema);