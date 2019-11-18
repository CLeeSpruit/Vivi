const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mainConfig = {
	entry: {
		main: './src/index.ts'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true
	},
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
			},
			{
				test: /\.(scss|css)$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			}
		]
	},
	output: {
		filename: '[name].js'
	},
	mode: 'development',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Vivi Test Environment'
		})
	],
	resolve: {
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules',
		],
		extensions: ['.ts', '.js', '.json'],
		alias: {
			vivi_application: path.resolve(__dirname, 'src/')
		}
	}
};

module.exports = [mainConfig];