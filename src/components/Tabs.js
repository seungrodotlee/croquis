import TemplateElement from "../TemplateElement.js";

export default class Tabs extends TemplateElement {
  constructor() {
    super({
      template: `
      <div class="tabpanel">
        <div class="tab-buttons flex">
        </div>
        <div class="tab-content">
        </div>
      </div>
      `,
      templateHandler: () => {
        this.buttons = this.fromTemplate(".tab-buttons");
        this.content = this.fromTemplate(".tab-content");
      },
      childHandler: (addedNode) => {
        this.content.appendChild(addedNode);
        let title = addedNode.getAttribute("data-title");
        let buttonEl = document.createElement("button");
        buttonEl.textContent = title;
        this.buttons.appendChild(buttonEl);

        if (addedNode.classList.contains("selected")) {
          this._current = addedNode;
        }

        buttonEl.addEventListener("click", () => {
          if (!addedNode.classList.contains("selected")) {
            addedNode.classList.add("selected");
            this._current.classList.remove("selected");
            this._current = addedNode;
          }
        });
      },
    });
  }
}
