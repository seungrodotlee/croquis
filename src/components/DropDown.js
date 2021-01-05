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
        <div class="dropdown-content box-shadow-s">
        </div>
      </div>
      `,
      templateHandler: () => {
        this.head = this.fromTemplate(".dropdown-head .title");
        this.content = this.fromTemplate(".dropdown-content");

        this.body.addEventListener("click", () => {
          this.body.classList.toggle("active");
        });
      },
      childHandler: (addedNode) => {
        addedNode.addEventListener("click", () => {
          this._current.classList.remove("selected");
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

    this._current = null;
  }
}

croquis.define("drop-down", DropDown);

export default DropDown;
