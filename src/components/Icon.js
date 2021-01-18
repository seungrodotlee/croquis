import TemplateElement from "../util/TemplateElement.js";

class Icon extends TemplateElement {
  constructor() {
    super({
      template: `
        <span class="material-icons"></span>
      `,
      childHandler: (addedNode) => {
        if (addedNode.nodeType != Node.TEXT_NODE) {
          throw Error("Only text value can be a child of 'icon-'");
        }
        this.body.textContent = addedNode.nodeValue;
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
