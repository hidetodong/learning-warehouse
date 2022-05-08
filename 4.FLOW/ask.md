# 一个entry只打包一个js文件吗

一般来说是的
但是使用splitChunks配置的模块会进行分割和合并
懒加载 import()