const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const types = require('@babel/types');
const { callbackify } = require('util');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

function toUnixPath(path){
    return path.replace(/\\/g,'/')
}

// 当前命令所在的目录
const baseDir = toUnixPath(process.cwd())

class Compilation {
    constructor(options){
        this.options = options
        // 本次编译所有生成出来的模块
        this.modules = []
        // 本次编译产出的所有代码块
        this.chunks = []
        // 本次打包出来的资源
        this.assets = []
        // 本次打包涉及了哪些文件。主要是为了实现watch，监听文件变化，文件变化后重新编译
        this.fileDependencies = []
    }
    build(callback){
        // 5.根据配置文件中的`entry`找到所有入口
        let entry = {}
        if(typeof this.options.entry === 'string'){
            entry.main = this.options.entry
        }else{
            entry = this.options.entry
        }
        // 6.从入口文件出发，调用所有配置的规则，比如说loader对模块进行编译
        for(let entryName in entry){

            // 入口名称是entry的属性名，也将成为代码块的名字
            let entryFilePath = path.posix.join(baseDir,entry[entryName])
            // 把入口文件的绝对路径添加到依赖数组里
            this.fileDependencies.push(entryFilePath)
            let entryModule = this.buildModule(entryName,entryFilePath)

            this.modules.push(entryModule)

            // 8.等把所有的模块编译完成之后，根据模块之间的依赖关系，组装成`chunk`
            let chunk = {
                name:entryName, // 代码块的名称就是入口的名称 
                entryModule,// 此代码块对应的入口模块的对象
                modules:this.modules.filter(item=> item.names.includes(entryName))
            }
            this.chunks.push(chunk)
        }

        // 9.再把代码块chunk转换成一个一个文件加入到输出列表
        this.chunks.forEach(chunk => {
            let filename = this.options.output.filename.replace('[name]',chunk.name);
            // 输出列表
            this.assets[filename] = getSource(chunk)
        })

        // 执行回调
        callback(null,{
            chunks:this.chunks,
            modules:this.modules,
            assets:this.assets,
        },this.fileDependencies)
    }

    // 编译模块的时候需要传入 所属模块的名字
    buildModule(name,modulePath){
        // 6.1 读取模块内容
        let sourceCode = fs.readFileSync(modulePath,'utf8');
        // buildModule 返回一个模块对象，每个模块都有一个模块Id 等于 相对于根目录的相对路径
        let moduleId = './' + path.posix.relative(baseDir,modulePath)

        // 创建一个模块对象，name是此模块属于哪个代码块，一个模块可能会属于多个代码块 所以是数组
        let module = { id:moduleId,names:[name],dependencies:[]}
        // 查找对应的loader对源码进行翻译和转换
        let loaders = [];
        let { rules = [] } = this.options.module
        
        rules.forEach(rule => {
            let { test } = rule
            // 如果模块的路径和正则匹配，就把此规则对应的loader添加到loaders数组
            if(modulePath.match(test)){
                loaders.push(...rule.use)
            }
        });
        // 自右向左对模块进行转译
        sourceCode = loaders.reduceRight((sourceCode,loader)=>{
            // 拿到loader执行
            return require(loader)(sourceCode);
        },sourceCode);

        // 通过loader翻译后的内容一定是js内容
        // 7.再找出此模块的依赖的模块，递归执行，找到所有依赖的模块进行编译
        let ast = parser.parse(sourceCode, { sourceType:'module' });

        const _options = this.options
        const _fileDependencies = this.fileDependencies
        traverse(ast,{
            CallExpression(nodePath){
                const { node } = nodePath
                // 如果是一个require的方法调用的话 就获取依赖模块
                if(node.callee.name === 'require'){
                    // 获取依赖的模块
                    let depModuleName = node.arguments[0].value;
                    // 当前正在编译的模块所在目录
                    let dirname = path.posix.dirname(modulePath);
                    // 获取依赖模块的绝对路径
                    let depModulePath = path.posix.join(dirname,depModuleName)

                    // 获取配置的拓展名
                    let extensions = _options.resolve.extensions;
                    // 尝试添加后缀，找一个真实在硬盘上存在的文件
                    depModulePath =  tryExtensions(depModulePath,extensions)
                    _fileDependencies.push(depModulePath);

                    // 获取依赖的模块Id
                    let depModuleId = './'+path.posix.relative(baseDir,depModulePath)
                    // 修改语法树，把依赖的模块改为依赖的模块Id
                    // require('./title') => require("./src/title.js")
                    node.arguments = [types.stringLiteral(depModuleId)]

                    module.dependencies.push({ depModuleId,depModulePath })

                }
            }
        });
        // 重新生成新的代码
        let { code } = generator(ast)
        // 把转译后的源代码放到module._source属性上
        module._source = code
        module.dependencies.forEach(({depModuleId,depModulePath})=>{
            let existModule = this.modules.find(item => item.id === depModuleId)

            // 如果modules里已经存在这个将要编译的依赖模块的了 那么就不需要编译了 ，直接把此代码块的名称添加到对应模块的name数组里
            if(existModule){
                existModule.names.push(name)
            } else {
                let depModule = this.buildModule(name,depModulePath)
                this.modules.push(depModule)
            }
        })

        return module
    }
}

// 获取chunk文件
function getSource(chunk) {
    return `
     (() => {
      var modules = {
        ${chunk.modules.map(
          (module) => `
          "${module.id}": (module) => {
            ${module._source}
          },
        `
        )}  
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports ={};
      ${chunk.entryModule._source}
})()
    `;
} 

// 如果引入没有给后缀 加入配置的后缀 逐个去找
function tryExtensions(modulePath,extensions){
    if(fs.existsSync(modulePath)){
        return modulePath
    }
    for (let i=0;i<extensions.length;i++){
        // 文件路径加上拓展名
        let filePath = modulePath + extensions[i]
        if(fs.existsSync(filePath)){
            return filePath
        }
    }
    throw new Error(`无法找到${modulePath}`)
}

module.exports = Compilation