function one(){ // path.scope OneScope a = 1
    var a = 1
    function two(){ // path.scope TwoScope b = 2
        var b = 2 
        console.log(a,b)
    }
}


let OneScope = {
    bindings:['a','_a'],
    generatedUid(varName){
        // 如果有这个变量名就加下划线 直到不重名 
        // 用while 妙啊
        while(OneScope.bindings.includes(varName)){
            varName = '_'+varName
        }
     
        return varName
    }
}

console.log(OneScope.generatedUid('a'));