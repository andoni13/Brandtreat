var express = require('express');
var User = require('../schemas/User');
var verify = require('./verify');
var plansRouter = require('./protected/plans');
var companiesRouter = require('./protected/companies');
var profilesRouter = require('./protected/profiles');
var usersRouter = require('./protected/users');

var app = module.exports = express.Router();

app.use('/', verify.jwtCheck, verify.unauthorizer);

app.use('/plans', plansRouter);
app.use('/companies', companiesRouter);
app.use('/profiles', profilesRouter);
app.use('/users', usersRouter);