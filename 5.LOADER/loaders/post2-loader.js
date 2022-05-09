function loader(source){
    console.log('post2');
    return source
}


loader.pitch = function(){
    console.log('post2-pitch')
}

module.exports = loader