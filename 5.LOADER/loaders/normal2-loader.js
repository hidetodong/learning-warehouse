function loader(source){
    console.log('normal2');
    return source
}


loader.pitch = function(){
    console.log('normal2-pitch')
}
module.exports = loader