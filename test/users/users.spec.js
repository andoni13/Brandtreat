var utils = require('../utils');
var should = require('chai').should();
var Company = require('../../server/schemas/Company');
var Plan = require('../../server/schemas/Plan');
var Profile = require('../../server/schemas/Profile');
var User = require('../../server/schemas/User');

describe('Users: models', function () {
	describe('#create()', function () {
		this.timeout(15000);
		it('should create a new User with an "admin" profile', function (done) {
			new Profile({
				type: 'admin',
				isSuperAdmin: false
			}).save(function (err, createdProfile) {
				// Confirm that that an error does not exist
				should.not.exist(err);
				new User({
					name: 'Test',
					email: 'test@test.com1',
					username: 'testusername',
					password: 'TestPassword',
					profile: createdProfile
				}).save(function (err, createdUser) {
					// Confirm that that an error does not exist
					should.not.exist(err);
					// verify that the returned user is what we expect
					createdUser.name.should.equal('Test');
					createdUser.email.should.equal('test@test.com1');
					createdUser.username.should.equal('testusername');
					createdUser.shouldChangePassword.should.not.be.true;
					createdUser.profile.type.should.equal('admin');
					createdUser.profile.isSuperAdmin.should.not.be.true;
					createdUser.comparePassword('TestPassword', function (err, isMatch) {
						if (err) {
							throw err;
						}
						isMatch.should.be.true;
					});
					createdUser.comparePassword('TestPasswords', function (err, isMatch) {
						if (err) {
							throw err;
						}
						isMatch.should.not.be.true;
					});
					// Call done to tell mocha that we are done with this test
					createdUser.remove();
					createdProfile.remove();
					done();
				});
			});
		});

		it('should create a new User with an "admin" profile, needs to change the password and be a super admin', function (done) {
			new Profile({
				type: 'admin',
				isSuperAdmin: true
			}).save(function (err, createdProfile) {
				// Confirm that that an error does not exist
				should.not.exist(err);
				new User({
					name: 'Test',
					email: 'test@test.com2',
					username: 'testusername',
					password: 'TestPassword',
					shouldChangePassword: true,
					profile: createdProfile
				}).save(function (err, createdUser) {
					// Confirm that that an error does not exist
					should.not.exist(err);
					// verify that the returned user is what we expect
					createdUser.name.should.equal('Test');
					createdUser.email.should.equal('test@test.com2');
					createdUser.username.should.equal('testusername');
					createdUser.shouldChangePassword.should.be.true;
					createdUser.profile.type.should.equal('admin');
					createdUser.profile.isSuperAdmin.should.be.true;
					createdUser.comparePassword('TestPassword', function (err, isMatch) {
						if (err) {
							throw err;
						}
						isMatch.should.be.true;
					});
					createdUser.comparePassword('TestPasswords', function (err, isMatch) {
						if (err) {
							throw err;
						}
						isMatch.should.not.be.true;
					});
					// Call done to tell mocha that we are done with this test
					createdUser.remove();
					createdProfile.remove();
					done();
				});
			});
		});

		it('should create a new User for a new Company', function (done) {
			new Plan({
				name: 'Not a free plan',
				description: ['It is not free', 'Do charge'],
				value: '$80.55'
			}).save(function (err, createdPlan) {
				// Confirm that that an error does not exist
				should.not.exist(err);
				var company = new Company({
					name: 'New Brandtreat Company',
					vat: '1714333968001',
					logo: 'http://www.brandcrowd.com/gallery/brands/pictures/picture13488076527060.jpg',
					address: 'Brandtreat street address',
					phones: ['0987654321','042123456','022123456'],
					freeService: false,
					canLogin: true,
					plan: createdPlan
				}).save(function (err, createdCompany) {
					// Confirm that that an error does not exist
					should.not.exist(err);
					new Profile({
						type: 'admin',
						isSuperAdmin: true
					}).save(function (err, createdProfile) {
						// Confirm that that an error does not exist
						should.not.exist(err);
							new User({
							name: 'Test',
							email: 'test@test.com2',
							username: 'testusername',
							password: 'TestPassword',
							shouldChangePassword: true,
							profile: createdProfile,
							company: createdCompany
						}).save(function (err, createdUser) {
							// Confirm that that an error does not exist
							should.not.exist(err);
							// verify that the returned user is what we expect
							createdUser.name.should.equal('Test');
							createdUser.email.should.equal('test@test.com2');
							createdUser.username.should.equal('testusername');
							createdUser.shouldChangePassword.should.be.true;
							createdUser.profile.type.should.equal('admin');
							createdUser.profile.isSuperAdmin.should.be.true;
							createdUser.company.name.should.equal('New Brandtreat Company');
							createdUser.company.vat.should.equal('1714333968001');
							createdUser.company.logo.should.equal('http://www.brandcrowd.com/gallery/brands/pictures/picture13488076527060.jpg');
							createdUser.company.address.should.equal('Brandtreat street address');
							createdUser.company.phones.length.should.equal(3);
							createdUser.company.phones[0].should.equal('0987654321');
							createdUser.company.phones[1].should.equal('042123456');
							createdUser.company.phones[2].should.equal('022123456');
							createdUser.company.freeService.should.not.be.true;
							createdUser.company.canLogin.should.be.true;
							createdUser.company.users.length.should.equal(0);
							createdUser.company.brands.length.should.equal(0);
							createdUser.company.plan.name.should.equal('Not a free plan');
							createdUser.company.plan.description[0].should.equal('It is not free');
							createdUser.company.plan.description[1].should.equal('Do charge');
							createdUser.company.plan.value.should.equal(8055);
							createdUser.comparePassword('TestPassword', function (err, isMatch) {
								if (err) {
									throw err;
								}
								isMatch.should.be.true;
							});
							createdUser.comparePassword('TestPasswords', function (err, isMatch) {
								if (err) {
									throw err;
								}
								isMatch.should.not.be.true;
							});
							// Call done to tell mocha that we are done with this test
							createdUser.remove();
							createdProfile.remove();
							createdPlan.remove();
							createdCompany.remove();
							done();
						});
					});
				});
			});
		});
	});
});