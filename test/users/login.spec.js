var utils = require('../utils');
var config = require('../../config/config');
var request = require('supertest');
var should = require('chai').should();
var jwt = require('jsonwebtoken');
var app = require('../../server').app;

describe('Users: Login', function () {
	describe('#login', function() {
		it('should be able to login with username', function (done) {
			var sessionRequest = {
				username: 'admin',
				password: 'admin'
			};
			request(app)
			.post('/api/sessions/create')
			.send(sessionRequest)
			.expect(201)
			.end(function (err, res) {
				should.not.exist(err);
				jwt.verify(res.body.token, config.secret);
				done();
			});
		});

		it('should be able to login with email', function (done) {
			var sessionRequest = {
				email: 'admin@brandtreat.com',
				password: 'admin'
			};
			request(app)
			.post('/api/sessions/create')
			.send(sessionRequest)
			.expect(201)
			.end(function (err, res) {
				should.not.exist(err);
				jwt.verify(res.body.token, config.secret);
				done();
			});
		});

		it('should be able to login with username and be a super user', function (done) {
			var sessionRequest = {
				username: 'admin',
				password: 'admin'
			};
			request(app)
			.post('/api/sessions/create')
			.send(sessionRequest)
			.expect(201)
			.end(function (err, res) {
				should.not.exist(err);
				jwt.verify(res.body.token, config.secret);
				jwt.decode(res.body.token).profile.isSuperAdmin.should.equal.true;
				done();
			});
		});

		it('should not be able to login', function (done) {
			var sessionRequest = {
				username: 'admin',
				password: 'admins'
			};
			request(app)
			.post('/api/sessions/create')
			.send(sessionRequest)
			.expect(401)
			.end(function (error, response) {
				should.not.exist(error);
				response.res.statusMessage.should.equal("The username or password don't match");
				done();
			});
		});

		it('should not exist', function (done) {
			var sessionRequest = {
				username: 'administrator',
				password: 'admin'
			};
			request(app)
			.post('/api/sessions/create')
			.send(sessionRequest)
			.expect(401)
			.end(function (error, response) {
				should.not.exist(error);
				response.res.statusMessage.should.equal("The username or password don't match");
				done();
			});
		});
	});
});