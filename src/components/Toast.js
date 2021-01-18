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
        this.content.appendChild(addedNode);
        croquis.attachElement(this.body, croquis._toastWrap, "appear-by-fade");
        //croquis._toastWrap.appendChild(this.body);
      },
    });
  }

  autoCloseAt(delay) {
    setTimeout(() => {
      //croquis._toastWrap.removeChild(this.body);
      croquis.removeElement(this.body, "hidden-by-fade");
    }, delay);
  }

  static newInstance(content) {
    let a = new Toast();
    document.body.appendChild(a);
    croquis.attachElement(a.body, croquis._toastWrap, "appear-by-fade");
    a.content.innerHTML = content;
    return a;
  }
}

croquis.newToast = (content, type = null) => {
  let t = Toast.newInstance(content);
  if (type != null) {
    t.body.classList.add(`${type}-bg`);
  }

  return t;
};

window.addEventListener("DOMContentLoaded", () => {
  // alertWrap DOM에 등록
  document.body.appendChild(croquis._toastWrap);
});

croquis.define("toast-", Toast);

export default Toast;
