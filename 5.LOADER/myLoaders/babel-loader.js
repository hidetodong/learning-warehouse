const babel = require('@babel/core')
const path = require('path')

function loader(source) {
    const options = this.getOptions();
    const { code } = babel.transformSync(source,options)
    return code
}


module.exports = loader


/** 
 * babel-loader是一个函数，接收老代码，返回新代码
 * @babel/core 负责把源代码转成抽象语法树，遍历语法树，生成代码
 * core 不认识具体的语法，也不会转换任何语法
 * @babel/transform-arrow-function 转换箭头函数语法
 * 语法太多，每个都需要转换，所以搞一组预设
 */