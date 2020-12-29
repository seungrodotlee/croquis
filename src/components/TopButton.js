import TemplateElement from "../old/BindableElement.js";

class TopButton extends TemplateElement {
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

highway.define("top-button", TopButton);

export default TopButton;
