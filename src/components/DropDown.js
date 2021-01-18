import TemplateElement from "../util/TemplateElement.js";

class DropDown extends TemplateElement {
  constructor() {
    super({
      template: `
      <div class="dropdown">
        <button class="dropdown-head icon-btn">
          <span class="title">눌러서 선택</span>
          <span class="material-icons"> keyboard_arrow_down </span>
        </button>
        <div class="dropdown-content">
          <div style="padding: 0.25em; line-height: 1.5; pointer-events: none">&nbsp;</div>
          <hr style="margin-top: 0;">
        </div>
      </div>
      `,
      templateHandler: () => {
        this.head = this.fromTemplate(".dropdown-head .title");
        this.content = this.fromTemplate(".dropdown-content");
        this._callbackMap = new Map();
        this._current = null;

        this.body.addEventListener("click", () => {
          this.body.classList.toggle("active");
        });

        this.body.getSelected = () => {
          if (this._current == null) return null;
          if (!croquis.isEmpty(this._current.dataset.title))
            return this._current.dataset.title;
          return this._current.textContent;
        };

        this.body.addSelectEventListener = (callback) => {
          let buttons = this.fromTemplateAll(".dropdown-content > div");

          let callbacks = [];
          buttons.forEach((b) => {
            let c = (e) => {
              callback(e, b);
            };
            b.addEventListener("click", c);
            callbacks.push(c);
          });

          this._callbackMap.set(callback, callbacks);
        };

        this.body.removeSelectEventListener = (callback) => {
          let callbacks = this._callbackMap.get(callback);
          let buttons = this.fromTemplateAll(".dropdown-content > div");

          for (let i in callbacks) {
            let c = callbacks[i];
            let b = buttons[i];

            b.removeEventListener(c);
          }

          this._callbackMap.delete(callback);
        };
      },
      childHandler: (addedNode) => {
        addedNode.addEventListener("click", () => {
          if (this._current != null) {
            this._current.classList.remove("selected");
          }

          addedNode.classList.toggle("selected");

          this._current = addedNode;
          if (!this._title) {
            this.head.textContent = addedNode.textContent;
          }
        });

        this.content.appendChild(addedNode);

        if (addedNode.classList.contains("selected")) {
          if (!this._title) {
            this.head.textContent = addedNode.textContent;
          }

          this._current = addedNode;
        }
      },
      dataHandler: {
        title: (newVal) => {
          this.head.textContent = newVal;
          this._title = newVal;
        },
      },
    });
  }

  setMenus(elements) {
    this.content.innerHTML = "";
    this._current = null;
    elements.forEach((el) => {
      this.__childHandler(el);
    });
  }
}

croquis.define("drop-down", DropDown);

export default DropDown;
