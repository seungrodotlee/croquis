import TemplateElement from "../TemplateElement.js";

export default class Collapse extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="collapse">
          <button class="collapse-trigger">toggle</button>
          <div class="collapse-content"></div>
        </div>
      `,
      templateHandler: () => {
        this.head = this.fromTemplate(".collapse-trigger");
        this.content = this.fromTemplate(".collapse-content");
        this._height = 0;
        this._headHeight = 0;
        this._contentHeight = 0;
        this._closed = false;

        this.head.addEventListener("click", () => {
          this.body.classList.toggle("closed");
          
          this.getSizes();

          if(this._closed) {
            this.body.setAttribute("style", `height: ${this._height}px`);
          } else {
            this.body.setAttribute("style", `height: ${this._headHeight}px`);
          }

          this._closed = !this._closed;
        });
      },
      childHandler: (addedNode) => {
        this.content.appendChild(addedNode);
        
        this.getSizes();

        if(this._closed) {
          this.body.setAttribute("style", `height: ${this._headHeight}px`);
        } else {
          this.body.setAttribute("style", `height: ${this._height}px`);
        }
      },
      dataHandler: {
        closed: (newValue) => {
          this._closed = newValue;
        },
        title: (newValue) => {
          this._title = newValue;
          this.head.textContent = newValue;
          this._height = this._headHeight + this._contentHeight;
          console.log("height = " + this._height);
        }
      }
    })
  }

  getSizes() {
    let contentStyles = window.getComputedStyle(this.content);
    this._contentHeight = Number(contentStyles.getPropertyValue("height").replace("px", ""));

    contentStyles = window.getComputedStyle(this.head);
    this._headHeight = Number(contentStyles.getPropertyValue("height").replace("px", ""));

    this._height = this._headHeight + this._contentHeight;
  }
};