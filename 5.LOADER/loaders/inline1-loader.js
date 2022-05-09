function loader(source){
    this.data.id
    console.log('inline1');
    return source
}

loader.pitch = function(){
    this.data.id = 'inline1'
    this.callback(null,'value1')
    console.log('inline1-pitch')
}

module.exports = loader