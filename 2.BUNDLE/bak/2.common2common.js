/*
 * @Author: hidetodong
 * @Date: 2022-05-06 20:18:07
 * @LastEditTime: 2022-05-06 20:18:08
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/bak/main.js
 * HIDETOXIC - 版权所有
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/title.js":
/*!**********************!*\
  !*** ./src/title.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

/*
 * @Author: hidetodong
 * @Date: 2022-05-06 19:59:26
 * @LastEditTime: 2022-05-06 20:17:27
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/src/title.js
 * HIDETOXIC - 版权所有
 */

exports.age = 'title_age'
exports.name= 'title_name'

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*
 * @Author: hidetodong
 * @Date: 2022-05-06 19:55:59
 * @LastEditTime: 2022-05-06 20:17:36
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /2.BUNDLE/src/index.js
 * HIDETOXIC - 版权所有
 */
let title = __webpack_require__(/*! ./title.js */ "./src/title.js")
console.log(title.name)
console.log(title.age)
})();

/******/ })()
;