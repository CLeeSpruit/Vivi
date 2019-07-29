const path = require('path');
const TsConfigPathWebpackPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
    entry: {
		app: './src/index.ts',
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [{
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						context: __dirname,
						configFile: 'tsconfig.json'
					}
				}],
				exclude: /node_modules/,
			}
		]
	},
	output: {
		filename: '[name].js'
	},
	mode: 'production',
	resolve: {
		plugins: [
			new TsConfigPathWebpackPlugin({ configFile: path.join(__dirname, 'tsconfig.json') })
		],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
		extensions: ['.ts', '.js', '.json']
	}
};

module.exports = [ config ];