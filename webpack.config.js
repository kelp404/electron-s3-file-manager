const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
	const IS_DEVELOPMENT = (process.env.NODE_ENV || 'development') === 'development';

	return {
		target: 'web',
		mode: IS_DEVELOPMENT ? 'development' : 'production',
		entry: {
			renderer: path.join(__dirname, 'src', 'renderer-process', 'index.js'),
			'dark-theme': path.join(__dirname, 'src', 'renderer-process', 'stylesheets', 'dark-theme.scss'),
		},
		devServer: {
			host: 'localhost',
			port: '3000',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Max-Age': '3000',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Methods': 'GET',
			},
		},
		output: {
			path: path.join(__dirname, 'dist', 'renderer-process'),
			filename: IS_DEVELOPMENT ? '[name].js' : '[name].[hash:8].js',
		},
		optimization: {
			minimize: !IS_DEVELOPMENT,
			minimizer: [
				'...',
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: [
							'default',
							{discardComments: {removeAll: true}},
						],
					},
				}),
			],
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									'@babel/preset-env',
								],
							},
						},
					],
				},
				{
					test: /\.scss$/,
					use: [
						{loader: MiniCssExtractPlugin.loader},
						{loader: 'css-loader'},
						{loader: 'sass-loader'},
					],
				},
				{
					test: /\.(jpg|png|gif|eot|svg|woff|woff2|ttf)$/,
					type: 'asset/resource',
					generator: {
						filename: 'resources/[name].[hash:8][ext]',
					},
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: IS_DEVELOPMENT ? '[name].css' : '[name].[hash:8].css',
				chunkFilename: IS_DEVELOPMENT ? '[name]-[id].css' : '[name]-[id].[hash:8].css',
			}),
			new HtmlWebpackPlugin({
				chunks: ['renderer'],
				filename: 'index.html',
				template: path.join('src', 'renderer-process', 'index.html'),
				templateParameters: (compilation, assets, options) => ({
					webpack: compilation.getStats().toJson(),
					htmlWebpackPlugin: {
						files: assets,
						options,
					},
				}),
			}),
		],
	};
};
