var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Category schema
var CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	parent: {
		type: Schema.ObjectId,
		ref: 'Category'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);