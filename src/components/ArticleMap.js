import TemplateElement from "../Highway.js";

class ArticleMap extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="article-map">
          <ul>
          </ul>
        </div>
      `,
      templateHandler: () => {
        this.content = this.fromTemplate(".article-map > ul");
        this._parent = this.content;
        this._fold = true;
        this._nest = [];
        this._items = [];
        this._opened = [];
      },
      dataHandler: {
        target: (newVal) => {
          this.content.innerHTML = "";
          this._target = document.querySelector(`#${newVal}`);

          let targets = this._target.querySelectorAll("[data-depth]");

          for (let i = 0; i < targets.length; i++) {
            let t = targets[i];
            let item = document.createElement("li");
            let link = document.createElement("a");
            let depth = t.dataset.depth;

            link.setAttribute("href", `#${targets[i].getAttribute("id")}`);
            link.textContent = targets[i].textContent;
            item.appendChild(link);

            if (this._before != undefined) {
              if (this._before.dataset.depth < depth) {
                let temp = this._parent;

                this._parent = document.createElement("ul");
                this._lastItem.appendChild(this._parent);

                this._upper = temp;
                this._nest[this._before.dataset.depth] = temp;
              }

              if (this._before.dataset.depth > depth) {
                this._parent = this._nest[depth];
              }
            }

            link.addEventListener("click", () => {
              this.changeCurrentTo(link, t);
            });

            this._items[t.getAttribute("id")] = link;
            this._parent.appendChild(item);
            this._before = t;
            this._lastItem = item;
          }

          window.addEventListener("scroll", () => {
            let pos = window.scrollY;

            for (let i = 0; i < targets.length; i++) {
              let item = this._items[targets[i].getAttribute("id")];

              if (item == this._current) {
                continue;
              }

              if (i == targets.length - 1) {
                if (pos >= targets[i].offsetTop) {
                  this.changeCurrentTo(item, targets[i]);
                }
              } else {
                if (
                  pos >= targets[i].offsetTop &&
                  pos < targets[i + 1].offsetTop
                ) {
                  this.changeCurrentTo(item, targets[i]);
                }
              }
            }
          });
        },
        fold: (newValue) => {
          newValue = JSON.parse(newValue);
          this._fold = newValue;

          if (newValue) {
            this.body.classList.remove("always-opened");
          } else {
            this.body.classList.add("always-opened");
          }
        },
      },
    });
  }

  changeCurrentTo(current, target) {
    let d = target.dataset.depth;

    if (this._fold) {
      if (this._opened[d] != undefined) {
        this._opened[d].classList.remove("opened");
      }

      if (current.nextElementSibling != null) {
        current.nextElementSibling.classList.add("opened");
        this._opened[d] = current.nextElementSibling;
      }
    }

    if (this._current != undefined) {
      this._current.classList.remove("current");
    }

    current.classList.add("current");
    this._current = current;
  }
}

highway.define("article-map", ArticleMap);

export default ArticleMap;
