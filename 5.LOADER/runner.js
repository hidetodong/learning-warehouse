const { runLoaders } = require('loader-runner')


const path = require('path')
const fs = require('fs')

const entryFile = path.resolve(__dirname,'src/index.js')
const request = `inline1-loader!inline2-loader!${entryFile}`

// loader 的叠加顺序 = post(后置)+inline(内联)+normal(正常)+pre(前置)
// 后联正前 = 厚脸挣钱

let rules = [
    {
        test:/\.js$/,
        use:['normal1-loader','normal2-loader']
    },
    {
        test:/\.js$/,
        enforce:'pre',  
        use:['pre1-loader','pre2-loader']
    },
    {
        test:/\.js$/,
        enforce:'post',
        use:['post1-loader','post2-loader']
    }
]


let parts = request.split('!')
let resource = parts.pop()// ${entryFile}
let inlineLoaders = parts

let preLoaders=[],postLoaders=[],normalLoaders=[]

for(let i=0;i<rules.length;i++){
    let rule = rules[i]
    if(rule.test.test(resource)){
        if(rule.enforce === 'post'){
            postLoaders.push(...rule.use)
        } else if(rule.enforce === 'pre'){
            preLoaders.push(...rule.use)
        } else{
            normalLoaders.push(...rule.use)
        }
    }
}

let loaders = [];
if(request.startsWith('!!')){
    loaders.push(...inlineLoaders)
}else if(request.startsWith('-!')){
    // 不要前置和普通
    loaders.push(...postLoaders,...inlineLoaders,...preLoaders)
}else if(request.startsWith('!')){
    loaders.push(...postLoaders,...inlineLoaders,...preLoaders);
}else{
    loaders.push(...postLoaders,...inlineLoaders,...normalLoaders,...preLoaders)
}

loaders = loaders.map(loader => path.resolve(__dirname,'loaders',loader))

runLoaders({
    resource,
    loaders,
    // 可以先不管
    // context:{},
    // readResource:fs.readFile
},(err,result)=>{
    console.log(result)
})