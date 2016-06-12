var config = require('../../../config/config');
var express = require('express');
var multer  = require('multer');
var User = require('../../schemas/User');
var Company = require('../../schemas/Company');
var verify = require('../verify');
var _ = require('lodash');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var usersRouter = module.exports = express.Router();

usersRouter.use(verify.isSuperAdmin);

usersRouter.route('/').get(function(req, res) {
	User.find({}).populate('profile company').exec(function (err, users) {
		if (err || !users) {
			res.statusCode = 401;
			res.statusMessage = "Authentication error";
			return res.end();
		}
		// Clears password
		users.map(function (user, index) {
			user.password = '';
		});

		res.status(200).send({
			users: users
		});
	});
}).post(function (req, res, next) {
	User.findOne({ $or: [{email: req.body.email}, {username: req.body.username}]}, function(err, user) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (user) {
			return res.status(400).json({message: 'An user with the same email or username already exists'});
		} 
		// Create an user
		User.create(req.body, function (err, user) {
			if (err) {
				return res.status(400).json({message: 'Could not create an user'});
			}
			return res.status(201).json(user);
		});
	});
}).delete(function (req, res, next) {
	User.find({_id: { $in: req.body}}, function (err, users) {
		if (err) {
			return res.status(400).json({message: 'There was an error validating the users'});
		}
		var filteredIds = users.map(function (user) {
			return user._id
		});
		if (filteredIds.length > 0) {
			User.remove({_id: { $in: filteredIds}}, function (err) {
				if (err) {
					return res.status(400).json({message: 'There was an error deleting the users'});
				}
				return res.status(200).json({users: filteredIds, message: 'The users were deleted.'});
			})
		} else {
			return res.status(400).json({message: 'No users were deleted.'});
		}
	})
});


usersRouter.route('/:userId').get(function (req, res, next) {
	User.findById(req.params.userId).populate('profile company').exec(function (err, user) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching an user'});
		}
		var fetchedUser = Object.assign({}, user._doc, {
				password: ''
			});
		return res.status(200).json({users: [fetchedUser]});
	});
}).put(function (req, res, next) {
	// Checks if there is another User with the same email.
	User.findOne({
			$and: [
				{_id: {$ne: req.body._id}},
				{ $or: [
					{email: req.body.email},
					{username: req.body.username}
				]}
			]
		}, function(err, user) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (user) {
			return res.status(400).json({message: 'An user with the same email or username already exists'});
		}
		// Updates the user
		if (req.body.password == '') {
			delete req.body.password;
			return updateUser(req.body, res);
		} else {
			bcrypt.genSalt(config.SALT_WORK_FACTOR, function (err, salt) {
				if (err) {
					return res.status(400).json({message: 'Could not generate the password'});
				}
				bcrypt.hash(req.body.password, salt, function (err, hash) {
					if (err) {
						return next(err);
					}
					req.body.password = hash;
					return updateUser(req.body, res);
				});
			});
		}
	});
}).delete(function (req, res, next) {
	User.findById(req.params.userId).populate('users').exec(function (err, user) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching an user for delete'});
		}
		if (user) {
			user.remove(function (err, removedUser) {
				if (err) {
					return res.status(400).json({message: 'There was an error deleting an user'});
				}
				if (removedUser) {
					return res.status(200).json({user: removedUser});
				}
			})
		} else {
			return res.status(400).json({message: 'Could not find an user with that id'});
		}
	})
});

function updateUser(user, res) {
	User.update({_id: user._id}, {
		$set: user
	}, {
		new: true
	}, function (err, raw) {
		if (err) {
			return res.status(400).json({message: 'There was an error updating the user'});
		}
		return res.status(200).json({message: 'User updated'});
	});
}
