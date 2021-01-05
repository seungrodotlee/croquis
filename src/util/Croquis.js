import TemplateElement from "./TemplateElement.js";

class CroquisObject extends Object {
  constructor(name, depth) {
    super();
    this._name = name;
    this._depth = depth;
    this._parent = null;
    this._removed = 0;
  }
}

window.croquis = window.croquis || new CroquisObject("croquis", -1);
//window.croquis = window.croquis || {};
window._croquis = window._croquis || {};
_croquis.dataMap = new Map();
_croquis.origin = new Map();
_croquis.proxys = new Map();

croquis.bindRequest = (key, callback) => {
  console.log("bind req");
  if (croquis[key] != undefined) {
    callback();
    return;
  }

  // _croquis.request[key] = _croquis.request[key] || [];
  // _croquis.request[key].push(callback);
};

croquis.isElement = (obj) => {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    );
  }
};

croquis.isEmpty = (value) => {
  if (typeof value == "string") {
    if (value.trim() == "") {
      return true;
    }
  }

  if (value instanceof Object) {
    let keys = Object.keys(value);

    if (keys.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  if (value == "" || value == null || value == undefined) {
    return true;
  } else {
    return false;
  }
};

croquis.isPrintable = (value) => {
  if (
    typeof value == "boolean" ||
    typeof value == "number" ||
    typeof value == "string"
  ) {
    return true;
  }

  return false;
};

croquis.children = (node) => {
  let list = [];
  let length = node.childNodes.length;

  for (let child of node.childNodes) {
    if (!croquis.isElement(child)) {
      child = child.nodeValue;
    }

    if (!croquis.isEmpty(child)) {
      list.push(child);
    }
  }

  return list;
};

croquis.define = (name, constructor) => {
  customElements.define(name, constructor);
};

croquis.newComponent = function (
  name,
  {
    template = "",
    templateHandler = () => {},
    childHandler = () => {},
    dataHandler = {},
    bindBracket = "{}",
    bind = {},
  }
) {
  let data = arguments[1];
  let C = class extends TemplateElement {
    constructor() {
      super(data);
    }
  };

  croquis.define(name, C);
};
croquis._toastWrap = document.createElement("div");
croquis._toastWrap.classList.add("toast-wrap");

croquis.getTextNodesUnder = function (el) {
  if (el instanceof HTMLElement) {
    let n,
      a = [],
      nodeltr = document.createNodeIterator(
        el,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

    while ((n = nodeltr.nextNode())) a.push(n);
    return a;
  } else if (el.nodeType == Node.TEXT_NODE) {
    return [el];
  }
};

croquis.setCookie = (name, value, exp) => {
  var date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
};

croquis.getCookie = (name) => {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
};

croquis.getPath = (target) => {
  let path = "";
  let p = target;
  for (let i = target._depth; i > -1; i--) {
    if (path == "") {
      path = p._name;
    } else {
      path = p._name + "." + path;
    }

    p = p._parent;
  }

  return path;
};

let croquisBindingHandler = {
  deleteProperty(target, key) {
    if ("_loopTarget" in target) {
      let keys = Object.keys(target);

      let filtered = [];
      for (let k of keys) {
        if (k.indexOf("_") == -1) {
          filtered.push(k);
        }
      }

      keys = filtered;

      console.log("prop ", key);

      let idx = keys.indexOf(key);

      let loops = target._loopTarget;

      console.log("idx ", idx);
      for (let loop of loops) {
        for (let i = 0; i < loop.__origins.length; i++) {
          console.log(loop._bindedElements[idx].innerHTML);
          let el = loop._bindedElements[idx];
          console.log(el.parentElement);
          el.parentElement.removeChild(el);
        }
      }
    }

    target._removed++;
    delete target[key];

    return true;
  },
  get(target, key) {
    let r = Reflect.get(target, key);

    if (target instanceof CroquisObject && !("_data" in target)) {
      if (key.indexOf("_") != -1) {
        return r;
      }
    }

    if (r == undefined) {
      return undefined;
    }

    if (typeof r == "function" || croquis.isElement(target[key])) {
      return r;
    }

    if (r instanceof CroquisObject && !("_data" in r)) {
      let path = croquis.getPath(r);
      return _croquis.proxys.get(path);
    }

    console.log("get ", key);

    let path = croquis.getPath(target);

    console.log("path ", path);

    return r._data;
  },
  set(target, key, val) {
    if (typeof val == "function" || croquis.isElement(val)) {
      return Reflect.set(target, key, val);
    }

    if (key.indexOf("_") != -1) {
      return Reflect.set(target, key, val);
    }

    if (target instanceof CroquisObject) {
      if (key.indexOf(".") != -1) {
        let p = key.split(".");
        console.log("pieces", p);

        let inner = target;
        let path = p[0];
        for (let i = 0; i < p.length - 1; i++) {
          let k = p[i];
          console.log(k);
          if (i != 0) {
            path = path + "." + k;
          }

          if (!(k in inner)) {
            inner[k] = new CroquisObject(k, inner._depth + 1);
            inner[k]._parent = inner;
            _croquis.origin.set(path, inner[k]);
            _croquis.proxys.set(
              path,
              new Proxy(inner[k], croquisBindingHandler)
            );
          }

          inner = inner[k];
        }

        target = inner;
        key = p[p.length - 1];
      }

      if (val instanceof Object) {
        let keys = Object.keys(val);

        if (!(key in target)) {
          target[key] = new CroquisObject(key, target._depth + 1);
          target[key]._parent = target;
        }

        for (let k of keys) {
          //target[key][k] = val[k];
          let path = croquis.getPath(target);
          if (path == "") {
            path = key + "." + k;
          } else {
            path = path + "." + key + "." + k;
          }

          console.log(path);

          croquis[path] = val[k];
        }

        let path = croquis.getPath(target[key]);
        _croquis.origin.set(path, target[key]);
        _croquis.proxys.set(
          path,
          new Proxy(target[key], croquisBindingHandler)
        );

        return true;
      }

      console.log("set ", key);
      console.log(target);

      let flag = false;
      if (key in target) {
        console.log(`${key} exist in ${target._name}`);
        console.log(_croquis.origin.get(croquis.getPath(target) + "." + key));
        target[key]._data = val;

        if ("_target" in target[key]) {
          for (let t of target[key]._target) {
            t.nodeValue = val;
          }
        }
      } else {
        flag = true;
        console.log(`${key} not exist in ${target}`);

        target[key] = new CroquisObject(key, target._depth + 1);
        target[key]._data = val;
        target[key]._parent = target;
      }

      let path = croquis.getPath(target[key]);
      _croquis.dataMap.set(path, target[key]._data);
      console.log(path, target[key]);
      _croquis.origin.set(path, target[key]);

      if (flag && "_loopTarget" in target) {
        console.log("loop");
        let loops = target._loopTarget;

        for (let loop of loops) {
          for (let i = 0; i < loop.__origins.length; i++) {
            let el = loop.__origins[i].cloneNode(true);

            loop.registryBindingNodes(el);
          }
        }
      }

      return true;
    } else {
      return Reflect.set(target, key, val);
    }
  },
};

croquis = new Proxy(croquis, croquisBindingHandler);

Object.prototype.equals = function (x) {
  // 인자값의 Type이 object가 아닐경우 false를 리턴한다.
  if (typeof x !== "object") return false;
  // Type을 String으로 변환한다.
  var arr1 = JSON.stringify(this);
  var arr2 = JSON.stringify(x);

  return arr1 === arr2;
};

Node.prototype.insertAfter = function (newNode) {
  let inserted = this.parentElement.insertBefore(newNode, this.nextSibling);

  return inserted;
};

HTMLElement.prototype.copyAttrsTo = function (target) {
  for (let attr of this.attributes) {
    if (attr.name == "class") {
      continue;
    }
    target.setAttribute(attr.name, attr.value);
  }

  for (let i = 0; i < this.classList.length; i++) {
    if (!target.classList.contains(this.classList[i])) {
      target.classList.add(this.classList[i]);
    }
  }
};

String.prototype.toCamelCase = function () {
  return this.replace(/-([a-z0-9+])/g, function (g) {
    let reg = /^[a-z]/g;
    if (reg.test(g[1])) {
      return g[1].toUpperCase();
    } else {
      return g[1];
    }
  });
};

Array.prototype.remove = function (el) {
  let index = this.indexOf(el);

  if (index != -1) {
    this.splice(index, 1);
  }

  return this;
};
