function loader(source){
    console.log('inline2');
    return source
}
loader.pitch = function(){
    console.log('inline2-pitch')
}

module.exports = loader