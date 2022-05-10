/*
 * @Author: hidetodong
 * @Date: 2022-05-10 21:11:32
 * @LastEditTime: 2022-05-10 21:12:56
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /6.TAPABLE/9.AsyncParallelBailHook.js
 * HIDETOXIC - 版权所有
 */
/*
 * @Author: hidetodong
 * @Date: 2022-05-10 21:07:02
 * @LastEditTime: 2022-05-10 21:08:07
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /6.TAPABLE/7.AsyncParallelHook.js
 * HIDETOXIC - 版权所有
 */

const { AsyncParallelBailHook } = require('tapable')

const hook = new AsyncParallelBailHook(['name','age'])
console.time('cost')
// events tap注册 call触发
hook.tapPromise('1',(name,age)=>{    
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('1',name,age)
            // resolve()
            reject('1错误')
        }, 1000);
    })
})

hook.tapPromise('2',(name,age)=>{    
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log('2',name,age)
            resolve('2cuwu')
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

hook.promise('zhufeng',10)
    .then((err)=>{
        console.log('done')
            console.timeEnd('cost')
    },error=>{
        console.log(error)
    })
