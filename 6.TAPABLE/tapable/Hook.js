/*
 * @Author: hidetodong
 * @Date: 2022-05-10 21:41:29
 * @LastEditTime: 2022-05-11 21:20:26
 * @LastEditors: hidetodong
 * @Description: Hook
 * @FilePath: /6.TAPABLE/tapable/Hook.js
 * HIDETOXIC - 版权所有
 */

class Hook {
    constructor(args){
        if(!Array.isArray(args)){ args = []};
        this.args = Array.isArray(args) ? args : [] // 参数列表
        this.taps = []// 用来存放回调函数的数组
        this.call = CALL_DELEGATE;// 
        this.callAsync = CALL_ASYNC_DELEGATE;//
        this.promise = CALL_PROMISE_DELEGATE;//
        this._x = null
        this.interceptors = [];
    }

    intercept(interceptor){
        this.interceptors.push(interceptor)
    }
    // 注册
    tap(options,fn){
        this._tap('sync',options,fn) // type = sync 注册的是同步钩子
    }

    tapAsync(options,fn){
        this._tap('async',options,fn)
    }

    tapPromise(options,fn){
        this._tap('promise',options,fn)
    }
    

    _tap(type,options,fn){
        // 如果是字符串 包装成对象
        if(typeof options === 'string'){
            options = { name:options }
        }

        const tapInfo = {
            ...options,
            type,
            fn
        }

        this.runRegisterInterceptors(tapInfo);
        this._insert(tapInfo);
    }

    runRegisterInterceptors(tapInfo){
        for(const interceptor of this.interceptors){
            if(interceptor.register){
                interceptor.register(tapInfo)
            }
        }
    }

    _insert(tapInfo){

        this.taps.push(tapInfo)
    }

    _createCall(type){
        return this.compile({
            taps:this.taps, // {name,fn.type}
            args:this.args, // 形参数组 ['name','age']
            type,
            interceptors:this.interceptors
        });
    }

    compile(options){
        throw new Error('此方法是抽象方法，需要子类实现')
    }

}

// 动态创建call方法
const CALL_DELEGATE = function(...args){
    this.call = this._createCall('sync')
    return this.call(...args)
}
const CALL_ASYNC_DELEGATE = function(...args){
    this.callAsync = this._createCall('async')
    return this.callAsync(...args)
}

const CALL_PROMISE_DELEGATE = function(...args){
    this.promise = this._createCall('promise')
    return this.promise(...args)
}

module.exports = Hook