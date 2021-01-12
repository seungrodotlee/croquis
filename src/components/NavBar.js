import TemplateElement from "../util/TemplateElement.js";

class NavBar extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="nav-bar">
          <div class="nav-bar-content container">
            <div class="nav-bar-left">
              <img class="nav-bar-logo"></img>
              <h2 class="nav-bar-title"></h2>
            </div>
            <div class="nav-bar-right">
            </div>
          </div>
        </div>
      `,
      templateHandler: () => {
        this._left = this.fromTemplate(".nav-bar-left");
        this._right = this.fromTemplate(".nav-bar-right");
        this._logoPlace = this.fromTemplate(".nav-bar-logo");
        this._head = this.fromTemplate(".nav-bar-title");
        this._parted = true;
        this._count = 0;
      },
      childHandler: (addedNode) => {
        if (this._count == 0) {
          addedNode.classList.add("nav-bar-left-inner");
          this._left.appendChild(addedNode);
        }

        if (this._count == 1) {
          addedNode.classList.add("nav-bar-right-inner");
          this._right.appendChild(addedNode);
        }

        this._count++;
      },
      dataHandler: {
        title: (newVal) => {
          this._head.textContent = newVal;
        },
        logo: (newVal) => {
          this._logoPlace.setAttribute("src", newVal);
        },
        parted: (newVal) => {
          newVal = JSON.parse(newVal);

          if (newVal) {
            if (!this._parted) {
              this.body.appendChild(this._right);
            }
          } else {
            this.body.removeChild(this._right);
          }

          this._parted = newVal;
        },
      },
    });
  }
}

croquis.define("nav-bar", NavBar);

export default NavBar;
