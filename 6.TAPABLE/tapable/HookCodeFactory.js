class HookCodeFactory {
  // 负责给回调赋值
  setup(hookInstance, options) {
    // 钩子hook._x = [fn1,fn2,fn3]
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }

  init(options) {
    this.options = options;
  }

  deInit() {
    this.options = null;
  }

  args({ after, before } = {}) {
    const { args } = this.options;
    const allArgs = args;

    if (before) {
      allArgs.unshift(before);
    }

    if (after) {
      allArgs.push(after);
    }

    return allArgs.join(",");
  }

  header() {
    return "var _x = this._x;\n";
  }

  content() {
    throw new Error("content应该由子类实现");
  }

  create(options) {
    // options = {taps,args,type}
    this.init(options);

    let fn;

    switch (
      this.options.type // sync
    ) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      case "async":
        fn = new Function(
          this.args({ after: "_callback" }),
          this.header() + this.content()
        );
        break;

      default:
        break;
    }

    this.deInit();

    return fn;
  }

  callTapsSeries() {
    let code = "";
    for (let i = 0; i < this.options.taps.length; i++) {
      const content = this.callTap(i);
      code += content;
    }
    return code;
  }

  callTapsParallel() {
    let code = `var _counter = ${this.options.taps.length}; \n`;
    code += `
                 var _done = function () {
                        _callback();
                };
                    \n
                `;
    for (let j = 0; j < this.options.taps.length; j++) {
      const content = this.callTap(j);
      code += content;
    }
    return code;
  }

  callTap(tapIndex) {
    let code = "";
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;

    let tapInfo = this.options.taps[tapIndex]; //{type,fn,name}

    switch (tapInfo.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`;
        break;
      case "async":
        code += `
        _fn${tapIndex}(${this.args()},(function(){
            if(--_counter === 0) _done();
        }));
        \n`
      default:
        break;
    }
    return code;
  }
}

module.exports = HookCodeFactory;
