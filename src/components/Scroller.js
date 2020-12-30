import TemplateElement from "../util/TemplateElement.js";

class Scroller extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="scroller">
          <button class="scroller-prev-btn">
            <span class="material-icons">keyboard_arrow_left</span>
          </button>
          <button class="scroller-next-btn">
            <span class="material-icons">keyboard_arrow_right</span>
          </button>
          <div class="scroller-content"></div>
        </div>
      `,
      templateHandler: () => {
        this.prevBtn = this.fromTemplate(".scroller-prev-btn");
        this.nextBtn = this.fromTemplate(".scroller-next-btn");
        this.content = this.fromTemplate(".scroller-content");

        this.current = 0;
        this.length = 0;
        this.pages = [];
        this.delay = 3000;

        this.prevBtn.addEventListener("click", () => {
          if (this.current != 0) {
            this.pages[this.current].classList.remove("current");
            this.current--;
            this.pages[this.current].classList.add("current");
          }
        });

        this.nextBtn.addEventListener("click", () => {
          if (this.current + 1 < this.length) {
            this.pages[this.current].classList.remove("current");
            this.current++;
            this.pages[this.current].classList.add("current");
          }
        });

        this.body.applyRatio = this.applyRatio;

        window.addEventListener("resize", () => {
          this.applyRatio();
        });
      },
      childHandler: (addedNode) => {
        if (this.length == 0) {
          addedNode.classList.add("current");
        }

        this.pages[this.length] = addedNode;
        this.content.appendChild(addedNode);

        this.length++;
      },
      dataHandler: {
        autoplay: (newVal) => {
          if (this._auto != false) {
            if (!isNaN(newVal)) {
              this.delay = newVal;
            }

            clearInterval(this.interval);

            this.interval = setInterval(() => {
              this.pages[this.current].classList.remove("current");
              this.current++;

              if (this.current == this.length) {
                this.current = 0;
              }

              this.pages[this.current].classList.add("current");
            }, this.delay);
          } else {
            console.log("stop intv");
            clearInterval(this.interval);
          }
        },
        ratio: (newVal) => {
          let particle = newVal.split(":");
          let w = particle[0];
          let h = particle[1];
          this._ratio = h / w;

          this.applyRatio();
        },
      },
    });
  }

  applyRatio() {
    let contentStyles = window.getComputedStyle(this.content);

    setTimeout(() => {
      this._contentWidth = Number(
        contentStyles.getPropertyValue("width").replace("px", "")
      );

      this.content.setAttribute(
        "style",
        `height: ${parseInt(this._contentWidth * this._ratio)}px`
      );
    }, 1);
  }

  // scroll() {
  //   console.log("current = " + this.current);
  //   this.pages[this.current].classList.remove("current");
  //   this.current++;

  //   if(this.current == this.length) {
  //     this.current = 0;
  //   }

  //   this.pages[this.current].classList.add("current");
  // }
}

highway.define("scroller-", Scroller);

export default Scroller;
