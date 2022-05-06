// 模块定义
var modules = {
  './src/title.js':(module,exports,require) => {
    // 标识此exports是一个es module的导出
    require.r(exports);
    require.d(exports,{
      'default':()=> _DEFAULT_EXPORT_,
      'age':()=> age 
    })
    const _DEFAULT_EXPORT_ = ('title_name')
    const age = 'title_age'
  }
}


var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

require.r = (exports)=>{
  // 给exports 定义个 tag叫 module
  Object.defineProperty(exports,Symbol.toStringTag,{ value:'Module' }); // [object Module]
  Object.defineProperty(exports,'_esModule',{ value:true }); // exports._esModule = true
}

require.d = (exports,definition)=>{
  for(var key in definition){
    Object.defineProperty(exports,key,{
      get:definition[key]
    })
  }
}

let title = __webpack_require__('./src/title.js');

console.log(title.default)
console.log(title.age)