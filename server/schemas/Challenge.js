var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Challenge schema
var ChallengeSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	status: {
		type: String,
		default: 'New'
	},
	logo: {
		type: String,
		default: '/img/gravatar.jpg'
	},
	start: {
		type: Date,
		default: Date.now
	},
	end: {
		type: Date,
		required: true
	},
	instructions: {
		type: [String]
	},
	dificulty: {
		icon: {
			type: String,
			required: true
		},
		level: {
			type: String,
			required: true
		}
	},
	requirements: {
		type: [Schema.Types.Mixed]
	},
	category: {
		type: String	
	},
	points: {
		type: Number,
		default: 0
	},
	types: {
		type: [Schema.Types.Mixed],
		required: true
	},
	rewards: [{
		type: [Schema.ObjectId],
		ref: 'Reward',
		required: true
	}],
	limit: {
		type: Number,
		default: 0
	},
	location: {
		country: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		}
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Challenge', ChallengeSchema);