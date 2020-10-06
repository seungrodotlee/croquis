// highway 객체와

export default function () {
  window.highway = window.highway || {};

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
    if (value == "" || value == null || value == undefined) {
      return true;
    } else {
      return false;
    }
  };

  highway._alertWrap = document.createElement("div");
  highway._alertWrap.classList.add("alert-wrap");

  HTMLElement.prototype.insertAfter = function (newNode) {
    let inserted = this.parentNode.insertBefore(newNode, this.nextSibling);

    return inserted;
  };

  String.prototype.toCamelCase = function () {
    return this.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  };

  Array.prototype.remove = function (el) {
    let index = this.indexOf(el);

    if (index != -1) {
      this.splice(index, 1);
    }

    return this;
  };
}
