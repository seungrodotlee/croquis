import "@webcomponents/custom-elements";

window.highway = window.highway || {};
window._highway = window._highway || {};

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
      console.log(r);
      return new Proxy(r, highwayProxyHandler);
    } else {
      return Reflect.get(target, key, receiver);
    }
  },
  set: function (target, key, value, receiver) {
    let r = Reflect.set(target, key, value, receiver);
    if (typeof value == "object" && !highway.isElement(value)) {
      console.log("highway set");

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

    return r;
  },
};

highway = new Proxy(highway, highwayProxyHandler);

highway.bindRequest = (key, callback) => {
  if (highway[key] != undefined) {
    callback();
    return;
  }

  _highway.request = _highway.request || {};
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

Node.prototype.insertAfter = function (newNode) {
  let inserted = this.parentElement.insertBefore(newNode, this.nextSibling);

  return inserted;
};

// HTMLElement.prototype.insertAfter = function (newNode) {
//   let inserted = this.parentElement.insertBefore(newNode, this.nextSibling);

//   return inserted;
// };

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

// 템플릿 요소들의 부모 클래스 역할을 하는 TemplateElement 클래스

// 용어 정리
// 커스텀 요소: 사용자가 템플릿 요소를 생성하기 위해 직접 HTML에 입력한 요소 (ex. <drop-down> ... </drop-down>) ( = this )
// 템플릿 요소: 사용자가 입력한 데이터를 바탕으로 최종적으로 생성된 요소 (ex. <div class="drop-down"> ... </div>) ( = this.body )
class TemplateElement extends HTMLElement {
  // 생성자 파라미터로 아래 4개 멤버를 가진 객체를 받는다.
  // template:
  // 템플릿 요소가 생성할 요소의 HTML 구조를 나타낸다.
  // templateHandler:
  // 템플릿을 바탕으로 DOM에 등록된 요소(this.body)의 하위 요소들을 변수화 시키거나,
  // 후에 다른 핸들러에서 사용하기 위한 데이터를 선언한다.
  // childHandler:
  // 커스텀 요소의 자식 요소들이 각각 DOM에 등록될 때 실행되는 메소드
  // 등록된 자식요소 각각을 나타내는 addedNode를 파라미터로 받아 처리한다.
  // dataHandler:
  // data-* 속성에 대해 처리하는 메소드들의 집합 객체.
  // 예를들어, data-title 속성값에 대한 처리는 title이라는 이름의 메소드로 처리한다.
  constructor({
    template = "",
    templateHandler = () => {},
    childHandler = () => {},
    dataHandler = {},
    bindBracket = "{}",
    bind = {},
  } = {}) {
    super();

    // 입력받은 파라미터들을 멤버로 등록한다.
    this.__template = template;
    this.__templateHandler = templateHandler;
    this.__childHandler = childHandler;
    this.__dataHandler = dataHandler;
    this.__bindBracket = bindBracket;
    this.__bind = bind;
    this.__bindTarget = {};
    this.__called = false;

    // data-* 속성들의 속성명을 배열로 저장
    this.__datas = Object.keys(dataHandler);

    for (let i = 0; i < this.__datas.length; i++) {
      let val = this.__datas[i];
      this[`_${val}`] = "";
      this.__datas[i] = `data-${val}`;
    }
  }

  // data-* 속성이 등록/수정될 때마다 해당 속성에 대한 dataHandler를 호출
  setAttr(val, newVal) {
    val = val.replace("data-", "");
    this[`_${val}`] = newVal;
    this.__dataHandler[val](newVal);
  }

  // 커스텀 요소가 DOM에 등록되었을 때 호출되는 메소드
  connectedCallback() {
    if (this.__called) return;
    this.__called = true;
    let me = this;
    // 커스텀 요소 바로 뒤에 템플릿 요소(this.body)를 등록
    let temp = document.createElement("div");
    temp.innerHTML = this.__template;
    temp = temp.firstElementChild;
    this.body = this.insertAfter(temp);

    this.__bindTargetNodes = {};

    let handler = {
      get: function (target, key, receiver) {
        console.log("get");
        if (typeof target[key] === "object" && target[key] !== null) {
          return new Proxy(target[key], handler);
        } else {
          return Reflect.get(target, key, receiver);
        }
      },
      set: function (target, key, value, receiver) {
        console.log("set");
        //me.__bindTargetNodes[key].nodeValue = value;
        for (let n of me.__bindTargetNodes[key]) {
          n.nodeValue = value;
        }
        target[key] = value;
        return Reflect.set(target, key, value, receiver);
      },
    };

    this.__bindHandler = handler;

    this.body.data = new Proxy(this.__bind, handler);

    this.body.setBindTarget = function (newVal) {
      let keys = Object.keys(newVal);
      console.log(keys);
      for (let key of keys) {
        //me.__bindTargetNodes[key].nodeValue = newVal[key];
        for (let n of me.__bindTargetNodes[key]) {
          n.nodeValue = newVal[key];
        }
        me.__bind[key] = newVal[key];
      }

      newVal = new Proxy(me.__bind, handler);
      me.__bindTarget = newVal;
      return newVal;
    };

    let elements = this.fromTemplateAll("*");
    this.registryTargetNodes(elements, this.__bind);

    // templateHandler 호출
    this.__templateHandler();

    // 커스텀 요소 하위 노드들이 DOM에 등록될 때 실행되는 콜백
    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        let addedNode = mutation.addedNodes[0];

        // 추가된 노드가 공백, undefined 등 빈 요소일 경우 거름
        if (highway.isEmpty(addedNode)) {
          continue;
        }

        // 추가된 노드가 HTML 요소이거나, 공백이 아닌 텍스트인 경우
        // childHandler를 실행
        if (
          highway.isElement(addedNode) ||
          !highway.isEmpty(addedNode.data.replace(/(\s*)/g, ""))
        ) {
          this.__childHandler(addedNode);
        }
      }
    };

    // 콜백을 가지고 observer 등록
    // 이제 this의 childList에 변화가 있을 때마다 callback이 실행됩니다.
    const observer = new MutationObserver(callback);
    observer.observe(this, { childList: true });

    // this.body 속성에 변화가 있을 때 실행될 콜백
    const attrCallback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        let attrName = mutation.attributeName;

        // data-* 속성만 감지하여 dataHandler 실행 (setAttr 메소드 내에서)
        if (attrName.indexOf("data-") != -1) {
          let newVal = mutation.target.getAttribute(attrName);

          if (attrName == "data-bind-target") {
            let keys = Object.keys(highway[newVal]);

            for (let key of keys) {
              //this.__bindTargetNodes[key].nodeValue = highway[newVal][key];
              for (let n of this.__bindTargetNodes[key]) {
                n.nodeValue = highway[newVal][key];
              }
              this.__bind[key] = highway[newVal][key];
            }

            highway[newVal] = new Proxy(this.__bind, handler);

            return;
          }

          this[`_${attrName.replace("data-", "")}`] = newVal;
          this.setAttr(attrName, newVal);
        }
      }
    };

    // observer 등록
    const attrObserver = new MutationObserver(attrCallback);
    attrObserver.observe(this.body, { attributes: true });

    // connectedCallback 호출 시기가 this의 자식 요소들이 DOM에 등록되는 시점보다 늦는 오류가 아주 가끔 발생한다.
    // 그 때를 대비해 자식노드가 존재할 경우 callback의 실행 내용을 실행하는 코드
    let children = this.childNodes;

    for (let i = 0; i < children.length; i++) {
      let addedNode = children[i];

      if (highway.isEmpty(addedNode)) {
        continue;
      }

      if (
        highway.isElement(addedNode) ||
        !highway.isEmpty(addedNode.data.replace(/(\s*)/g, ""))
      ) {
        this.__childHandler(addedNode);
      }
    }

    // 커스텀 요소의 속성들 템플릿 요소로 모두 복사
    this.copyAttrsTo(this.body);

    this.body.classList.remove("_hidden");

    // 템플릿 요소를 highway 객체에 등록
    // 등록될 때는 카멜케이스로 변환되어 등록된다 ( some-el => someEl )
    if (this.getAttribute("id")) {
      window.highway[this.getAttribute("id").toCamelCase()] = this.body;
    }

    // 커스텀 요소를 DOM에서 제거
    this.parentElement.removeChild(this);
  }

  fromTemplate(query) {
    return this.body.querySelector(query);
  }

  fromTemplateAll(query) {
    return this.body.querySelectorAll(query);
  }

  registryTargetNodes(elements, bindObj) {
    if (Object.keys(bindObj).length == 0) return;

    console.log("start registry");
    console.log(bindObj);

    let vars = Object.keys(bindObj);
    console.log(vars);

    let reg = new RegExp(
      `(?<=${this.__bindBracket[0]}).+?(?=${this.__bindBracket[1]})`
    );

    elements.forEach((el) => {
      let texts = [];

      el.childNodes.forEach((node) => {
        if (!highway.isElement(node) && !highway.isEmpty(node)) {
          texts.push(node);
        }
      });

      texts.forEach((t) => {
        if (reg.test(t.nodeValue)) {
          let selector = t.nodeValue
            .replace("{", "")
            .replace("}", "")
            .replace(/ /g, "");

          if (!highway.isEmpty(bindObj[selector])) {
            console.log("val = ", bindObj[selector]);
            t.nodeValue = bindObj[selector];
            this.__bindTargetNodes[selector] =
              this.__bindTargetNodes[selector] || [];
            this.__bindTargetNodes[selector].push(t);
          }
        }
      });
    });

    console.log("registry complete", this.__bindTargetNodes);

    return new Proxy(this.__bind, this.__bindHandler);
  }
}

export default TemplateElement;
