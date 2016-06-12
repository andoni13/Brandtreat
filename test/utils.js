var config = require('../config/config');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

// Clears the database before each test.
beforeEach(function (done) {
	if (mongoose.connection.db) {
		return done();
	}
	mongoose.connect(config.db.test, done);
});


// Disconnect after all tests
after(function (done) {
	mongoose.disconnect(done);
});