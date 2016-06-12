const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const env = require('dotenv').config()

module.exports = {
	devtool: env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
		'./app/index'
	],
	output: {
		path : path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	    publicPath: '/static/'
	},
	module: {
		loaders: [
			{
				test: /.js$/, // Transform all .js files required somewhere within an entry point...
				exclude: /node_modules/,
				loaders: [
					'react-hot',
					'babel-loader?presets[]=es2015&presets[]=react'
				]
			}, {
				test:   /\.css$/, // Transform all .css files required somewhere within an entry point...
				loaders: [ // ...with PostCSS
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			}, {
				test:   /\.sass$/, // Transform all .css files required somewhere within an entry point...
				loaders: [ // ...with PostCSS
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './app')
				]
			},  {
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&mimetype=application/font-woff"
			}, {
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			}, {
				test: /\.jpe?g$|\.gif$|\.png$/i,
				loader: "url-loader?limit=10000"
			}
		]
	},
	node: {
		net: 'empty',
		dns: 'empty'
	},
	plugins: [
		new ExtractTextPlugin('[name].css'),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'__DEV__': true,
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		})
		// For production use this
		// ,
		// new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	minimize: true,
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	],
	postcss: [
		autoprefixer({
			browsers: ['last 2 versions']
		})
	],
	resolve: {
		extensions: ['', '.js', '.sass'],
		modulesDirectories: ['app', 'node_modules']
	}
};