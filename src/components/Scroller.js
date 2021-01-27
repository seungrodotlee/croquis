import TemplateElement from "../util/TemplateElement.js";

class Scroller extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="scroller">
          <button class="scroller-prev-btn centered-y">
            <span class="material-icons">keyboard_arrow_left</span>
          </button>
          <button class="scroller-next-btn centered-y">
            <span class="material-icons">keyboard_arrow_right</span>
          </button>
          <div class="scroller-content item-contain"></div>
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

        this.smallestWidth = 0;
        this.biggestWidth = 0;
        this.smallestHeight = 0;
        this.biggestHeight = 0;

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
        let originDisplay = addedNode.style.display;
        addedNode.style.display = "inline-block";
        console.dir(addedNode);
        console.log(addedNode.clientWidth);

        let h = addedNode.clientHeight;
        let w = addedNode.clientWidth;

        addedNode.style.display = originDisplay;

        if (this.length == 0) {
          addedNode.classList.add("current");
          this.smallestHeight = h;
          this.biggestHeight = h;
          this.smallestWidth = w;
          this.biggestWidth = w;
        } else {
          if (h < this.smallestHeight) {
            this.smallestHeight = h;
          }

          if (h > this.biggestHeight) {
            this.biggestHeight = h;
          }

          if (w < this.smallestWidth) {
            this.smallestWidth = w;
          }

          if (w > this.biggestWidth) {
            this.biggestWidth = w;
          }
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
            clearInterval(this.interval);
          }
        },
        align: (newVal) => {
          if (newVal === "min") {
            this.body.classList.remove("item-fit-contain");
            this.body.classList.add("item-fit-cover");
            this.body.style.height = this.smallestHeight + "px";
            this.body.style.width = this.smallestWidth + "px";
          }

          if (newVal === "centering") {
            this.body.classList.add("item-fit-contain");
            this.body.classList.remove("item-fit-cover");
            this.body.style.height = this.biggestHeight + "px";
            this.body.style.width = this.biggestWidth + "px";
          }

          if (newVal === "max") {
            this.body.classList.remove("item-fit-contain");
            this.body.classList.add("item-fit-cover");
            this.body.style.height = this.biggestHeight + "px";
            this.body.style.width = this.biggestWidth + "px";
          }
        },
        fit: (newVal) => {
          if (newVal === "centering") {
            this.body.classList.add("item-fit-contain");
            this.body.classList.remove("item-fit-cover");
          }

          if (newVal == "cover") {
            this.body.classList.remove("item-fit-contain");
            this.body.classList.add("item-fit-cover");
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
}

croquis.define("scroller-", Scroller);

export default Scroller;
