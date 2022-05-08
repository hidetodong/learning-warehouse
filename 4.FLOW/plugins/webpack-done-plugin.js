/*
 * @Author: hidetodong
 * @Date: 2022-05-08 15:16:07
 * @LastEditTime: 2022-05-08 15:17:35
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /4.FLOW/plugins/webpack-done-plugin.js
 * HIDETOXIC - 版权所有
 */

class WebpackDonePlugin {
    apply(compiler){
        compiler.hooks.run.tap('WebpackDonePlugin',()=>{
            console.log('结束编译')
        })
    }
}

module.exports = WebpackDonePlugin