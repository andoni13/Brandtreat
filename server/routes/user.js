var express = require('express');
var multer  = require('multer');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../schemas/User');
var Profile = require('../schemas/Profile');
var config = require('../../config/config');

var app = module.exports = express.Router();

function createToken(user, expiresIn) {
	expiresIn = expiresIn || 60 * 60 * 5;
	return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: expiresIn });
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/img/users');
	},
	filename: function (req, file, cb) {
		var nameArray = file.originalname.split('.');
		var extension = nameArray[nameArray.length - 1];
		var filename = file.fieldname + '-' + Date.now() + '.' + extension;
		cb(null, '/' + filename);
	},
	fileFilter: function (req, file, cb) {
		if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
			cb(null, false);
			return res.status(400).send({message: 'Supported image files are jpeg, jpg, and png'});
		}
		cb(null, true);
	}
})

var upload = multer({ storage: storage }).single('avatar');

// Register an user
app.post('/api/user/register', function(req, res) {
	upload(req, res, function (err) {
		req.body = JSON.parse(req.body.user);
		if (err) {
			return res.status(400).json({message: 'The avatar could not be uploaded'});
		}
		if (!req.body.avatar) {
			return res.status(400).json({message: 'An avatar is required'});
		}
		if (!req.body.username) {
			return res.status(400).json({message: 'An username is required'});
		}
		if (!req.body.password) {
			return res.status(400).json({message: 'A password is required'});
		}
		if (!req.body.email) {
			return res.status(400).json({message: 'An email is required'});
		}
		if (req.body.password !== req.body.confirmPassword) {
			return res.status(400).json({message: 'The passwords do not match'});
		}
		req.body.avatar = req.file ? `/img/users${req.file.filename}` : req.body.avatar;

		User.findOne({ $or: [{email: req.body.email}, {username: req.body.username}]}, function(err, user) {
			if (err) {
				return res.status(400).json({message: err});
			}
			if (user) {
				return res.status(400).json({message: 'An user with the same email or username already exists'});
			}
			Profile.findOne({type: 'user', isSuperAdmin: false, isMobileUser: true}, function(err, profile) {
				if (err) {
					return res.status(400).json({message: err});
				}
				if (!profile) {
					return res.status(400).json({message: 'Could not assign a profile'});
				}
				// Create an user
				User.create({
					profile: profile,
					username: req.body.username,
					email: req.body.email,
					password: req.body.password
				}, function (err, user) {
					if (err) {
						return res.status(400).json({message: 'Could not create an user'});
					}
					// Deletes password for response
					user.password = null;
					var userToken = {
						name: user.name,
						email: user.email,
						username: user.username,
						shouldChangePassword: user.shouldChangePassword,
						canLogin: user.canLogin,
						profile: {
							type: user.profile.type
						}
					};
					return res.status(201).send({
						user: user,
						token: createToken(userToken, user.profile.isMobileUser ? 0 : 60 * 60 * 5)
					});
				});
			});
		});
	});
});

app.post('/api/sessions/create', function(req, res) {
	var searchUser = req.body.username ? {
		username: req.body.username
	} : {
		email: req.body.email
	};

	if (!searchUser || !req.body.password) {
		res.statusCode = 400;
		res.statusMessage = "You must send the username and the password";
		return res.end();
	}
	User.findOne(searchUser).populate('profile company').exec(function (err, user) {
		if (err || !user) {
			res.statusCode = 401;
			res.statusMessage = "The username or password don't match";
			return res.end();
		}
		user.comparePassword(req.body.password, function (err, isMatch) {
			if (err || !isMatch) {
				res.statusCode = 401;
				res.statusMessage = "The username or password don't match";
				return res.end();
			}
			var company = user.company ? {
					name: user.company.name,
					logo: user.company.logo,
					freeService: user.company.freeService,
					canLogin: user.company.canLogin
				} : {};

			var userToken = {
				name: user.name,
				email: user.email,
				username: user.username,
				shouldChangePassword: user.shouldChangePassword,
				canLogin: user.canLogin,
				profile: {
					type: user.profile.type,
					isSuperAdmin: user.profile.isSuperAdmin,
					isMobileUser: user.profile.isMobileUser
				},
				company: company
			};
			if (user.profile.isMobileUser) {
				user.password = '';
				res.status(201).send({
					token: createToken(userToken, 0),
					user: user
				});	
			} else {
				res.status(201).send({
					token: createToken(userToken)
				});
			}
		});
	});
});
