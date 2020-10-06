import TemplateElement from "../TemplateElement.js";

export default class TopButton extends TemplateElement {
  constructor() {
    super({
      template: `
      <button class="top-button"></button>
      `,
      templateHandler: () => {
        this.body.addEventListener("click", () => {
          window.scrollTo(0, 0);
        });
      },
      childHandler: (addedNode) => {
        this.body.appendChild(addedNode);
      },
    });
  }
}
