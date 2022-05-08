const fs = require('fs')
const path = require('path')
const { SyncHook } = require('tapable');
const { callbackify } = require('util');
const Compilation = require('./Compilation')

class Complier {
    constructor(options){
        this.options = options
        this.hooks = {
            run:new SyncHook(), // 编译开始触发
            done:new SyncHook(),// 编译结束触发
        }
    }
    // 4.执行`Complier`的`run`方法开始编译
    run(callback){
        this.hooks.run.call();
        const onCompiled = (err,stats,fileDependencies) => {
            // 10.根据配置的输出路径，写入文件系统
            for(let filename in stats.assets){
                let filePath = path.join(this.options.output.path,filename);
                fs.writeFileSync(filePath,stats.assets[filename],'utf8')
            }
            callback(err,{
                toJson:() => stats
            })
            fileDependencies.forEach(fileDependency=>{
                fs.watch(fileDependency,()=>{ this.compile(onCompiled) })
            })
            // 编译成功狗子
            this.hooks.done.call()
        }
        this.compile(onCompiled)
    }

    // 开始编译 编译成功执行回调
    compile(onCompiled){
        // webpack虽然只有1个Compiler,但是每次编译都会产生一个新的Compilation
        let compilation = new Compilation(this.options)
        // 执行compilation 的 build方法进行编译，成功后执行回调
        compilation.build(onCompiled)
    }
}

module.exports = Complier