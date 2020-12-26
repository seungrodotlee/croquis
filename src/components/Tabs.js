import TemplateElement from "../Highway.js";

class Tabs extends TemplateElement {
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
          buttonEl.classList.add("selected");
          this._currentTrigger = buttonEl;
          this._current = addedNode;
        }

        buttonEl.addEventListener("click", () => {
          if (!addedNode.classList.contains("selected")) {
            this._currentTrigger.classList.remove("selected");
            buttonEl.classList.add("selected");
            this._currentTrigger = buttonEl;
            addedNode.classList.add("selected");
            this._current.classList.remove("selected");
            this._current = addedNode;
          }
        });
      },
    });
  }
}

highway.define("tabs-", Tabs);

export default Tabs;
