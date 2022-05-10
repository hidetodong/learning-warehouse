function anonymous(name, age) {
  var _x = this._x; // _x就是注册的回调函数
  var _fn0 = _x[0];
  _fn0(name, age);

  var _fn1 = _x[1];
  _fn1(name, age);

  var _fn2 = _x[2];
  _fn2(name, age);
}
