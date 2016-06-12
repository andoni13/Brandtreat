var utils = require('../utils');
var should = require('chai').should();
var User = require('../../server/schemas/User');
var Company = require('../../server/schemas/Company');
var Plan = require('../../server/schemas/Plan');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

new Plan({
	name: 'New Free plan',
	description: ['Is free', 'No charge'],
	value: '$40.55'
}).save(function (err, createdPlan) {
	should.not.exist(err);
	describe('Companies: models', function () {
		describe('#create()', function () {
			it('should create a new Company', function (done) {
				new Company({
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
					// verify that the returned company is what we expect
					createdCompany.name.should.equal('New Brandtreat Company');
					createdCompany.vat.should.equal('1714333968001');
					createdCompany.logo.should.equal('http://www.brandcrowd.com/gallery/brands/pictures/picture13488076527060.jpg');
					createdCompany.address.should.equal('Brandtreat street address');
					createdCompany.phones.length.should.equal(3);
					createdCompany.phones[0].should.equal('0987654321');
					createdCompany.phones[1].should.equal('042123456');
					createdCompany.phones[2].should.equal('022123456');
					createdCompany.freeService.should.not.be.true;
					createdCompany.canLogin.should.be.true;
					createdCompany.users.length.should.equal(0);
					createdCompany.brands.length.should.equal(0);
					createdCompany.plan.name.should.equal('New Free plan');
					createdCompany.plan.description[0].should.equal('Is free');
					createdCompany.plan.description[1].should.equal('No charge');
					createdCompany.plan.value.should.equal(4055);
					// Call done to tell mocha that we are done with this test
					createdCompany.remove();
					done();
				});
			});
		});

		describe('#delete()', function () {
			it('should delete a new Company', function (done) {
				new Company({
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
					Company.findByIdAndRemove(createdCompany._id, function (err, deletedCompany) {
						// Remove created plan
						createdPlan.remove();
						deletedCompany._id.should.equal(deletedCompany._id)
						done();
					})
				});
			});
		});
	});
});