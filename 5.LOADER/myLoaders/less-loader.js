let less = require("less");
function loader(source) {
  let cssSource

  //如果调用了this.async 方法，就会把loader的执行从同步变成异步，只有当你手工调用callback的时候才会认为此loader执行结束
  const callback = this.async();

  less.render(source, { filename: this.resource }, (err, output) => {
    cssSource = output.css

    callback(null,cssSource)
  });

  // return `module.exports = ${JSON.stringify(output.css)}`
}
module.exports = loader;
// 在真正的less-loader中 这一步返回的是js 而不是css

/**
 * 1.如果有些loader执行是异步的
 */