import TemplateElement from "../util/TemplateElement.js";

class Svg extends TemplateElement {
  constructor() {
    super({
      template: `<svg></svg>`,
      dataHandler: {
        src: (newVal) => {
          console.log(newVal);

          let client = new XMLHttpRequest();
          client.open("GET", newVal);
          client.onreadystatechange = () => {
            if (client.readyState === 4) {
              console.log(client);
              let reg = new RegExp("<svg([^>]*)>((?:.|\n)*?)</svg>", "g");
              let regResult = reg.exec(client.responseText);
              let attrs = regResult[1];
              let svgCode = regResult[2];

              let attrsReg = new RegExp("([a-zA-Z]*)=[\"\\']([^\"']*)", "g");
              let attrRegResult = attrsReg.exec(attrs);

              while (attrRegResult != null) {
                this.body.setAttribute(attrRegResult[1], attrRegResult[2]);
                attrs.replace(attrRegResult[0], "");
                attrRegResult = attrsReg.exec(attrs);
              }

              this.body.innerHTML = svgCode;
            }
          };
          client.send();
          //this.body.setAttribute("data", newVal);
        },
      },
    });
  }
}

croquis.define("svg-", Svg);

export default Svg;
