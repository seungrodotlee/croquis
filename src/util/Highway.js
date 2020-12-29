window.highway = window.highway || {};
window._highway = window._highway || {};

_highway.request = _highway.request || {};
_highway.proxys = _highway.proxys || {};

highway.bindRequest = (key, callback) => {
  console.log("bind req");
  if (highway[key] != undefined) {
    callback();
    return;
  }

  _highway.request[key] = _highway.request[key] || [];
  _highway.request[key].push(callback);
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

let highwayProxyHandler = {
  get: function (target, key, receiver) {
    if (key.indexOf(".") != -1) {
      let splited = key.split(".");

      let r = Reflect.get(target, splited[0], receiver);

      let inner = r;
      for (let i = 1; i < splited.length; i++) {
        inner = inner[splited[i]];
      }

      return inner;
    }

    let r = Reflect.get(target, key, receiver);
    if (typeof r == "object" && !highway.isElement(r)) {
      console.log("highway get");
      console.log("target", target);
      console.log("key", key);
      console.log(r);
      return new Proxy(r, highwayProxyHandler);
    } else {
      return Reflect.get(target, key, receiver);
    }
  },
  set: function (target, key, value, receiver) {
    console.log("highway set");
    console.log("target", target);
    console.log("key", key);

    console.log("req", _highway.request[key]);
    if (typeof value == "object" && !highway.isElement(value)) {
      if (!highway.isEmpty(_highway.request[key])) {
        console.log(_highway.request[key]);

        for (let c of _highway.request[key]) {
          setTimeout(() => {
            c();
          }, 1);
        }

        _highway.request[key] = [];
      }
    }

    let r = Reflect.set(target, key, value, receiver);

    console.log("proxys", _highway.proxys[key]);
    if (!highway.isEmpty(_highway.proxys[key])) {
      for (let p of _highway.proxys[key]) {
        console.log(p);
        let keys = Object.keys(value);
        for (let k of keys) {
          //p[k] = value[k];
          Reflect.set(p, k, value[k], receiver);
        }

        //p = Object.assign({}, value);
      }
    }

    return r;
  },
};

highway = new Proxy(highway, highwayProxyHandler);

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
