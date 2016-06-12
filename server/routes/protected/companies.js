var express = require('express');
var multer  = require('multer');
var Company = require('../../schemas/Company');
var verify = require('../verify');
var _ = require('lodash');

var companiesRouter = module.exports = express.Router();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/img/companies');
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

var upload = multer({ storage: storage }).single('logo');

companiesRouter.use(verify.isSuperAdmin);

companiesRouter.route('/').get(function(req, res) {
	Company.find({}).populate('plan').populate({path:'users', populate:{path:'profile'}}).exec(function (err, companies) {
		if (err || !companies) {
			res.statusCode = 401;
			res.statusMessage = "Authentication error";
			return res.end();
		}
		companies.forEach(function (company) {
			company.users.map(function (user) {
				user.password = '';
			});
		});
		res.status(200).send({
			companies: companies
		});
	});
}).post(function (req, res, next) {
	upload(req, res, function (err) {
		if (err) {
			return res.status(400).json({message: 'The logo could not be uploaded'});
		}
		req.body = JSON.parse(req.body.company);
		req.body.logo = req.file ? `/img/companies${req.file.filename}` : req.body.logo;
		req.body.phones = req.body.phones && req.body.phones.indexOf(' ') > 0 ? req.body.phones.split(' ') : req.body.phones;

		Company.findOne({name: req.body.name}, function(err, company) {
			if (err) {
				return res.status(400).json({message: err});
			}
			if (company) {
				return res.status(400).json({message: 'A company with the same name already exists'});
			} 
			// Create a company
			Company.create(req.body, function (err, company) {
				if (err) {
					return res.status(400).json({message: 'Could not create a company'});
				}
				return res.status(201).json(company);
			});
		});
	});
}).delete(function (req, res, next) {
	Company.find({_id: { $in: req.body}}, function (err, companies) {
		if (err) {
			return res.status(400).json({message: 'There was an error validating the companies'});
		}
		var filteredIds = companies.filter(function (company) {
			return company.users.length == 0
		}).map(function (company) {
			return company._id
		});
		if (filteredIds.length > 0) {
			Company.remove({_id: { $in: filteredIds}}, function (err) {
				if (err) {
					return res.status(400).json({message: 'There was an error deleting the companies'});
				}
				return res.status(200).json({companies: filteredIds, message: 'The companies were deleted.'});
			})
		} else {
			return res.status(400).json({message: 'No companies were deleted.'});
		}
	})
});


companiesRouter.route('/:companyId').get(function (req, res, next) {
	Company.findById(req.params.companyId).populate('plan users').exec(function (err, company) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a company'});
		}
		var users = [];
		company.users.forEach(function (user) {
			users.push({
				_id: user._id,
				name: user.name
			});
		});
		return res.status(200).json({companies: [company]});
	});
}).put(function (req, res, next) {
	upload(req, res, function (err) {
		if (err) {
			return res.status(400).json({message: 'There was an error updating the company'});
		}
		req.body = JSON.parse(req.body.company);
		req.body.logo = req.file ? `/img/companies${req.file.filename}` : req.body.logo;
		req.body.phones = req.body.phones && req.body.phones.indexOf(' ') > 0 ? req.body.phones.split(' ') : req.body.phones;

		// Checks if there is another Company with the same name.
		Company.findOne({_id: {$ne: req.body._id}, name: req.body.name}, function(err, company) {
			if (err) {
				return res.status(400).json({message: err});
			}
			if (company) {
				return res.status(400).json({message: 'A company with the same name already exists'});
			}
			// Updates the company
			Company.update({_id: req.body._id}, {
				$set: req.body
			}, {
				new: true
			}, function (err, raw) {
				if (err) {
					return res.status(400).json({message: 'There was an error updating the company'});
				}
				return res.status(200).json({message: 'Company updated'});
			});
		});
	});
}).delete(function (req, res, next) {
	Company.findById(req.params.companyId).populate('users').exec(function (err, company) {
		if (err) {
			return res.status(400).json({message: 'There was an error fetching a company for delete'});
		}
		if (company) {
			if (company.users.length == 0) {
				company.remove(function (err, removedCompany) {
					if (err) {
						return res.status(400).json({message: 'There was an error deleting a company'});
					}
					if (removedCompany) {
						return res.status(200).json({company: removedCompany});
					}
				})
			} else {
				return res.status(400).json({message: 'This company has users associated with'});
			}
		} else {
			return res.status(400).json({message: 'Could not find a company with that id'});
		}
	})
});
