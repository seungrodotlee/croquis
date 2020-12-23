import DropDown from "./components/DropDown.js";
import Tabs from "./components/Tabs.js";
import Alert from "./components/Alert.js";
import TopButton from "./components/TopButton.js";
import Table from "./components/Table.js";
import Modal from "./components/Modal.js";
import Collapse from "./components/Collapse.js";
import Scroller from "./components/Scroller.js";
import ArticleMap from "./components/ArticleMap.js";
import { Row, Col } from "./components/Grid.js";

// custom element 등록
highway.define("drop-down", DropDown);
highway.define("tabs-", Tabs);
highway.define("alert-", Alert);
highway.define("top-button", TopButton);
highway.define("table-", Table);
highway.define("modal-", Modal);
highway.define("collapse-", Collapse);
highway.define("carousel-", Scroller);
highway.define("article-map", ArticleMap);
highway.define("row-", Row);
highway.define("col-", Col);

window.addEventListener("DOMContentLoaded", () => {
  // alertWrap DOM에 등록
  document.body.appendChild(highway._alertWrap);
});
