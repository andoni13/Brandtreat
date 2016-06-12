var express = require('express');
var Company = require('../../schemas/Company');
var Plan = require('../../schemas/Plan');
var verify = require('../verify');
var _ = require('lodash');

var plansRouter = module.exports = express.Router();

plansRouter.use(verify.isSuperAdmin);

plansRouter.route('/').get(function(req, res) {
	Plan.find({}).exec(function (err, plans) {
		if (err || !plans) {
			res.statusCode = 401;
			res.statusMessage = "Authentication error";
			return res.end();
		}
		var fetchedPlans = [];
		plans.forEach(function (plan) {
			fetchedPlans.push(Object.assign({}, plan._doc, {
				fee: Object.assign({}, plan._doc.fee, {
					value: (plan.fee.value / 100).toFixed(2)
				})
			}));
		});
		res.status(200).send({
			plans: fetchedPlans
		});
	});
}).post(function (req, res, next) {
	if (_.isString(req.body.description)) {
		req.body.description = req.body.description.split(',');
	}
	Plan.findOne({name: req.body.name}, function(err, plan) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (plan) {
			return res.status(400).json({message: 'A plan with the same name already exists'});
		} 
		// Create a plan
		Plan.create(req.body, function (err, plan) {
			if (err) {
				return res.status(400).json({message: 'Could not create a plan'});
			}
			return res.status(201).json(plan);
		});
	});
}).delete(function (req, res, next) {
	Plan.find({_id: { $in: req.body}}, function (err, plans) {
		if (err) {
			return res.status(400).json({message: 'There was an error validating the plans'});
		}
		Company.find({plan: { $in: plans}}, function (err, companies) {
			if (err) {
				return res.status(400).json({message: 'There was an error validating the companies'});
			}
			if (companies.length == 0) {
				var filteredIds = plans.map(function (plan) {
					return plan._id
				});
				Plan.remove({_id: { $in: filteredIds}}, function (err) {
					if (err) {
						return res.status(400).json({message: 'There was an error deleting the plans'});
					}
					return res.status(200).json({plans: filteredIds, message: 'The plans were deleted.'});
				});
			} else {
				return res.status(400).json({message: 'Can not delete a plan that companies use.'});
			}
		});
	})
});

plansRouter.route('/:planId').get(function (req, res, next) {
	Plan.findById(req.params.planId).exec(function (err, plan) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a plan'});
		}
		var fetchedPlan = Object.assign({}, plan._doc, {
			fee: {
				value: (plan.fee.value / 100).toFixed(2),
				type: plan.fee.type
			}
		});
		return res.status(200).json({plans: [fetchedPlan]});
	});
}).put(function (req, res, next) {
	if (_.isString(req.body.description)) {
		req.body.description = req.body.description.split(',');
	}
	// Checks if there is another Plan with the same name.
	Plan.findOne({_id: {$ne: req.body._id}, name: req.body.name}, function(err, plan) {
		if (err) {
			return res.status(400).json({message: err});
		}
		if (plan) {
			return res.status(400).json({message: 'A plan with the same name already exists'});
		}
		// Updates the plan
		Plan.update({_id: req.body._id}, {
			$set: req.body
		}, {
			new: true
		}, function (err, raw) {
			if (err) {
				return res.status(400).json({message: 'There was an error updating the plan'});
			}
			return res.status(200).json({message: 'Plan updated'});
		});
	});
}).delete(function (req, res, next) {
	Plan.findById(req.params.planId).exec(function (err, plan) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a plan for delete'});
		}
		if (plan) {
			Company.find({plan: plan._id}).exec(function (err, companies) {
				if (err) {
					return res.status(400).json({message: err});
				}
				if (companies.length == 0) {
					plan.remove(function (err, removedPlan) {
						if (err) {
							return res.status(400).json({message: 'There was an error deleting a plan'});
						}
						return res.status(200).json({plan: removedPlan});
					});
				} else {
					return res.status(400).json({message: 'Can not delete a plan that companies use.'});
				}
			});
		} else {
			return res.status(400).json({message: 'Could not find a plan with that id'});
		}
	});
});
