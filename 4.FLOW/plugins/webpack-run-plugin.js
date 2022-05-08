/*
 * @Author: hidetodong
 * @Date: 2022-05-08 15:16:07
 * @LastEditTime: 2022-05-08 15:16:07
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /4.FLOW/plugins/webpack-run-plugin.js
 * HIDETOXIC - 版权所有
 */

class WebpackRunPlugin {
    apply(compiler){
        compiler.hooks.run.tap('WebpackRunPlugin',()=>{
            console.log('开始编译')
        })
    }
}

module.exports = WebpackRunPlugin