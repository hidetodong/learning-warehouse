const pathlib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')
// const transformClasses = require('@babel/plugin-transform-classes')

const autoLoggerPlugin = {
   visitor:{
 
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
    plugins:[autoLoggerPlugin]
})

console.log(result.code);
