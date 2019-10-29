'use strict'

const path = require('path')
const resolve = url =>path.resolve(__dirname, url)
module.exports = {
	dev: {
		entry: {
			lrslide:resolve('./../src/example/lrslide.ts'),
			tbslide:resolve('./../src/example/tbslide.ts'),
			fadein:resolve('./../src/example/fadein.ts'),
		},
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './../dist'),
		contentBase: path.join(__dirname, "./../dist"),
		port: 9900,
		proxyTable: {
			'/api': {
				target: '127.0.0.1:7001',
				ws: true,
				changeOrigin: true
			},
		},
		host: 'localhost', // can be overwritten by process.env.HOST
	},
	build: {
		entry: path.resolve(__dirname, './../src/main.js'),
		filename: 'static/js/bundle.js',
		path: path.resolve(__dirname, './../dist'),
		publicPath: "./"
	},
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
				}
			},
		]
	}
}
