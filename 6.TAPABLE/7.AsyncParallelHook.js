/*
 * @Author: hidetodong
 * @Date: 2022-05-10 21:07:02
 * @LastEditTime: 2022-05-11 20:44:28
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /6.TAPABLE/7.AsyncParallelHook.js
 * HIDETOXIC - 版权所有
 */

const { AsyncParallelHook } = require('./tapable')

const hook = new AsyncParallelHook(['name','age'])
console.time('cost')
// events tap注册 call触发
hook.tapPromise('1',(name,age)=>{    
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('1',name,age)
            resolve()
        }, 1000);
    })
})

hook.tapPromise('2',(name,age)=>{    
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('2',name,age)
            resolve()
        }, 2000);
    })
})

hook.tapPromise('3',(name,age)=>{    
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('3',name,age)
            resolve()
        }, 3000);
    })
})

// call方法只有同步才有 异步没有
// hook.call('zhufeng',10)
// hook.callAsync('zhufeng',10,(err)=>{
//     console.log('done')
//     console.timeEnd('cost')
// })
debugger
hook.promise('zhufeng',10)
    .then((err)=>{
        console.log('done')
            console.timeEnd('cost')
    })
