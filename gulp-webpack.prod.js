const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

let config = {
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 100
    },
    entry: ['babel-polyfill', './src/js/entrance.js'],
    output: {
        filename: "bundle.js",
        library: "myLibrary",
        publicPath: '/assets/js/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|svg4everybody)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false,
                },
            }
        }),
    ]
};

if (process.env.NODE_ENV === 'check') {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;