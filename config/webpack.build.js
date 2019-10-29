const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
	mode: "production",
	entry: {
		index: path.resolve(__dirname, './../src/main.ts')
	},
	output: {
		filename: '[name].min.js',
		path: path.resolve(__dirname, './../dist'),
		library: "SmallSwiper",
		libraryTarget:'umd'
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
	},
	plugins: [
		new CleanWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin({
			 compilationSuccessInfo: {
				//messages: [`success dist/index.min.js`],
				notes: [`success dist/index.min.js`]
			  },
		})
	]
}
