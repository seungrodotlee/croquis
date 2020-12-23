import TemplateElement from "../util/Highway.js";

export default class ArticleMap extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="article-map">
          <ul>
          </ul>
        </div>
      `,
      templateHandler() {
        this.content = this.fromTemplate(".article-map > ul");
        this._parent = this.content;
        this._nest = [];
      },
      dataHandler: {
        target: (newVal) => {
          this.content.innerHTML = "";
          this._target = document.querySelector(`#${newVal}`);

          console.log(this._target.children);

          //this.searchChildren(this._target);

          let targets = this._target.querySelectorAll("[data-depth]");

          for(let i = 0; i < targets.length; i++) {
            let t = targets[i];
            let item = document.createElement("li");
            let link = document.createElement("a");
            let depth = t.dataset.depth;

            link.setAttribute("href", `#${targets[i].getAttribute("id")}`);
            link.textContent = targets[i].textContent;
            item.appendChild(link);
            
            if(this._before != undefined) {
              if(this._before.dataset.depth < depth) {
                let temp = this._parent;
                
                this._parent = document.createElement("ul");
                this._lastItem.appendChild(this._parent);

                this._upper = temp;
                this._nest[this._before.dataset.depth] = temp;
              }  

              if(this._before.dataset.depth > depth) {
                this._parent = this._nest[depth];
              }
            }

            link.addEventListener("click", () => {
              if(this._current != undefined) {
                this._current.classList.remove("current");
              }

              link.classList.add("current");
              this._current = link;
            });
            
            this._parent.appendChild(item);
            this._before = t;
            this._lastItem = item;
          }
        }
      }
    })
  }

  // searchChildren(el) {
  //   for(let i = 0; i < this._target.children.length; i++) {
  //     let c = this._target.children[i];

  //     if(highway.isElement(c)) {
  //       console.log(c);
  //       console.log(c.children.length);
  //       if(c.dataset.depth != undefined) {
  //         let item = document.createElement("li");
  //         let link = document.createElement("a");
  //         link.setAttribute("href", `#${c.getAttribute("id")}`);
  //         item.appendChild(link);
  //         this.content.appendChild(item);
  //       }

  //       if(c.children.length != 0) {
  //         this.searchChildren(c);
  //       }
  //     }
  //   }
  // }
}