
const { AsyncParallelHook } = require('./tapable')

debugger
const hook = new AsyncParallelHook(['name','age'])
console.time('cost')
// events tap注册 call触发
hook.tapAsync('1',(name,age,callback)=>{    
    setTimeout(()=>{
        console.log('1',name,age)   
        callback()
    },1000)
})

hook.tapAsync('2',(name,age,callback)=>{    
    setTimeout(()=>{
        console.log('2',name,age)   
        callback()
    },2000)
})

hook.tapAsync('3',(name,age,callback)=>{    
    setTimeout(()=>{
        console.log('3',name,age)   
        callback()
    },3000)
})

// call方法只有同步才有 异步没有
// hook.call('zhufeng',10)
hook.callAsync('zhufeng',10,(err)=>{
    console.log('done')
    console.timeEnd('cost')
})
