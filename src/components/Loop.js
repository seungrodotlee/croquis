import TemplateElement from "../util/TemplateElement.js";

class Loop extends TemplateElement {
  constructor() {
    super({
      template: `<div class="loop"></div>`,
      templateHandler: () => {
        this._loopCount = 0;
        this._currentIdx = 0;
        this._position = this.body;
        this._valBind;
        this._keyBind;
        this._idxBind;
        this._bindedElements = [];
      },
      dataHandler: {
        for: (newVal) => {
          if (!isNaN(newVal)) {
            this._loopCount = parseInt(newVal);

            for (let i = 0; i < this._loopCount; i++) {
              for (let j = 0; j < this.__origins.length; j++) {
                let node = this.__origins[j].cloneNode(true);
                this._position.insertAfter(node);
                if (this._position == this.body) {
                  this.body.parentElement.removeChild(this.body);
                }
                this._position = node;
              }
            }

            return;
          }

          let regVarConf = "[a-zA-Z][0-9a-zA-Z]*";
          let beforeIn = `(?:${regVarConf})(?:\\,\\s*${regVarConf}){0,2}`;
          let reg = new RegExp(
            `^(${beforeIn})\\s+in\\s+(${regVarConf.replace("]*", "\\.]*")})$`
          );

          let matches = reg.exec(newVal);

          if (matches != null) {
            matches = matches.remove(newVal);
            let target = matches[1];

            if (!_croquis.dataMap.has(target)) {
              croquis[target] = {};
              this.data = croquis[target];
            } else {
              this.data = croquis[target];
            }

            this.data._loopTarget = this.data._loopTarget || [];
            this.data._loopTarget.push(this);

            let keysReg = new RegExp(
              `^(${regVarConf})(?:\\,\\s*(${regVarConf}))?(?:\\,\\s*(${regVarConf}))?$`
            );
            let keys = keysReg.exec(matches[0]).remove(matches[0]);

            ({ 0: this._valBind, 1: this._keyBind, 2: this._idxBind } = keys);

            let objKeys = Object.keys(Object.assign({}, this.data));
            let filtered = [];
            for (let k of objKeys) {
              if (k.indexOf("_") == -1) {
                filtered.push(k);
              }
            }

            objKeys = filtered;

            this._loopCount = objKeys.length;

            for (let i = this._currentIdx; i < this._loopCount; i++) {
              for (let j = 0; j < this.__origins.length; j++) {
                let el = this.__origins[j].cloneNode(true);

                this.registryBindingNodes(el);
              }
            }
          } else {
            console.error(
              "loop- 태그의 data-for 속성에는 숫자 혹은 'value, key, index in Object' 형식의 값이 들어가야 합니다.\n" +
                "hhttps://regex101.com/r/DLkNxW/1 에서 허용되는 값 형식을 확인하세요!"
            );
            return;
          }
        },
      },
    });
  }

  registryBindingNodes(el) {
    let elementNodes = el.querySelectorAll(":scope *");

    let textNodes = croquis.getTextNodesUnder(el);

    let reg = new RegExp(
      `${this.__bindBracket[0]}.+?${this.__bindBracket[1]}`,
      "g"
    );

    let objKeys = Object.keys(this.data);

    let filtered = [];
    for (let k of objKeys) {
      if (k.indexOf("_") == -1) {
        filtered.push(k);
      }
    }

    objKeys = filtered;

    let idx = this._currentIdx - this.data._removed;

    (() => {
      let id = el.getAttribute("id");

      if (id === null) return;

      let matchs = id.match(reg);

      if (matchs != null) {
        for (let target of matchs) {
          let targetValue = target
            .replace(this.__bindBracket[0], "")
            .replace(this.__bindBracket[1], "");

          if (targetValue == this._valBind) {
            id = id.replace(reg, this.data[objKeys[idx]]);
          }

          if (targetValue == this._keyBind) {
            id = id.replace(reg, objKeys[idx]);
          }

          if (targetValue == this._idxBind) {
            id = id.replace(reg, this._currentIdx);
          }

          el.setAttribute("id", id);
        }
      }
    })();

    for (let t of textNodes) {
      let value = t.nodeValue;
      let matches = value.match(reg);
      if (matches != null) {
        for (let target of matches) {
          let targetValue = target
            .replace(this.__bindBracket[0], "")
            .replace(this.__bindBracket[1], "");

          let cutted = "";

          if (t.nodeValue == target) {
            cutted = t;
          }

          if (t.nodeValue != target) {
            let s = t.nodeValue.indexOf(target);
            let e = t.nodeValue.indexOf(target) + target.length;

            t = t.splitText(s);
            cutted = t;
            t = t.splitText(e - s);
          }

          if (objKeys != 0) {
            if (targetValue == this._valBind) {
              cutted.nodeValue = this.data[objKeys[idx]];

              let path = this.data._name + "." + objKeys[idx];

              if (!("_target" in _croquis.origin.get(path))) {
                _croquis.origin.get(path)._target = [];
              }

              _croquis.origin.get(path)._target.push(cutted);
            }

            if (targetValue == this._keyBind) {
              cutted.nodeValue = objKeys[idx];
            }

            if (targetValue == this._idxBind) {
              cutted.nodeValue = this._currentIdx;
            }
          }

          // if (!(targetValue in this.data)) {
          //   this.data[targetValue] = "";
          //   cutted.nodeValue = "";
          // } else {
          //   cutted.nodeValue = this.data[targetValue];
          // }
        }
      }
    }

    this._bindedElements.push(el);
    this._position.insertAfter(el);
    this._position = el;

    this._currentIdx++;
  }
}

croquis.define("loop-", Loop);

export default Loop;
