import TemplateElement from "../util/TemplateElement.js";

class Icon extends TemplateElement {
  constructor() {
    super({
      template: `
        <span class="material-icons"></span>
      `,
      childHandler: (addedNode) => {
        this.body.textContent = addedNode;
      },
      dataHandler: {
        name: (newVal) => {
          this.body.textContent = newVal;
        },
      },
    });
  }
}

croquis.define("icon-", Icon);

export default Icon;
