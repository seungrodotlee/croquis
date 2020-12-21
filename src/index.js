import "./util/Highway.js";
import DropDown from "./components/DropDown.js";
import Tabs from "./components/Tabs.js";
import Alert from "./components/Alert.js";
import TopButton from "./components/TopButton.js";
import Table from "./components/Table.js";
import Modal from "./components/Modal.js";
import Collapse from "./components/Collapse.js";
import { Row, Col } from "./components/Grid.js";

let title = document.querySelector("title");

if (window.customElements) {
  let script = document.createElement("script");
  script.setAttribute(
    "src",
    "https://unpkg.com/@webcomponents/webcomponentsjs@2.2.10/custom-elements-es5-adapter.js"
  );
  title.insertAfter(script);
} else {
  let script = document.createElement("script");
  script.setAttribute(
    "src",
    "https://unpkg.com/@webcomponents/webcomponentsjs@2.2.10/webcomponents-bundle.js"
  );
  title.insertAfter(script);
}

// custom element 등록
customElements.define("drop-down", DropDown);
customElements.define("tabs-", Tabs);
customElements.define("alert-", Alert);
customElements.define("top-button", TopButton);
customElements.define("table-", Table);
customElements.define("modal-", Modal);
customElements.define("collapse-", Collapse);
customElements.define("row-", Row);
customElements.define("col-", Col);

window.addEventListener("DOMContentLoaded", () => {
  // alertWrap DOM에 등록
  document.body.appendChild(highway._alertWrap);
});
