import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import WebpackProgressBarPlugin from 'progress-bar-webpack-plugin';
import webpack from 'webpack';

const isProd = process.env.NODE_ENV.trim() === 'production';

export default {
	entry: {
		app: ['babel-polyfill', resolve(__dirname, '../', 'src', 'app', 'client.jsx')],
		vendor: ['react'],
	},
	target: 'electron-renderer',
	output: {
		filename: 'src/js/[name].bundle.[hash].js',
		path: resolve(__dirname, '../', 'app'),
		publicPath: isProd ? '' : '/',
		libraryTarget: 'commonjs2',
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'env', 'stage-2'],
					plugins: ['react-html-attrs', 'transform-decorators-legacy'],
				},
			},
			{
				test: /\.json?$/,
				loader: 'json-loader',
			},
			{
				test: /\.sass?$/,
				loader: 'style-loader!css-loader!sass-loader',
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				loader: 'url-loader',
				options: {
					name: './src/images/[name]-[hash].[ext]',
					limit: 100000,
				},
			},
			{
				test: /\.(woff|otf|woff2|ttf|eot|svg)$/,
				loader: 'url-loader',
				options: {
					name: './src/fonts/[name]-[hash].[ext]',
					limit: 100000,
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.sass', '.jpg', '.otf'],
		modules: [
			resolve(__dirname, '../', 'src'),
			resolve(__dirname, '../', 'lib'),
			resolve(__dirname, '../', 'node_modules'),
		],
	},
	plugins: [
		new WebpackProgressBarPlugin(),
		new HtmlWebpackPlugin({
			template: resolve(__dirname, '../', 'public', 'index.html'),
			filename: 'index.html',
		}),
		new CopyWebpackPlugin([
			{
				from: resolve(__dirname, '../', 'public', 'main.js'),
				to: resolve(__dirname, '../', 'app'),
			},
		]),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV.trim()),
			},
		}),
	],
};
