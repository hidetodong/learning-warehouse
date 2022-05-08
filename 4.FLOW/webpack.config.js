const path = require("path");
const WebpackRunPlugin = require('./plugins/webpack-run-plugin')
const WebpackDonePlugin = require('./plugins/webpack-done-plugin')
module.exports = {
 mode:'development',
 entry:{
     entry1:'./src/entry1.js',
     entry2:'./src/entry2.js'
 },
 output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js'
 },
 resolve:{
    extensions:['','.js','.jsx']
 },
 module:{
    rules:[
        {
            test:/\.js$/,
            use:[
                path.resolve(__dirname,'loaders/logger1-loader.js'),
                path.resolve(__dirname,'loaders/logger2-loader.js'),
            ]
        }
    ]
 },
 plugins:[
     new WebpackRunPlugin(),
     new WebpackDonePlugin()
 ]
}

// 一般来说每个入口回生成一个代码块叫做chunk，每个代码块chunk里面会放着本入口模块和他依赖的模块
