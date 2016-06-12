/*eslint-env node*/
// Back
require('./server/schemas')
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var express = require('express');
var errorhandler = require('errorhandler');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


// Routers
var protectedRouter = require('./server/routes/protected')

// Front
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');

// Load enviroment
dotenv.load();

// Connect to DB
mongoose.connect(config.db[appEnv.NODE_ENV || process.env.NODE_ENV || 'development']);

var app = exports.app = new express();

// CORS white list
var port = appEnv.port || process.env.PORT || 3000;
var whiteList = ['http://localhost:' + port, 'http://localhost:8100',
	'http://www.brandtreat.com',
	'http://brandtreat.mybluemix.net:' + port,
	'https://brandtreat.mybluemix.net:' + port,
	'http://brandtreat.mybluemix.net',
	'https://brandtreat.mybluemix.net'];

var compiler = webpack(webpackConfig)


// Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
	origin: function(origin, callback) {
		var originIsWhiteListed = whiteList.indexOf(origin) !== -1;
		callback(null, originIsWhiteListed);
	},
	credentials: true
}));

app.use(function(err, req, res, next) {
	if (err.name === 'StatusError') {
		res.send(err.status, err.message);
	} else {
		next(err);
	}
});

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
	app.use(logger('dev'));
	app.use(errorhandler())
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/protected', protectedRouter);
app.use(require('./server/routes/user'));

// Front
app.use(webpackDevMiddleware(compiler, {
	hot: true,
	noInfo: true,
	filename: webpackConfig.output.filename,
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true
	},
	historyApiFallback: true
}));
app.use(webpackHotMiddleware(compiler, {
	log: console.log,
	path: '/__webpack_hmr',
	heartbeat: 10 * 1000,
}));


app.get('*', function (req, res) {
	res.sendFile(__dirname + '/app/index.html')
})


// start server on the specified port and binding host
http.createServer(app).listen(port, function (error) {
	if (error) {
		console.log(error);
	} else {
		console.info('==> 🌎  Listening on port %s. Open up https://brandtreat.mybluemix.net:%s/ in your browser.', port, port);
	}
});