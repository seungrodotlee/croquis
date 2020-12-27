import TemplateElement from "../Highway";

class Loop extends TemplateElement {
  constructor() {
    super({
      template: `<div></div>`,
      templateHandler: () => {
        this._childCount = 0;
        this._loopCount = 0;
        this._position = this.body;
        this._temp = [];
      },
      childHandler: (addedNode) => {
        this._temp.push(addedNode);

        this._childCount++;
      },
      dataHandler: {
        count: (newVal) => {
          console.log(newVal);
          this._loopCount = parseInt(newVal);

          for (let i = 0; i < this._loopCount; i++) {
            for (let j = 0; j < this._temp.length; j++) {
              let node = this._temp[j].cloneNode(true);
              console.log("add", node);
              console.log("behind ", this._position);
              this._position.insertAfter(node);
              if (this._position == this.body) {
                this.body.parentElement.removeChild(this.body);
              }
              this._position = node;
            }
          }
        },
      },
    });
  }
}

customElements.define("loop-", Loop);

export default Loop;
