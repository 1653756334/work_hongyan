const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        // filename: '[name].[contenthash].js',
        filename: "[name].prod.js"
    },
    plugins: [new CleanWebpackPlugin()],
    devtool: 'cheap-module-source-map',
}