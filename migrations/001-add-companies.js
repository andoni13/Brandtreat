var Plan = require('../server/schemas/Plan');
var Company = require('../server/schemas/Company');
var mongoose = require('mongoose');
var config = require('../config/config');

var host = process.env.NODE_ENV ? config.db[process.env.NODE_ENV] : config.db.test;

function up(next) {
	Plan.findOne({name: 'Free Plan'}, function (err, plan) {
		if (err) {
			throw err;
		}
		new Company({
			name: 'Brandtreat Company',
			vat: '123123123001',
			logo: 'http://brandtreat.dispatchads.com/img/logo.png',
			address: 'Av. Carlos Julio Arosemena, Km2.5 Bodegas Equidor',
			phones: ['5050261'],
			freeService: true,
			canLogin: true,
			plan: plan
		}).save(function (err, createdCompany) {
			if (err) {
				throw err;
			}
			next();
		});
	});
}

function down(next) {
	Company.remove({ name: 'Brandtreat Company', vat: '123123123001' }, function (err) {
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