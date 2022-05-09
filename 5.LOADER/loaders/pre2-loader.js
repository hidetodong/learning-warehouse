function loader(source){
    console.log('pre2');
    return source
}


loader.pitch = function(){
    console.log('pre2-pitch')
}
module.exports = loader