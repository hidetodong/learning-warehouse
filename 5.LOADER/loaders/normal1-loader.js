function loader(source){
    console.log('normal1');
    return source
}

loader.pitch = function(){
    console.log('normal1-pitch')
}
module.exports = loader