/*
 * @Author: hidetodong
 * @Date: 2022-05-08 17:20:15
 * @LastEditTime: 2022-05-08 17:20:26
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /4.FLOW/loaders/logger2-loader.js
 * HIDETOXIC - 版权所有
 */
function loader(source){
    console.log('loader2');
    return source + '//loader2'
}

module.exports = loader