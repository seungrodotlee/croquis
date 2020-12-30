import TemplateElement from "./TemplateElement.js";

class HighwayObject extends Object {
  constructor(name, depth) {
    super();
    this.name = name;
    this.depth = depth;
    this.parent = null;
  }
}

window.highway = window.highway || new HighwayObject("highway", -1);
//window.highway = window.highway || {};
window._highway = window._highway || {};
_highway.dataMap = new Map();

highway.bindRequest = (key, callback) => {
  console.log("bind req");
  if (highway[key] != undefined) {
    callback();
    return;
  }

  // _highway.request[key] = _highway.request[key] || [];
  // _highway.request[key].push(callback);
};

highway.isElement = (obj) => {
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

highway.isEmpty = (value) => {
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

highway.isPrintable = (value) => {
  if (
    typeof value == "boolean" ||
    typeof value == "number" ||
    typeof value == "string"
  ) {
    return true;
  }

  return false;
};

highway.children = (node) => {
  let list = [];
  let length = node.childNodes.length;

  for (let child of node.childNodes) {
    if (!highway.isElement(child)) {
      child = child.nodeValue;
    }

    if (!highway.isEmpty(child)) {
      list.push(child);
    }
  }

  return list;
};

highway.define = (name, constructor) => {
  customElements.define(name, constructor);
};

highway.newComponent = function (
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
  console.log(arguments);
  let data = arguments[1];
  let C = class extends TemplateElement {
    constructor() {
      super(data);
    }
  };

  highway.define(name, C);
};
highway._toastWrap = document.createElement("div");
highway._toastWrap.classList.add("toast-wrap");

highway.textNodesUnder = function (el) {
  if (el.nodeType == Node.TEXT_NODE) {
    return [el];
  } else {
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
  }
};

highway.setCookie = (name, value, exp) => {
  var date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
};

highway.getCookie = (name) => {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
};

highway.getPath = (target) => {
  let path = "";
  let p = target;
  for (let i = target.depth; i > -1; i--) {
    if (path == "") {
      path = p.name;
    } else {
      path = p.name + "." + path;
    }

    p = p.parent;
  }

  return path;
};

let highwayBindingHandler = {
  get(target, key) {
    let r = Reflect.get(target, key);

    if (typeof r == "function" || highway.isElement(target[key])) {
      return r;
    }

    if (r instanceof HighwayObject && !("_data" in r)) {
      return r;
    }

    console.log("get ", key);

    let path = highway.getPath(target);

    console.log("path ", path);

    return r._data;
  },
  set(target, key, val) {
    if (typeof val == "function" || highway.isElement(val)) {
      return Reflect.set(target, key, val);
    }

    if (target instanceof HighwayObject) {
      if (val instanceof Object) {
        let keys = Object.keys(val);

        let prx = new HighwayObject(key, target.depth + 1);
        prx.parent = target;
        target[key] = new Proxy(prx, highwayBindingHandler);

        for (let k of keys) {
          target[key][k] = val[k];
        }

        return true;
      }

      console.log("set ", key);

      if (key in target) {
        console.log(`${key} exist in ${target.name}`);
        target[key]._data = val;
      } else {
        console.log(`${key} not exist in ${target}`);

        target[key] = new HighwayObject(key, target.depth + 1);
        target[key]._data = val;
        target[key].parent = target;

        let path = highway.getPath(target);

        console.log("path ", path);
        //_highway.dataMap(path, val);
      }

      return true;
    } else {
      return Reflect.set(target, key, val);
    }
  },
};

highway = new Proxy(highway, highwayBindingHandler);

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
