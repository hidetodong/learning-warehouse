
function loader(cssSource) {
  return `module.exports = ${JSON.stringify(cssSource)}`
}
module.exports = loader;
// 在真正的less-loader中 这一步返回的是js 而不是css
