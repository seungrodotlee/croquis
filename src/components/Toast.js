import TemplateElement from "../util/TemplateElement.js";

class Toast extends TemplateElement {
  constructor() {
    super({
      template: `
      <div class="toast box-shadow-s">
        <span class="toast-content"></span>
        <button class="close-toast-btn material-icons">close</button>
      </div>
      `,
      templateHandler: () => {
        this.content = this.fromTemplate(".toast-content");
        this.closeBtn = this.fromTemplate(".close-toast-btn");
        this.closeBtn.addEventListener("click", () => {
          let parent = this.body.parentElement;
          parent.removeChild(this.body);
        });
      },
      childHandler: (addedNode) => {
        console.log("?");
        this.content.appendChild(addedNode);
        highway._toastWrap.appendChild(this.body);
      },
    });
  }

  static newInstance(content) {
    let a = new Toast();
    document.body.appendChild(a);
    a.innerHTML = content;
  }
}

highway.newToast = (content) => {
  Alert.newInstance(content);
};

window.addEventListener("DOMContentLoaded", () => {
  // alertWrap DOM에 등록
  document.body.appendChild(highway._toastWrap);
});

highway.define("toast-", Toast);

export default Toast;
