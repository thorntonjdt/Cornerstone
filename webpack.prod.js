const { resolve } = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const webpack = require('webpack');

const BUILD_DIR = resolve(__dirname, 'public/scripts');
const APP_DIR = resolve(__dirname, 'src');
const PUBLIC_DIR = resolve(__dirname, 'public');
const SCRIPTS_DIR = resolve(__dirname, 'scripts');

const VENDOR_LIBS = [
	'react',
	'react-dom'
];

module.exports = {
  entry: {
		bundle: APP_DIR + '/index.js',
		vendor: VENDOR_LIBS
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		publicPath: '/scripts/',
	},

	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/,
				include : APP_DIR,
				options: {
					presets: [
						[
							'env',
							{ modules: false }
						],
						'react'
					],
					plugins: [ 'syntax-dynamic-import' ]
				}
			},
			{
				use: ExtractTextPlugin.extract(['css-loader?modules,localIdentName="[name]-[local]-[hash:base64:6]",camelCase']),
				test: /\.css$/
			},
			{
				loader: 'json-loader',
				test: /\.json$/
			},
			{
			  test: /\.(jpg|png|svg|gif)$/,
			  loader: 'url-loader',
			  options: {
			    limit: 25000
			  }
			}
		],
	},

	plugins: [
		new ExtractTextPlugin({
			filename: 'styles.[chunkhash:6].css',
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
			minChunks: Infinity,
		}),
		new HTMLWebpackPlugin({
			inject: false,
			filename: '../index.html',
			template: 'scripts/index.ejs',
			minify: {
				collapseBooleanAttributes: true,
				removeComments: true,
				collapseWhitespace: true,
			}
		}),
		new InlineManifestWebpackPlugin({
        name: 'webpackManifest'
    }),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			mangle: {
				screw_ie8: true
			},
			compress: {
				warnings: false,
				screw_ie8: true
			},
			comments: false
		}),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html|css)$/,
			threshold: 0,
			minRatio: 0.8
		}),
		new OfflinePlugin({
      caches: 'all',
      relativePaths: false,
      publicPath: '/scripts/',
      ServiceWorker: {
          events: true,
          entry: './scripts/sw-handlers.js',
          output: '../sw.js',
          publicPath: '/sw.js',
          navigateFallbackURL: '/'
      },
      AppCache: {
          events: true,
          output: '../appcache',
          publicPath: '/appcache/'
      },
      externals: [
          '/',
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
      ]
  	})
	],

	resolve: {
		alias: {
			components: APP_DIR+"/components",
			layouts: APP_DIR+"/layouts",
			utils: APP_DIR+"/utils"
		},
	}
}
