const webpack = require('webpack')
module.exports = {
    mode: 'development',
    output: {
        filename: '[name].js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map',
};