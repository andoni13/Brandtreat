var express = require('express');
var multer  = require('multer');
var Profile = require('../../schemas/Profile');
var User = require('../../schemas/User');
var verify = require('../verify');
var _ = require('lodash');

var profilesRouter = module.exports = express.Router();

profilesRouter.use(verify.isSuperAdmin);

profilesRouter.route('/').get(function(req, res) {
	Profile.find({}).populate({path:'users', populate:{path:'profile'}}).exec(function (err, profiles) {
		if (err || !profiles) {
			res.statusCode = 401;
			res.statusMessage = "Authentication error";
			return res.end();
		}
		User.find({profile: {$in: profiles}}).populate('company').exec(function (err, users) {
			if (err) {
				return res.status(400).json({message: err});
			}
			// Clears password
			users.map(function (user, index) {
				user.password = '';
			});
			var fetchedProfiles = [];
			profiles.forEach(function (profile) {
				var mergedProfile = Object.assign({}, profile._doc, {users: []});
				users.forEach(function (user) {
					if (String(user.profile) == String(profile._id)) {
						mergedProfile.users.push(user);
					}
				});
				fetchedProfiles.push(mergedProfile);
			});
			return res.status(200).send({
				profiles: fetchedProfiles
			});
		})
	});
}).post(function (req, res, next) {
	req.body.type = req.body.type.toLowerCase()
	Profile.findOne({type: req.body.type}, function(err, profile) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (profile) {
			return res.status(400).json({message: 'A profile with the same type already exists'});
		} 
		// Create a profile
		Profile.create(req.body, function (err, profile) {
			if (err) {
				return res.status(400).json({message: 'Could not create a profile'});
			}
			return res.status(201).json(profile);
		});
	});
}).delete(function (req, res, next) {
	Profile.find({_id: { $in: req.body}}, function (err, profiles) {
		if (err) {
			return res.status(400).json({message: 'There was an error validating the profiles'});
		}
		User.find({profile: { $in: profiles}}, function (err, users) {
			if (err) {
				return res.status(400).json({message: 'There was an error validating the users'});
			}
			if (users.length == 0) {
				var filteredIds = profiles.map(function (profile) {
					return profile._id
				});
				Profile.remove({_id: { $in: filteredIds}}, function (err) {
					if (err) {
						return res.status(400).json({message: 'There was an error deleting the profiles'});
					}
					return res.status(200).json({profiles: filteredIds, message: 'The profiles were deleted.'});
				});
			} else {
				return res.status(400).json({message: 'Can not delete a profile that users use.'});
			}
		});
	})
});


profilesRouter.route('/:profileId').get(function (req, res, next) {
	Profile.findById(req.params.profileId).exec(function (err, profile) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a profile'});
		}
		User.find({profile: profile._id}).populate('company').exec(function (err, users) {
			if (err) {
				return res.status(400).json({message: err});
			}
			// Clears password
			users.map(function (user, index) {
				user.password = '';
			});
			var mergedProfile = Object.assign({}, profile._doc, {users: []});
			users.forEach(function (user) {
				if (String(user.profile) == String(profile._id)) {
					mergedProfile.users.push(user);
				}
			});

			return res.status(200).json({
				profiles: [mergedProfile]
			});
		})
	});
}).put(function (req, res, next) {
	// Checks if there is another Profile with the same type.
	Profile.findOne({_id: {$ne: req.body._id}, type: req.body.type}, function(err, profile) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (profile) {
			return res.status(400).json({message: 'A profile with the same type already exists'});
		}
		// Updates the profile
		Profile.update({_id: req.body._id}, {
			$set: req.body
		}, {
			new: true
		}, function (err, raw) {
			if (err) {
				return res.status(400).json({message: 'There was an error updating the profile'});
			}
			return res.status(200).json({message: 'Profile updated'});
		});
	});
}).delete(function (req, res, next) {
	Profile.findById(req.params.profileId).exec(function (err, profile) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a profile for delete'});
		}
		if (profile) {
			User.find({profile: profile._id}).exec(function (err, users) {
				if (err) {
					return res.status(400).json({message: err});
				}
				if (users.length == 0) {
					profile.remove(function (err, removedProfile) {
						if (err) {
							return res.status(400).json({message: 'There was an error deleting a profile'});
						}
						return res.status(200).json({profile: removedProfile});
					});
				} else {
					return res.status(400).json({message: 'Can not delete a profile that users use.'});
				}
			});
		} else {
			return res.status(400).json({message: 'Could not find a profile with that id'});
		}
	});
});
