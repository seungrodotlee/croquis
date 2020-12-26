import TemplateElement from "../Highway.js";

class Tag extends TemplateElement {
  constructor() {
    super({
      template: `
        <div class="tag">
          <div class="tag-title grey-lighter-bg"></div><!--
       --><div class="tag-content"></div>
        </div>
      `,
      templateHandler: () => {
        this.head = this.fromTemplate(".tag-title");
        this.content = this.fromTemplate(".tag-content");
      },
      childHandler: (addedNode) => {
        this.content.textContent = addedNode;
      },
      dataHandler: {
        title: (newVal) => {
          this._title = newVal;
          this.head.textContent = newVal;
        },
        value: (newVal) => {
          this.content.textContent = newVal;
        },
      },
    });
  }
}

highway.define("tag-", Tag);

export default Tag;
