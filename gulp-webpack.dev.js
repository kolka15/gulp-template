module.exports = {
    // cache: true,
    mode: 'development',
    watch: true,
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
    //
    // externals: {
    //     $: "jquery",
    //     jquery: "jQuery",
    // },
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
};
