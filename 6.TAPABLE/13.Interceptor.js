const { SyncHook } = require('./tapable')

const hook = new SyncHook(['name'])

hook.intercept({
    register:(tapInfo)=>{
        console.log('inters1')
    },
    tap:(tapInfo)=>{

    },
    call:(tapInfo)=>{

    }
})

hook.intercept({
    register:(tapInfo)=>{
        console.log('inter2')
    }
})

hook.tap({name:'回调a'},(name)=>{
    console.log('A',name)
})
  

hook.tap({name:'回调b'},(name)=>{
    console.log('B',name)
})

debugger
hook.call('zhufeng')