
const { AsyncSeriesHook } = require('tapable')

const hook = new AsyncSeriesHook(['name','age'])

console.time('cost')
hook.tapAsync('1',(name,age,callback)=>{    
    setTimeout(()=>{
        console.log('1',name,age)   
        callback()
    },1000)
})

hook.tapAsync('2',(name,age,callback)=>{    
    setTimeout(()=>{
        console.log('2',name,age)   
        callback(null,'2return')
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