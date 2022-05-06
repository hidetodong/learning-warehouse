/*
 * @Author: hidetodong
 * @Date: 2022-05-06 19:48:04
 * @LastEditTime: 2022-05-06 19:50:26
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/doc/1.js
 * HIDETOXIC - 版权所有
 */
console.log(Object.prototype.toString.call("foo"))
console.log(Object.prototype.toString.call([]))
console.log(Object.prototype.toString.call(3))
console.log(Object.prototype.toString.call(true))
console.log(Object.prototype.toString.call(undefined))
console.log(Object.prototype.toString.call(null))


let myExports = {}
// myExports[Symbol.toStringTag] = {value:'Module'};
Object.defineProperty(myExports,Symbol.toStringTag,{ value:"Module"});

console.log(Object.prototype.toString.call(myExports));