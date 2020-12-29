import TemplateElement from "../old/BindableElement.js";

class Row extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="row"></div>
      `,
      templateHandler: () => {},
      childHandler: (addedNode) => {
        this.body.appendChild(addedNode);
      },
      dataHandler: {
        cols: (newVal) => {
          this._maxSize = newVal;
        },
      },
    });
  }
}

class Col extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="col"></div>
      `,
      templateHandler: () => {
        this._currentTake = 0;
      },
      childHandler: (addedNode) => {
        this.body.appendChild(addedNode);
      },
      dataHandler: {
        size: (newVal) => {
          let getNewColSize = () => {
            return parseInt(currentCols) + parseInt(newVal) - this._currentTake;
          };

          if (this._currentTake != 0) {
            this.body.classList.remove(`take-${this._currentTake}`);
          }

          this.body.classList.add(`take-${newVal}`);

          let maxColParent = this.body.parentElement.getAttribute("data-cols");
          let currentCols = this.body.parentElement.getAttribute(
            "current-cols"
          );

          if (maxColParent) {
            if (!currentCols) {
              this.body.parentElement.setAttribute("current-cols", newVal);
              this._currentTake = parseInt(newVal);

              return;
            }

            if (getNewColSize() > maxColParent) {
              let oldRow = this.body.parentElement;
              let newRow = new Row();

              oldRow.insertAfter(newRow);
              oldRow.removeChild(this.body);
              newRow.appendChild(this.body);

              if (this._currentTake != 0) {
                oldRow.setAttribute(
                  "current-cols",
                  parseInt(currentCols) - this._currentTake
                );
              }

              newRow.body.setAttribute(
                "data-cols",
                oldRow.getAttribute("data-cols")
              );
              newRow.body.setAttribute("current-cols", newVal);
            } else {
              this.body.parentElement.setAttribute(
                "current-cols",
                getNewColSize()
              );
            }
          }

          this._currentTake = parseInt(newVal);
        },
      },
    });
  }
}

highway.define("row-", Row);
highway.define("col-", Col);

export { Row, Col };
