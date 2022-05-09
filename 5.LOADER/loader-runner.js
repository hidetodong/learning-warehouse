const fs = require("fs");

/**
 * 根据loader模块的绝对路径得到loader对象
 * @param {*} loader
 */
function createLoaderObject(loader) {
  const normal = require(loader);
  const pitch = normal.pitch;
  return {
    path: loader, //loader的绝对路径
    normal,
    pitch,
    data: {}, // 每个loader对象都会有一个自定义的data对象
    pitchExecuted: false, //此loader的pitch函数是否已经执行过了
    normalExecuted: false, //此loader的normal函数是否已经执行过了
  };
}

function processResource(processOptions,loaderContext,pitchingCallback){
    processOptions.readResource(loaderContext.resource,(err,resourceBuffer)=>{
        console.log(resourceBuffer.toString())
        processOptions.resourceBuffer = resourceBuffer;
        // 运行到这里已经越界了 所以-1后指向最后一个loader
        loaderContext.loaderIndex--;
        // iterateNormalLoaders(processOptions,loaderContext,[resourceBuffer],pitchingCallback)
    })
}

function iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback){

    if(loaderContext.loaderIndex >= loaderContext.loaders.length){
        return processResource(processOptions,loaderContext,pitchingCallback);
    }
    const currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
    // 如果执行过了 移动到下一个loader
    if(currentLoader.pitchExecuted){
        loaderContext.loaderIndex++;
    }
    let pitchFn = currentLoader.pitch;
    currentLoader.pitchExecuted = true; // 不管有没有 都会置为true
    if(!pitchFn){
        return iteratePitchingLoaders(processOptions,loaderContext,pitchingCallback)
    }
    // 如果pitchFn有值 以同步或者异步调用pitch方法，以loaderContext为指针
    runSyncOrAsync(pitchFn,loaderContext,
        [loaderContext.remainingRequest,loaderContext.previousRequest,loaderContext.data],(err,...args)=>{
        // 判断返回值,如果有返回值，需要掉头执行前一个loader的normal
        if(args.length > 0 && args.some(item => item)){
            // 回到上一个
            loaderContext.loaderIndex--
            // iteratePitchingLoaders(processOptions,loaderContext,args,pitchingCallback)
        }else{
            return iteratePitchingLoaders(processOptions,loaderContext,args,pitchingCallback)
        }
    })
}

function runSyncOrAsync(fn,loaderContext,args,runCallback){
    let isSync = true;// 默认同步执行loader
    let isDone = false;//
    loaderContext.callback = (err,...args) => runCallback(err,...args)

    loaderContext.async = ()=>{
        if(isDone){ //只能调用一次
            throw new Error('async，重复执行callback')
        }
        isSync = false;// 把是否同步执行的标志 从同步变成异步
        return loaderContext.callback
    }

    let result = fn.apply(loaderContext,args)
    if(isSync){ // 如果isSync是同步的 由本方法直接执行runCallback
        isDone = true
        runCallback(null,result)
    }else{

    }
}

function runLoaders(options, finalCallback) {
  const { resource, loaders, context, readResource = fs.readFile } = options;
  const loaderObjects = loaders.map(createLoaderObject);
  const loaderContext = context; // 会成为loader执行过程中的this指针
  loaderContext.resource = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaders = loaderObjects;
  loaderContext.loaderIndex = 0; // 当前正在执行的loader的索引
  loaderContext.callback = null;
  loaderContext.async = null; // 是内置方法，可以把loader的执行从同步变成异步

  Object.defineProperty(loaderContext,'request',{
      get(){ //loader1!loader2!loader3!file.js
          return loaderContext.loaders.map(loader => loader.path).concat(loaderContext.resource).join('!')
      },
  })
  Object.defineProperty(loaderContext,'remainingRequest',{
    get(){ //loader3!file.js
        return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(loader => loader.path).concat(loaderContext.resource).join('!')
    },
    })
    Object.defineProperty(loaderContext,'currentRequest',{
        get(){ //loader2!loader3!file.js
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!')
        },
    })
    Object.defineProperty(loaderContext,'previousRequest',{
        get(){ //loader1
            return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!')
        },
    })
    Object.defineProperty(loaderContext,'data',{
        get(){ //loader1!loader2!loader3!index.js
            return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!')
        },
    })

    let processOptions = {
        resourceBuffer:null,// 存放着要加载模块的原始内容
        readResource // 读取文件的方法 默认为fs.readFile
    }

    // 开始从左向右迭代执行loader的pitch
    iteratePitchingLoaders(processOptions,loaderContext,(err,result)=>{
        finalCallback(err,{
            result,
            resourceBuffer:processOptions.resourceBuffer
        })
    })
}

exports.runLoaders = runLoaders;
