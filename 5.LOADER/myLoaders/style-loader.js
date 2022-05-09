
const path = require('path')
function loader(cssSource){
    let script = `
        let style = document.createElement("style")
        style.innerHTML = ${JSON.stringify(cssSource)};
        document.head.appendChild(style)
    `
    return script
}

// remainingRequest 剩下的请求
// request = "style-loader!less-loader!index.less"
// 当前在style-loader，remainingRequest = less-loader!index.less

// require 加载一个文件/
loader.pitch = function(remainingRequest){
    let script = `
        let style = document.createElement("style")
        style.innerHTML = require(${stringifyRequest(this,"!!"+remainingRequest)});
        document.head.appendChild(style)
        `
    return script
}

// 把loader的绝对路径转换为相对路径
function stringifyRequest (loaderContext,request) {
    let prefixReg = /^-?!+/;
    let prefixRequest = request.match(prefixReg)
    let prefix = prefixRequest ? prefixRequest[0] : '' // prefix =!!
    const splitted = request.replace(prefixReg,'').split('!') // [less-loader路径，index.less路径]

    const { context } = loaderContext //  


    // 返回字符串 !!./myLoaders/less-loader.js!./src/index.less
    return JSON.stringify(prefix + splitted.map(part=>{
        part = path.relative(context,part);// 获取相对于此文件的路径
        if(part[0] !== '.') part = './' + part
        return part.replace(/\\/g,'/')
    }).join('!'))
}

module.exports = loader