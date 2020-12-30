import TemplateElement from "../util/TemplateElement.js";

class BindableElement extends TemplateElement {
  constructor({
    template = "",
    templateHandler = () => {},
    childHandler = () => {},
    dataHandler = {},
    bindBracket = "{}",
    bind = {},
  }) {
    super({
      template,
      templateHandler,
      childHandler,
      dataHandler,
    });

    this.__called = false;
  }

  connectedCallback() {
    if (this.__called) return;
    this.__called = true;

    super.connectedCallback();
  }

  registryChildren(children) {
    super.registryChildren(children);
  }

  attrCallback(mutationsList, observer) {
    super.attrCallback(mutationsList, observer);
  }
}

export default BindableElement;
