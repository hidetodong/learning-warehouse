const pathlib = require('path')
const babel = require('@babel/core')
const importModule = require('@babel/helper-module-imports')
const types = require('@babel/types')
// const transformClasses = require('@babel/plugin-transform-classes')
const template = require('@babel/template')

const autoLoggerPlugin = ({libName})=>{
    return {
        visitor:{
         // 用来保证此模块内一定会引用一个日志的模块，如果源代码中已经有logger模块引用了，直接用，没有就引入
         // state 是一个用来暂存数据的对象 
         Program(path,state){
             let loggerId;
             path.traverse({
                 ImportDeclaration(path){
                     const { node } = path
                     
                    if(libName === node.source.value){
                        // 两种方式获取
                        // const specifier = node.specifiers[0];  // 如果层级比较浅用这种
                        const specifier = path.get(`specifiers.0`).node // 层级比较深用这种
                        loggerId = specifier.local.name
                        path.stop() // 遍历所有子节点。stop跳出剩下的遍历
                    } 
                 }
             });
             // 如果没获取到logger 说明没导入过
             if(!loggerId){
                // {1}
                // Program 路径下 增加一个默认导入 导入一个logger模块 本地的文件名也叫logger
                // loggerId = importModule.addDefault(path,'logger',{
                //     // 内部会判断重名
                //     nameHint:path.scope.generateUid('logger') // 生成一个变量名叫logger，保证同一个作用域内生成的变量不重名
                // }).name;

                // 和{1}等价  此处我们可以实现一下 addDefault 
                loggerId = path.scope.generateUid('logger')
                const importDeclaration = template.statement(`import _logger2 from 'logger'`)();

                path.node.body.unshift(importDeclaration)

             }
            // 这样创建一个节点很长很麻烦 可以简单点？ sum(a,b,c,d,f){a.b.c.d.f()}
            //  state.loggerNode = types.expressionStatement( types.callExpression(types.identifier(loggerId),[]))
            // # 
            // 1. 用template创建比较方便
            // 2. template.statement返回的是一个函数 所以还要执行一下才能生成节点
            state.loggerNode = template.statement(`${loggerId}()`)()
         },
         // 可以用｜隔开 写在一起 防止重复写
         'FunctionExpression|ArrowFunctionExpression|FunctionDeclaration|ClassMethod'(path, state){
            const { node } = path;
            if(types.isBlockStatement(node.body)){
                // 在块表达式内增加一个 logger()
                // 节点属性都是节点 
                node.body.body.unshift(state.loggerNode)
            }else{
                // 如果形似 const minus = (a,b) => a - b 
                // 创建一个新body替换
                const newBody = types.blockStatement([
                    // 插入一个logger()
                    state.loggerNode,
                    // 把老body放在后面
                    types.returnStatement(node.body)
                ])

                // get 返回的是路径
                path.get('body').replaceWith(newBody)
            }
         },
        }
     }
}

// 可以扫描所有console.log error debug 自动给方法添加参数 log所在的文件名 行 列
let sourceCode = `
function sum(a,b){ return a+b }
const minus = (a,b)=> a-b
const multiply = function (a,b){ return a*b}
class Calculator{
    divide(a,b){
        return a / b
    }
}
`

const result = babel.transform(sourceCode,{
    filename:'sum.js',
    plugins:[autoLoggerPlugin({libName:'logger'})]
})

console.log(result.code);
