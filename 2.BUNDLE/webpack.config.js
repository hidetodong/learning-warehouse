/*
 * @Author: hidetodong
 * @Date: 2022-05-06 19:54:34
 * @LastEditTime: 2022-05-06 19:55:51
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/webpack.config.js
 * HIDETOXIC - 版权所有
 */

const path  = require("path");
const HtmlWebpackPlugin  = require("html-webpack-plugin");

module.exports = {
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html'
        })
    ]
}