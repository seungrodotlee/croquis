import DropDown from "./components/DropDown.js";
import Tabs from "./components/Tabs.js";
import Alert from "./components/Alert.js";
import TopButton from "./components/TopButton.js";
import Table from "./components/Table.js";

// custom element 등록
customElements.define("drop-down", DropDown);
customElements.define("tabs-", Tabs);
customElements.define("alert-", Alert);
customElements.define("top-button", TopButton);
customElements.define("table-", Table);

window.addEventListener("DOMContentLoaded", () => {
  // alertWrap DOM에 등록
  document.body.appendChild(highway._alertWrap);
});
