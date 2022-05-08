const Complier = require('./Compiler')
function webpack(options){
    // 1.初始化参数，从配置文件和shell语句汇总读取并合并文件，得到最终的配置对象
    const argv = process.argv.slice(2)

    // node debugger.js --mode=development
    let shellOptions = argv.reduce((shellOptions,option)=>{
        let [key,value] = shellOptions.split('=')
        shellOptions[key.slice(2)] = value
        return shellOptions
    },{})

    let finalOptions = {
        ...options,
        ...shellOptions
    }

    // 2.用上一步的配置对象，初始化`Complier`对象
    const compiler = new Complier(finalOptions)

    // 3.加载所有配置文件中的插件
    const { plugins } = finalOptions
    for(let plugin of plugins){
        plugin.apply(compiler)
    }


    return compiler
}

module.exports = webpack;