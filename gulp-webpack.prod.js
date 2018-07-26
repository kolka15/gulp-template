const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

let config = {
    watchOptions: {
        aggregateTimeout: 100
    },
    entry: ['babel-polyfill', './src/js/entrance.js'],
    devtool: '#source-map',
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('prod')
        })

    ]
};

if (process.env.NODE_ENV === 'check') {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;