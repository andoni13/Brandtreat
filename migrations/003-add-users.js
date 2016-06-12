var Company = require('../server/schemas/Company');
var Profile = require('../server/schemas/Profile');
var User = require('../server/schemas/User');
var mongoose = require('mongoose');
var config = require('../config/config');

var host = process.env.NODE_ENV ? config.db[process.env.NODE_ENV] : config.db.test;

function up(next) {
	Company.findOne({name: 'Brandtreat Company', vat: '123123123001'}, function (err, company) {
		if (err) {
			throw err;
		}
		Profile.findOne({type: 'super admin', isSuperAdmin: true}, function (err, profile) {
			if (err) {
				throw err;
			}
			new User({
				name: 'Brandtreat Admin',
				email: 'admin@brandtreat.com',
				username: 'admin',
				password: 'admin',
				shouldChangePassword: true,
				profile: profile,
				company: company
			}).save(function (err, createdUser) {
				if (err) {
					return err;
				}
				Company.update({_id: company._id}, {users: [createdUser]}, function (err, raw) {
					if (err) {
						throw err;
					}
					next();
				})
			});
		});
	});
};


function down(next) {
	User.remove({ email: 'admin@brandtreat.com', name: 'Brandtreat Admin' }, function (err) {
		if (err) {
			return err;
		}
		next();
	});
};

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