function loader(source){
    console.log('post1');
    return source
}


loader.pitch = function(){
    console.log('post1-pitch')
}

module.exports = loader