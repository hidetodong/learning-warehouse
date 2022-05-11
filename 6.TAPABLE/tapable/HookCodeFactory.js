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
    let allArgs = args;

    if (before) {
      allArgs = [before,...allArgs]
    }

    if (after) {
      allArgs = [...allArgs,after]
    }

    return allArgs.join(",");
  }

  header() {
    let code = 'var _x = this._x;\n'
    const { interceptors = [] } = this.options;
    if(interceptors.length > 0){
        code += `var _taps = this.taps;\n`;
        code += `var _interceptors = this.interceptors;`;
        for(let i=0;i<interceptors.length;i++){
            const interceptor = interceptors[i]
            if(interceptor.call){
                code += `_interceptors[${i}].call(${this.args()});\n`
            }
        }
    }
    return code
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
          this.header() + this.content({ onDone:()=>`_callback();\n` })
        );
        break;
      case "promise":
        let tapsContent = this.content({ onDone:()=>`_resolve();\n` })
        let content = `return new Promise(function(_resolve,_reject){
            ${tapsContent}
        })`
        fn = new Function(this.args(),this.header() + content)
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

  callTapsParallel({ onDone }) {
    let code = `var _counter = ${this.options.taps.length}; \n`;
    code += `
                 var _done = function () {
                        ${onDone()}
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
    const { interceptors = [] } = this.options;
    if(interceptors.length > 0){
        for(let i=0;i<interceptors.length;i++){
            const interceptor = interceptors[i]
            if(interceptor.call){
                code += `_interceptors[${i}].tap(_taps[${tapIndex}]);\n`
            }
        }
    }
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
      case "promise":
          code += `
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then(
            function (_result0) {
              _hasResult${tapIndex} = true;
              if (--_counter === 0) _done();
            });
          `
      default:
        break;
    }
    return code;
  }
}

module.exports = HookCodeFactory;
