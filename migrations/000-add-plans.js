var Plan = require('../server/schemas/Plan');
var mongoose = require('mongoose');
var config = require('../config/config');

var host = process.env.NODE_ENV ? config.db[process.env.NODE_ENV] : config.db.test;

function up(next) {
	new Plan({
		name: 'Free Plan',
		description: 'Limited free plan',
		fee: {
			type: 'monthly',
			value: '$20'
		},
		permissions: []
	}).save(function (err, createdCompany) {
		if (err) {
			throw err;
		}
		next();
	});
}

function down(next) {
	Plan.remove({ name: 'Free Plan'}, function (err) {
		if (err) {
			return err;
		}
		next();
	});
}

exports.up = function (next) {
	if (mongoose.connection.readyState === 0) {
		mongoose.connect(host, function (err) {
			if (err) {
				throw err;
			}
			up(next);
		});
	} else {
		up(next);
	}
};


exports.down = function (next) {
	if (mongoose.connection.readyState === 0) {
		mongoose.connect(host, function (err) {
			if (err) {
				throw err;
			}
			down(next);
		});
	} else {
		down(next);
	}
};