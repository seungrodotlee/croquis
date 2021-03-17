import TemplateElement from "../util/TemplateElement.js";

class LettersWindow extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="letters-window">
        </div>
      `,
      templateHandler: () => {
        this.body.open = () => {
          let letterWindows = this.fromTemplateAll(".letter-window");

          letterWindows.forEach((w) => {
            w.classList.remove("closed");
          });
        };

        this.body.close = () => {
          let letterWindows = this.fromTemplateAll(".letter-window");

          letterWindows.forEach((w) => {
            w.classList.add("closed");
          });
        };
      },
      childHandler: (addedNode) => {
        if (!(addedNode instanceof Text))
          throw Error("only textNode can be child of letters-window!");

        console.log(addedNode);
        for (let i = 0; i < addedNode.length; i++) {
          let windowFrame = document.createElement("div");
          windowFrame.classList.add("letter-window-frame", "inline-blk");

          let letterWindow = document.createElement("span");
          letterWindow.classList.add("letter-window", "inline-blk", "closed");

          let data = addedNode.nodeValue[i];
          if (data === " ") {
            data = "&nbsp;";
          }

          letterWindow.innerHTML = data;

          windowFrame.appendChild(letterWindow);
          this.body.appendChild(windowFrame);
        }
      },
    });
  }
}

croquis.define("letters-window", LettersWindow);

export default LettersWindow;
