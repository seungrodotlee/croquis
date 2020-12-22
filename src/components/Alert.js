import TemplateElement from "../util/Highway.js";

export default class Alert extends TemplateElement {
  constructor() {
    super({
      template: `
      <div class="alert box-shadow-s">
        <span class="alert-content"></span>
        <button class="material-icons">close</button>
      </div>
      `,
      templateHandler: () => {
        this.content = this.fromTemplate(".alert-content");
        this.closeBtn = this.fromTemplate(".alert > .material-icons");
        this.closeBtn.addEventListener("click", () => {
          let parent = this.body.parentElement;
          parent.removeChild(this.body);
        });
      },
      childHandler: (addedNode) => {
        this.content.appendChild(addedNode);
        highway._alertWrap.appendChild(this.body);
      },
    });
  }

  static newInstance(content) {
    let a = new Alert();
    document.body.appendChild(a);
    a.innerHTML = content;
  }
}

highway.newAlert = (content) => {
  Alert.newInstance(content);
};
