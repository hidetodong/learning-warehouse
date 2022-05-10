const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')


// 同步钩子 代码工厂
class SyncHookCodeFactory extends HookCodeFactory {
    content(){
        return this.callTapsSeries();
    }
}

const factory = new SyncHookCodeFactory()


class SyncHook extends Hook {
    compile(options){
        factory.setup(this,options)
        return factory.create(options)
    }
}

module.exports = SyncHook