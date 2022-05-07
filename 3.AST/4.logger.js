const pathlib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')
// const transformClasses = require('@babel/plugin-transform-classes')

const loggerPlugin = {
   visitor:{
        CallExpression(path,state){
            const { node } = path
            if(types.isMemberExpression(node.callee)){
                if(node.callee.object.name === 'console'){
                    if(['log','info','warn','error'].includes(node.callee.property.name)){
                        const { line,column } = node.loc.start
                        const filename = state.file.opts.filename
                        const relativeName = pathlib.relative(__dirname,filename)
                        node.arguments.unshift(types.stringLiteral(`${relativeName}:${line}:${column}`))
                    }
                }
            }
        }
   }
}

// 希望可以扫描所有console.log error debug 自动给方法添加参数 log所在的文件名 行 列
let sourceCode = `
function sum(a,b){
    console.log('日志');
    return a + b;
}
`

const result = babel.transform(sourceCode,{
    filename:'sum.js',
    plugins:[loggerPlugin]
})

console.log(result.code);
