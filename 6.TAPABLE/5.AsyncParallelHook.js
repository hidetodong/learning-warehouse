const { AsyncParallelHook } = require('tapable')
debugger
const hook = new AsyncParallelHook(['name','age'])

// events tap注册 call触发
hook.tap('1',(name,age)=>{
    console.log('1',name,age)
    return '1'
})

hook.tap('2',(name,age)=>{
    console.log('2',name,age)
    return '2'
})

hook.tap('3',(name,age)=>{
    console.log('3',name,age)
    return '3'
})

// call方法只有同步才有 异步没有
// hook.call('zhufeng',10)
hook.callAsync('zhufeng',10,(err)=>{
    console.log('done')
})
