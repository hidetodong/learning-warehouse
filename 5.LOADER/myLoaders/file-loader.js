function loader(source) { // source是buffer
    let filename = Date.now() + '.png'
    // 用于向输出目录里写一个新的文件
    this.emitFile(filename,source)

    return `module.exports = ${JSON.stringify(filename)}`;
}


loader.raw = true

module.exports = loader


// 以前加载图片等二进制文件需要使用file-loader url-loader
// 现在直接使用type:asset就行了

