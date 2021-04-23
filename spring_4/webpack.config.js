const path = require('path');
const { merge } = require('webpack-merge')
const devConfig = require('./webpack.dev.js')
const prodConfig = require('./webpack.prod.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
            },
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: '/node_modules/',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ],
    devServer: {
        contentBase: './dist',    //配置开发服务运行时的文件根目录
        port: 3000,       //端口
        hot: true, //是否启用热更新
        open: false, //是否自动打开浏览器
    },
}

//  将配置导出为函数
module.exports = env => {
    if (env && env.production) {
        return merge(commonConfig, prodConfig)
    } else {
        return merge(commonConfig, devConfig)
    }
}

