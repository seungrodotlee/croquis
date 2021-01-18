import TemplateElement from "../util/TemplateElement.js";

class Spacer extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="spacer"></div>
      `,
      dataHandler: {
        size: (newValue) => {
          let parent = this.body.parentElement;
          if (
            parent.classList.contains("flex") &&
            !parent.classList.contains("vertical")
          ) {
            this.body.setAttribute("style", `width: ${newValue}; height: 1px;`);
          } else {
            this.body.setAttribute("style", `height: ${newValue}; width: 1px;`);
          }
        },
      },
    });
  }
}

croquis.define("spacer-", Spacer);

export default Spacer;
