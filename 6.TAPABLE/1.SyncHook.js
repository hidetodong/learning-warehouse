const { SyncHook } = require("./tapable");
let syncHook = new SyncHook(["name", "age"]);

let fn1 = (name, age) => {
    console.log(1, name, age);
}
syncHook.tap({name:'1'},fn1);
let fn2 =  (name, age) => {
    console.log(2, name, age);
}
syncHook.tap("2",fn2);
syncHook.call("zhufeng", 10);