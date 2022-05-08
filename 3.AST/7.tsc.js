const pathlib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')
// const transformClasses = require('@babel/plugin-transform-classes')

const AnnotationMap = {
    TSNumberKeyWord:'NumbericLiteral',
    
}

const tscCheckPlugin = ()=>{
    return {
        pre(file){
            file.set('errors',[])
        },
        visitor:{
            VariableDeclarator(path,state){
                const { node } = path
                const errors = state.file.get('errors')
                // 变量声明的类型
                const idType = AnnotationMap[path.node.id.typeAnnotation.typeAnnotation.type]
                // 初始化值的类型
                const initType = path.node.init.type
                if(initType !== idType){
                    Error.stackTraceLimit = 0;
                    errors.push(
                        path.get(`init`).buildCodeFrameError(`无法把${initType}赋值给${idType}`,Error)
                    )
                }
            }
        },
        post(file){
            console.log(...file.get('errors'))
        }
     }
}

// 实现no-console
let sourceCode = `
var age:number = 12
`

const result = babel.transform(sourceCode,{
    filename:'sum.js',
    // 识别ts 
    parserOpts:{plugins:['typescript']},
    plugins:[tscCheckPlugin]
})

console.log(result.code);
