import TemplateElement from "../Highway.js";

class Sync extends TemplateElement {
  constructor() {
    super({
      template: `<div></div>`,
      templateHandler: () => {
        this._position = this.body;
      },
      childHandler: (addedNode) => {
        this._position.insertAfter(addedNode);
        this.copyAttrsTo(addedNode);

        if (this._position == this.body) {
          this.body.parentElement.removeChild(this.body);
        }

        this._position = addedNode;
      },
    });
  }
}

customElements.define("sync-", Sync);

export default Sync;
