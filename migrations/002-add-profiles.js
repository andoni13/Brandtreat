var Profile = require('../server/schemas/Profile');
var mongoose = require('mongoose');
var config = require('../config/config');

var host = process.env.NODE_ENV ? config.db[process.env.NODE_ENV] : config.db.test;

function up(next) {
	new Profile({
		type: 'super admin',
		isSuperAdmin: true
	}).save(function (err, createdProfile) {
		if (err) {
			throw err;
		}
		new Profile({
			type: 'user',
			isSuperAdmin: false,
			isMobileUser: true
		}).save(function (err, createdProfile) {
			if (err) {
				throw err;
			}
			next();
		});
	});
}

function down(next) {
	Profile.remove({ type: 'super admin', isSuperAdmin: true }, function (err) {
		if (err) {
			return err;
		}
		Profile.remove({ type: 'user', isSuperAdmin: false, isMobileUser: true }, function (err) {
			if (err) {
				return err;
			}
			next();
		});
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