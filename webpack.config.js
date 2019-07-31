const path = require('path');

module.exports = {
	entry: './src/main.js',
	devServer: {
		contentBase: './dist'
	},
	output: {
		filename: './js/main.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules:[
			{
				test: /\.css$/,
				use :[
					'style-loader',
					'css-loader'
				]
			}
		]
	}
};