/*
 * @Author: hidetodong
 * @Date: 2022-05-10 23:09:03
 * @LastEditTime: 2022-05-10 23:09:36
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /6.TAPABLE/tapable/AsyncParallelHook.js
 * HIDETOXIC - 版权所有
 */
const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')


// 同步钩子 代码工厂
class AsyncParallelHookCodeFactory extends HookCodeFactory {
    content(){
        return this.callTapsSeries();
    }
}

const factory = new AsyncParallelHookCodeFactory()


class AsyncParallelHook extends Hook {
    compile(options){
        factory.setup(this,options)
        return factory.create(options)
    }
}

module.exports = AsyncParallelHook