var jwtMiddleware = require('express-jwt')
var config = require('../../config/config')

exports.isSuperAdmin = function (req, res, next) {
	if (req.user.profile.isSuperAdmin) {
		next();
	} else {
		res.statusCode = 404;
		res.statusMessage = "Not Found";
		return res.end();
	}
};

exports.jwtCheck = jwtMiddleware({
	secret: config.secret,
	getToken: function fromHeader (req) {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.query && req.query.token) {
			return req.query.token;
		}
		return null;
	}
});

exports.unauthorizer = function (err, req, res, next) {
	if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
		return res.status(401).json(err.inner);
	}
};