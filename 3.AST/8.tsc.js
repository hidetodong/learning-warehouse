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
            AssignmentExpression(path,state){
                const errors = state.file.get('errors')
                // 获取左侧变量定义
                const variable = path.scope.getBinding(path.get('left'));
                // 获取左侧变量类型
                // const variableType = variable
                // 获取右侧值类型
                // 判断是否一样
            }
        },
        post(file){
            console.log(...file.get('errors'))
        }
     }
}

// 实现no-console
let sourceCode = `
var age:number;
age = '12';
`

const result = babel.transform(sourceCode,{
    filename:'sum.js',
    // 识别ts 
    parserOpts:{plugins:['typescript']},
    plugins:[tscCheckPlugin]
})

console.log(result.code);
