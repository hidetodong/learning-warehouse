const { SyncLoopHook } = require('tapable')

const hook = new SyncLoopHook(['name','age'])

let count1 = 0
let count2 = 0
let count3 = 0


// Loop 不断执行回调函数直到函数的返回为undefined为止
hook.tap('1',(name,age)=>{
    console.log('1','count1',count1)
    if(++count1 === 1){
        count1 = 0
        return;
    }
    return true
})

hook.tap('2',(name,age)=>{
    console.log('2','count2',count2)
    if(++count2 === 2){
        count2 = 0
        return;
    }
    return true
})

hook.tap('3',(name,age)=>{
    console.log('3','count3',count3)
    if(++count3 === 3){
        count3 = 0
        return;
    }
    return true
})


hook.call('zhufeng',10)
