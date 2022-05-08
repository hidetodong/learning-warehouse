const pathlib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')


// 实现按需加载
// # 思路 一行拆两行 直接从文件引入
// import { flatten,concat } from 'lodash'
// =>
// import flatten from 'lodash/flatten'
// import concat from 'lodash/concat'
const babelPluginImport = (options) => {
    return {
        visitor:{
            ImportDeclaration(path,state){
                const { node } = path
                const { specifiers } = node
                const { libraryName,libraryDirectory } = state.opts

                if(node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])){
                    const importDeclarations = specifiers.map(specifier =>{
                        // 过滤空字符串 妙啊
                        const source = [libraryName,libraryDirectory,specifier.imported.name].filter(Boolean).join('/')

                        return types.importDeclaration(
                            // import xxx 
                            [types.importDefaultSpecifier(specifier.local)],
                            // from xxx
                            types.stringLiteral(source)
                        )
                    })
                    path.replaceWithMultiple(importDeclarations)
                }
            }
        }
     }
}


module.exports = babelPluginImport