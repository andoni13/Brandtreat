var utils = require('../utils');
var should = require('chai').should();
var Profile = require('../../server/schemas/Profile');

describe('Profiles: models', function () {
	describe('#create()', function () {
		it('should create a new "admin" Profile', function (done) {
			new Profile({
				type: 'admin',
				isSuperAdmin: false
			}).save(function (err, createdProfile) {
				// Confirm that that an error does not exist
				should.not.exist(err);
				// verify that the returned user is what we expect
				createdProfile.type.should.equal('admin');
				createdProfile.isSuperAdmin.should.not.be.true;
				// Call done to tell mocha that we are done with this test
				createdProfile.remove();
				done();
			});
		});

		it('should create a new "super admin" Profile', function (done) {
			new Profile({
				type: 'test super admin',
				isSuperAdmin: true
			}).save(function (err, createdProfile) {
				// Confirm that that an error does not exist
				should.not.exist(err);
				// verify that the returned user is what we expect
				createdProfile.type.should.equal('test super admin');
				createdProfile.isSuperAdmin.should.be.true;
				// Call done to tell mocha that we are done with this test
				createdProfile.remove();
				done();
			});
		});
	});
});