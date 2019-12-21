const path = require('path');

const config = {
	entry: {
		vivi: './src/index.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	output: {
		filename: 'vivi.js',
		library: 'vivi',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	mode: 'production',
	resolve: {
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
		extensions: ['.ts', '.js', '.json']
	}
};

module.exports = [config];
