const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')


const code = `function ast(){}`

// parse方法可以把源代码转成抽象语法树ast
const ast = esprima.parseModule(code)
let indent = 0
const padding = ()=>{
    return ' '.repeat(indent)
}

estraverse.traverse(ast,{
    enter(node){
        console.log(padding()+node.type+'进入')
        indent+=2
        if(node.type === 'FunctionDeclaration'){
            node.id.name = 'newAst'
        }
    },
    leave(node){
        console.log(padding()+node.type+'离开')
        indent-=2

    }
})

const result = escodegen.generate(ast)

console.log(result)