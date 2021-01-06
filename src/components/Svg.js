import TemplateElement from "../util/TemplateElement.js";

class Svg extends TemplateElement {
  constructor() {
    super({
      template: `<object type="image/svg+xml"></object>`,
      dataHandler: {
        src: (newVal) => {
          this.body.setAttribute("data", newVal);
        },
      },
    });
  }
}

croquis.define("svg-", Svg);

export default Svg;
