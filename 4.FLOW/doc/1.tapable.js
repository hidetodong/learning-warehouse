// const { SyncHook } = require('tapable')

class SyncHook {
    constructor(){
        this.taps = []
    }
    tap(name,fn){
        this.taps.push({name,fn})
    }
    call(...args){
        this.taps.forEach(tap=>{
            tap.fn && tap.fn(...args)
        })
    }
}

let syncHook = new SyncHook(['name']);

syncHook.tap('监听器名称1',(name)=>{
    console.log('1',name)
})

syncHook.tap('监听器名称2',(name)=>{
    console.log('2',name)
})


class SomePlugin {
    apply(){
        syncHook.tap('SomePlugin',(name)=>{
            console.log('SomePlugin',name)
        })
    }
}

new SomePlugin().apply()

syncHook.call('名称')