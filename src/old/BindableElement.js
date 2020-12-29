import TemplateElement from "../util/TemplateElement.js";

class BindableElement extends TemplateElement {
  constructor({
    template = "",
    templateHandler = () => {},
    childHandler = () => {},
    dataHandler = {},
    bindBracket = "{}",
    bind = {},
  }) {
    super({
      template,
      templateHandler,
      childHandler,
      dataHandler,
    });

    this.__bindTargetNodes = {};
    this.__bindKeyTargetNodesOrigin = [];
    this.__bindBracket = bindBracket;
    this.__bind = bind;
    this.__keys = [];
    this._temp = [];
    this.bindKey = "key";
    this.bindVal = "val";
    this.kIdx = 0;
    this.vIdx = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    let me = this;

    let bindHandler = {
      deleteProperty: function (target, prop) {
        if (prop in target) {
          console.log(prop);
          console.log(me.__bindTargetNodes);
          delete target[prop];
        }
      },
      get: function (target, key, receiver) {
        console.log("get");
        if (typeof target[key] === "object" && target[key] !== null) {
          return new Proxy(target[key], bindHandler);
        } else {
          return Reflect.get(target, key, receiver);
        }
      },
      set: function (target, key, value, receiver) {
        console.log("set");
        console.log("target ", target);
        console.log("key ", key);
        console.log("val", value);
        console.log(me.__bindTargetNodes);

        me.__keys.push(key);
        let r = Reflect.set(target, key, value, receiver);
        //let g = Reflect.get(target, key, receiver);
        console.log("r", r);

        if (r && me.body.classList.contains("loop")) {
          let f = me.body.dataset.for;
          me.body.dataset.for = f;
        }

        if (!highway.isEmpty(me.__bindTargetNodes[key])) {
          for (let n of me.__bindTargetNodes[key]) {
            n.nodeValue = value;
          }
        }

        // if (!highway.isEmpty(me.__bindTargetNodes[me.bindKey])) {
        //   for (let n of me.__bindTargetNodes[me.bindKey]) {
        //     n.nodeValue = value;
        //   }
        // }

        if (!highway.isEmpty(me.__bindTargetNodes[me.bindVal])) {
          console.log("nodes", me.__bindTargetNodes[me.bindVal]);
          let idx = me.__keys.indexOf(key);
          let n = me.__bindTargetNodes[me.bindVal][idx];
          n.nodeValue = value;
        }

        return r;
      },
    };

    this.__bindHandler = bindHandler;

    this.body.data = new Proxy(this.__bind, bindHandler);

    this.body.setBindTarget = function (newVal) {
      let keys = Object.keys(newVal);
      console.log(keys);
      for (let key of keys) {
        //me.__bindTargetNodes[key].nodeValue = newVal[key];
        for (let n of me.__bindTargetNodes[key]) {
          n.nodeValue = newVal[key];
        }
      }

      newVal = new Proxy(me.__bind, bindHandler);
      me.__bindTarget = newVal;
      return newVal;
    };

    const attrObserver = new MutationObserver(this.attrCallback.bind(this));
    attrObserver.observe(this.body, { attributes: true });
  }

  registryChildren(children) {
    for (let addedNode of children) {
      console.log("push to temp");
      this._temp.push(addedNode);
    }

    console.log(this._temp);

    super.registryChildren(children);
  }

  attrCallback(mutationsList, observer) {
    for (let mutation of mutationsList) {
      let attrName = mutation.attributeName;

      if (attrName == "data-bind-target") {
        console.log("data binding");
        let newVal = mutation.target.getAttribute(attrName);
        //highway[newVal] = new Proxy(this.__bind, handler);

        _highway.proxys[newVal] = _highway.proxys[newVal] || [];
        let p = null;
        if (!highway.isEmpty(highway[newVal])) {
          let keys = Object.keys(highway[newVal]);
          console.log(keys);
          console.log(this._temp);

          for (let key of keys) {
            this.__bind[key] = highway[newVal][key];
          }

          console.log(this.__bind);

          p = this.registryTargetNodes(this._temp, this.__bind);
          _highway.proxys[newVal].push(p);

          for (let key of keys) {
            if (highway.isEmpty(this.__bindTargetNodes[key])) {
              continue;
            }
            //this.__bindTargetNodes[key].nodeValue = highway[newVal][key];
            console.log(this.__bindTargetNodes);
            for (let n of this.__bindTargetNodes[key]) {
              if (highway.isPrintable(highway[newVal][key]))
                n.nodeValue = highway[newVal][key];
            }
          }
        } else {
          p = this.registryTargetNodes(this._temp, this.__bind);
          _highway.proxys[newVal].push(p);
        }

        // highway.bindRequest(newVal, () => {
        //   let p = null;
        //   let keys = Object.keys(highway[newVal]);
        //   console.log(keys);
        //   console.log(this._temp);

        //   for (let key of keys) {
        //     this.__bind[key] = highway[newVal][key];
        //   }

        //   console.log(this.__bind);

        //   p = this.registryTargetNodes(this._temp, this.__bind);
        //

        //   for (let key of keys) {
        //     if (highway.isEmpty(this.__bindTargetNodes[key])) {
        //       continue;
        //     }
        //     //this.__bindTargetNodes[key].nodeValue = highway[newVal][key];
        //     console.log(this.__bindTargetNodes);
        //     for (let n of this.__bindTargetNodes[key]) {
        //       if (highway.isPrintable(highway[newVal][key]))
        //         n.nodeValue = highway[newVal][key];
        //     }
        //   }
        // });

        return;
      }

      super.attrCallback(mutationsList, observer);
    }
  }

  registryTargetNodes(elements, bindObj) {
    //if (Object.keys(bindObj).length == 0) return;

    this.__bindTarget = bindObj;

    console.log("start registry");
    console.log(bindObj);
    console.log(elements);

    //let idx = -1;
    elements.forEach((el) => {
      // idx++;
      // console.log(idx);
      // console.log(this.kIdx);

      // if (idx < this.kIdx * elements.length) {
      //   console.log("continue");
      //   return;
      // }

      let texts = highway.textNodesUnder(el);

      console.log(texts);

      texts.forEach((t) => {
        this.registryTargetNodeEach(t);
      });
    });

    console.log("registry complete", this.__bindTargetNodes);

    if (Object.keys(bindObj).length != 0) {
      let keys = Object.keys(bindObj);
      for (let key of keys) {
        this.__bind[key] = bindObj[key];
      }
    }

    return new Proxy(this.__bind, this.__bindHandler);
  }

  registryTargetNodeEach(t) {
    console.log("start reg new node");
    let val = t.nodeValue;

    let pos = 0;
    let startBracketPosList = [];
    while (true) {
      let foundPos = val.indexOf(this.__bindBracket[0], pos);

      if (foundPos == -1) break;

      startBracketPosList.push(foundPos);
      pos = foundPos + 1;
    }

    pos = 0;
    let endBracketPosList = [];
    while (true) {
      let foundPos = val.indexOf(this.__bindBracket[1], pos);

      if (foundPos == -1) break;

      endBracketPosList.push(foundPos);
      pos = foundPos + 1;
    }

    let reg = new RegExp(
      `(?<=${this.__bindBracket[0]}).+?(?=${this.__bindBracket[1]})`
    );

    let vars = Object.keys(this.__bindTarget);
    console.log(vars);

    if (reg.test(t.nodeValue)) {
      // let selector = t.nodeValue
      //   .replace("{", "")
      //   .replace("}", "")
      //   .replace(/ /g, "");

      let sp = 0;
      let ep = 0;
      while (true) {
        let val = t.nodeValue;
        sp = val.indexOf(this.__bindBracket[0]);
        ep = val.indexOf(this.__bindBracket[1]);

        if (sp == -1 || ep == -1) break;

        if (sp != -1) {
          console.log("sp ", sp);
          console.log("cut from ", t.nodeValue);
          t = t.splitText(sp);
          console.log("cut s bracket: " + t);

          if (ep != -1) {
            console.log("ep ", ep);
            let r = t.splitText(ep - sp + 1);
            console.log(t.nodeValue);
            console.log(r.nodeValue);

            console.log("emp? ", highway.isEmpty(t));
            if (highway.isEmpty(t)) continue;

            console.log("reg ", t.nodeValue);

            let selector = t.nodeValue
              .replace("{", "")
              .replace("}", "")
              .replace(/ /g, "");

            this.__bindTargetNodes[selector] =
              this.__bindTargetNodes[selector] || [];

            if (selector == this.bindKey) {
              if (vars.length != 0) {
                console.log("bind key", vars[this.kIdx]);
                t.nodeValue = vars[this.kIdx];
              } else {
                t.nodeValue = "";
              }

              this.kIdx++;
            } else if (selector == this.bindVal) {
              if (vars.length != 0) {
                let val = this.__bindTarget[vars[this.vIdx]];
                if (highway.isPrintable(val)) {
                  this.__bindKeyTargetNodesOrigin.push(t.nodeValue);
                  console.log("bind val", val);
                  t.nodeValue = val;
                  this.vIdx++;
                }
              } else {
                t.nodeValue = "";
              }
            } else if (!highway.isEmpty(this.__bindTargetNodes[selector])) {
              console.log("val = ", this.__bindTarget[selector]);
              t.nodeValue = this.__bindTarget[selector];
            }

            this.__bindTargetNodes[selector].push(t);

            console.log("reg[" + selector + "] success: ", t.nodeValue);

            t = r;
          }
        }
      }
    }
  }
}

export default BindableElement;
