import TemplateElement from "../Highway.js";

class Loop extends TemplateElement {
  constructor() {
    super({
      template: `<div class="loop"></div>`,
      templateHandler: () => {
        this._childCount = 0;
        this._loopCount = 0;
        this._position = this.body;
        this._temp = [];
      },
      childHandler: (addedNode) => {
        console.log(addedNode);
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
              //this.body.appendChild(node);
              if (this._position == this.body) {
                this.body.parentElement.removeChild(this.body);
              }
              this._position = node;
            }
          }
        },
        for: (newVal) => {
          let p = null;
          let bindCallback = () => {
            console.log(newVal);

            console.log("b t ", highway[newVal]);
            this._loopCount = Object.keys(highway[newVal]).length;
            console.log(this._loopCount);

            this._loopCount -= this.kIdx;
            console.log("real loop count = " + this._loopCount);

            let nodes = [];
            let node = null;
            console.log("temp:");
            console.log(this._temp);
            console.log("nodes:");
            for (let i = 0; i < this._loopCount; i++) {
              nodes[i] = [];
              for (let j = 0; j < this._temp.length; j++) {
                node = this._temp[j].cloneNode(true);
                this.body.appendChild(node);
                nodes[i][j] = node;
                console.log(node.outerHTML);
              }
            }

            console.log("body" + this.body.innerHTML);
            p = this.registryTargetNodes(
              this.fromTemplateAll("*"),
              highway[newVal]
            );

            for (let i = 0; i < this._loopCount; i++) {
              for (let j = 0; j < this._temp.length; j++) {
                node = nodes[i][j];
                console.log("add", node);
                console.log("behind ", this._position);
                this._position.insertAfter(node);
                //this.body.appendChild(this._temp[j]);
                if (this._position == this.body) {
                  this.body.parentElement.removeChild(this.body);
                }
                this._position = node;
              }
            }

            highway[newVal] = p;
            console.log(this.body);
          };

          highway.bindRequest(newVal, bindCallback);
        },
      },
    });
  }
}

customElements.define("loop-", Loop);

export default Loop;
