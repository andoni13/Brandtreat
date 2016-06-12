var mongoose = require('mongoose');
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// mongoose.models = {};
// mongoose.modelSchemas = {};
var Schema = mongoose.Schema;

// Plan schema
var PlanSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: [String],
		required: true
	},
	fee: {
		type: {
			type: String,
			required: true
		},
		value: {
			type: Currency,
			required: true
		}
	},
	permissions: {
		type: [Schema.Types.Mixed]
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);