
const babel = require('@babel/core')
const types = require('@babel/types')
// const transformClasses = require('@babel/plugin-transform-classes')

const transformClasses = {
    visitor:{
        ClassDeclaration(path){
            const { node } = path
            const { id } = node
            const classMethods = node.body.body
            const newNodes = []
            classMethods.forEach(classMethod=>{
                if(classMethod.kind === 'constructor'){
                    const constructor = types.functionDeclaration(id,classMethod.params,classMethod.body);
                    newNodes.push(constructor)
                }else{
                    const assignment = types.assignmentExpression(
                        '=',
                        types.memberExpression(
                            types.memberExpression(
                                id,
                                types.identifier('prototype')),
                            classMethod.key
                        ),
                        types.functionExpression(null,classMethod.params,classMethod.body)
                    )
                    newNodes.push(assignment)
                }

            })
            if(newNodes.length === 1){
                path.replaceWith(newNodes[0])
            }else{
                path.replaceWithMultiple(newNodes)
            }
        }
    }
}
let sourceCode = `
class Person {
    constructor(name){
        this.name = name
    }
    getName(){
        return this.name
    }
}
`

const result = babel.transform(sourceCode,{
    plugins:[transformClasses]
})

console.log(result.code);
