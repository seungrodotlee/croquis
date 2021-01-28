import TemplateElement from "../util/TemplateElement.js";

class Slider extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="slider">
          <button class="slider-prev-btn centered-y">
            <span class="material-icons">keyboard_arrow_left</span>
          </button>
          <button class="slider-next-btn centered-y">
            <span class="material-icons">keyboard_arrow_right</span>
          </button>
          <div class="slider-content item-contain">
          </div>
        </div>
      `,
      templateHandler: () => {
        this.prevBtn = this.fromTemplate(".slider-prev-btn");
        this.nextBtn = this.fromTemplate(".slider-next-btn");
        this.content = this.fromTemplate(".slider-content");
        this.roll = this.fromTemplate(".slider-roll");

        this.current = 0;
        this.length = 0;
        this.pages = [];
        this.delay = 3000;

        this.smallestWidth = 0;
        this.biggestWidth = 0;
        this.smallestHeight = 0;
        this.biggestHeight = 0;

        this.body.scrollTo = (position) => {
          this.roll.style.transform = `translateX(${-position * 100}%)`;
        };

        this.prevBtn.addEventListener("click", () => {
          if (this.current != 0) {
            this.pages[this.current].classList.remove("current");
            this.current--;
            this.pages[this.current].classList.add("current");
            //this.body.scrollTo(this.current);
          }
        });

        this.nextBtn.addEventListener("click", () => {
          if (this.current + 1 < this.length) {
            this.pages[this.current].classList.remove("current");
            this.current++;
            this.pages[this.current].classList.add("current");
            //this.body.scrollTo(this.current);
          }
        });

        this.body.applyRatio = this.applyRatio;

        window.addEventListener("resize", () => {
          this.applyRatio();
        });
      },
      childHandler: (addedNode) => {
        // let originDisplay = addedNode.style.display;

        // this.style.height = "100vh";
        // this.style.width = "100vw";
        // addedNode.style.display = "inline-block";
        // console.dir(addedNode);
        // console.log(addedNode.getBoundingClientRect());

        // let h = addedNode.clientHeight;
        // let w = addedNode.clientWidth;

        // addedNode.style.display = originDisplay;

        if (this.length == 0) {
          addedNode.classList.add("current");
          //   this.smallestHeight = h;
          //   this.biggestHeight = h;
          //   this.smallestWidth = w;
          //   this.biggestWidth = w;
          // } else {
          //   if (h < this.smallestHeight) {
          //     this.smallestHeight = h;
          //   }

          //   if (h > this.biggestHeight) {
          //     this.biggestHeight = h;
          //   }

          //   if (w < this.smallestWidth) {
          //     this.smallestWidth = w;
          //   }

          //   if (w > this.biggestWidth) {
          //     this.biggestWidth = w;
          //   }
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
          console.dir(this.content);
          setTimeout(() => {
            let children = this.content.children;
            console.log(children);

            for (let i = 0; i < children.length; i++) {
              let c = children[i];
              let origin = c.style.display;

              console.log(c);

              c.style.display = "inline-block";
              c.style.position = "relative";
              let h = c.getBoundingClientRect().height;
              c.style.display = origin;
              c.style.position = "";

              if (i === 0) {
                this.smallestHeight = h;
                this.biggestHeight = h;
              } else {
                if (h < this.smallestHeight) {
                  this.smallestHeight = h;
                }

                if (h > this.biggestHeight) {
                  this.biggestHeight = h;
                }
              }
            }

            if (newVal === "min") {
              this.body.classList.remove("item-fit-contain");
              this.body.classList.add("item-fit-cover");

              if (!this._noHeight) {
                this.body.style.height = this.smallestHeight + "px";
              }
            }
            if (newVal === "centering") {
              this.body.classList.add("item-fit-contain");
              this.body.classList.remove("item-fit-cover");
              if (!this._noHeight) {
                this.body.style.height = this.biggestHeight + "px";
              }
            }
            if (newVal === "max") {
              this.body.classList.remove("item-fit-contain");
              this.body.classList.add("item-fit-cover");
              if (!this._noHeight) {
                this.body.style.height = this.biggestHeight + "px";
              }
            }
          }, 100);
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
        "no-height": (newVal) => {
          newVal = JSON.parse(newVal);
          console.log(newVal);
          if (newVal) {
            this.body.style.height = "";
            this._noHeight = true;
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

croquis.define("slider-", Slider);

export default Slider;
