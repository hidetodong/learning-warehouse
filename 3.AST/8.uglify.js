const pathlib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')

const uglifyPlugin = () => {
    return {
        pre(file){
            file.set('errors',[])
        },
        // 捕获能够生成作用域的节点
        // 函数 类的函数 语句块 if while for
        visitor:{
            // 一个别名 = 函数｜类的函数｜语句块｜if｜while｜for
            Scopable(path){
                // 去除作用域内所有变量进行重命名
                Object.entries(path.scope.bindings).forEach(([key,bindings])=>{
                    const newName = path.scope.generateUid();
                    bindings.path.scope.rename(key,newName)
                })

            }
        },
        post(file){
            console.log(...file.get('errors'))
        }
     }
}

// 代码从有意义变成无意义
let sourceCode = `
    function getAge(){
        var age = 12
        console.log(age)
        var name = 'zz';
        console.log(name)
    }
`

const result = babel.transform(sourceCode,{
    filename:'sum.js',
    // 识别ts 
    parserOpts:{plugins:['typescript']},
    plugins:[tscCheckPlugin]
})

console.log(result.code);
