const path = require('path')

// 不同操作系统的路径分隔符
console.log(path.sep);

//环境变量PATH的路径分隔符
console.log(path.delimiter);

// 在webpack里做了统一 全部用 “/”