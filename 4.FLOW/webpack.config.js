const path = require("path");
module.exports = {
 mode:'production',
 entry:{
     entry1:'./src/entry1.js',
     entry2:'./src/entry2.js'
 },
 output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js'
 }
}

// 一般来说每个入口回生成一个代码块叫做chunk，每个代码块chunk里面会放着本入口模块和他依赖的模块
