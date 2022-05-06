/*
 * @Author: hidetodong
 * @Date: 2022-05-06 19:52:40
 * @LastEditTime: 2022-05-06 19:54:27
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/doc/2.js
 * HIDETOXIC - 版权所有
 */
let obj = {} 
var ageValue = 20

Object.defineProperty(obj,'age',{
    // 不能和get set 公用
    // writable:true,
    // value:11,  
    get(){
        return ageValue
    },
    set(){
        ageValue = newValue
    },
    enumerable:true, // for in 是否可以遍历
    configurable:true // 是否可以通过delete删除
})