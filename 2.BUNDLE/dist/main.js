var modules = {};
var cache = {};

function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}


require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' }); // [object Module]
  Object.defineProperty(exports, '_esModule', { value: true }); // exports._esModule = true
}

require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    })
  }
}


require.f = {}
require.p = '';
require.u = chunkId => `${chunkId}.js`
// 已经安装好的代码块。main已经加载好了
var installedChunks = { main: 0 }

function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = []
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i]
    resolves.push(installedChunks[chunkId][0])
    // 标识代码块已经加载完成了
    installedChunks[chunkId] = 0
  }

  // 把加载的模块合并过来
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId]
  }

  // 按个执行resolve
  while (resolves.length) {
    resolves.shift()();
  }
}

require.l = function (url) {
  let script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)

}
require.f.j = function (chunkId, promises) {
  var installedChunkData;
  var promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject]
  });
  installedChunkData[2] = promise // installedChunkData = [resolve,reject,promise]
  promises.push(promise)

  // p = publicPath 获取代码块的地址
  // 在webpack.config.js 里 output.publicPath 配置
  var url = require.p + require.u(chunkId)

  require.l(url)
}

require.e = function (chunkId) {
  let promises = []
  require.f.j(chunkId, promises);
  return Promise.all(promises)
}

var chunkGlobal = window['chunkGlobal'] || [];

chunkGlobal.push = webpackJsonpCallback;

debugger
// 1.先通过jsonp记载src_hello_js代码块找到对应的文件，加载之后在浏览器内执行脚本
require.e('src_hello_js')
  .then(require.bind(require, "./src/hello.js"))
  .then((result) => {
    console.log(result);
  });
