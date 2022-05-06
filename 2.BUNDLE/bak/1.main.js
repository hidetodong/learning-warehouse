/*
 * @Author: hidetodong
 * @Date: 2022-05-06 20:07:02
 * @LastEditTime: 2022-05-06 20:07:02
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/bak/main.js
 * HIDETOXIC - 版权所有
 */
var __webpack_modules__ = {
  "./src/title.js": (module) => {
    module.exports = "title";
  },
};
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

debugger;
var __webpack_exports__ = {};

let title = __webpack_require__("./src/title.js");
console.log(title);
