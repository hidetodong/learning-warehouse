function loader(source){
    console.log('pre2');
    return source
}


loader.pitch = function(){
    console.log('pre2-pitch')
}

// 如果loader.raw是true的话 传给loader的就是buffer
loader.raw = true
module.exports = loader