import TemplateElement from "../util/TemplateElement.js";

class Table extends TemplateElement {
  constructor() {
    super({
      template: `
      <div class="table-wrap">
        <table>
          <thead class="table-head">
          </thead>
          <tbody class="table-content">
          </tbody>
        </table>
        <button class="add-row-btn">
          +
        </button>
        <button class="add-col-btn">
          <div>+</div>
        </button>
      </div>
      `,
      templateHandler: () => {
        this.openBracket = "[";
        this.closeBracket = "]";
        this.fieldBreakpoint = " ";
        this.contentBreakpoint = ",";
        this.colCount = 0;
        this.rowCount = 0;
        this.delBtnList = [];

        this.table = this.fromTemplate("table");
        this.head = this.fromTemplate(".table-head");
        this.content = this.fromTemplate(".table-content");
        this.addRowBtn = this.fromTemplate(".add-row-btn");
        this.addColBtn = this.fromTemplate(".add-col-btn");

        this.addRowBtn.addEventListener("click", () => {
          let tr = this.newTableRow();

          for (let j = 0; j < this.colCount; j++) {
            tr.appendChild(this.newTableData("&nbsp;"));
          }

          this.registRowDelBtn(tr);
        });

        this.addColBtn.addEventListener("click", () => {
          this.newTableHead("새 필드");

          let trs = this.fromTemplateAll(".table-content tr");

          for (let i = 0; i < trs.length; i++) {
            this.removeRowDelBtn(trs[i]);
            trs[i].appendChild(this.newTableData("&nbsp;"));
            this.registRowDelBtn(trs[i]);
          }

          this.colCount++;
        });

        this.body.redrawTable = this.redrawTable;
      },
      dataHandler: {
        editable: (newVal) => {
          newVal = JSON.parse(newVal);

          if (newVal) {
            for (let i = 0; i < this.delBtnList.length; i++) {
              this.delBtnList[i].classList.add("active");
            }
            this.addColBtn.classList.add("active");
            this.addRowBtn.classList.add("active");
            this.table.setAttribute("contenteditable", "true");
          } else {
            for (let i = 0; i < this.delBtnList.length; i++) {
              this.delBtnList[i].classList.remove("active");
            }
            this.addColBtn.classList.remove("active");
            this.addRowBtn.classList.remove("active");
            this.table.setAttribute("contenteditable", "false");
          }
        },
        "field-breakpoint": (newVal) => {
          this.fieldBreakpoint = newVal;
        },
        bracket: (newVal) => {
          this.openBracket = newVal[0];
          this.closeBracket = newVal[1];
        },
        breakpoint: (newVal) => {
          this.contentBreakpoint = newVal;
        },
        fields: (newVal) => {
          this.fields = newVal.split(this.fieldBreakpoint);

          for (let i = 0; i < this.fields.length; i++) {
            this.fields[i] = this.fields[i].trim();
            this.newTableHead(this.fields[i]);

            this.colCount++;
          }
        },
        content: (newVal) => {
          this.data = [];
          this.rows = newVal.split(this.openBracket);

          this.rows.shift();

          this.content.innerHTML = "";

          for (let i = 0; i < this.rows.length; i++) {
            this.rows[i] = this.rows[i].trim().replace(this.closeBracket, "");

            this.data[i] = this.rows[i].split(this.contentBreakpoint);
          }

          this.redrawTable(newVal);
        },
      },
    });
  }

  newTableHead(data) {
    let index = this.colCount;
    let th = document.createElement("th");
    th.innerHTML = data;
    this.head.appendChild(th);

    let delBtn = document.createElement("button");
    if (this.dataset.editable == "true") {
      delBtn.classList.add("active");
    }
    delBtn.classList.add("del-col-btn");
    delBtn.setAttribute("contenteditable", "false");
    delBtn.innerHTML = `<span class="material-icons"> close </span>`;
    delBtn.addEventListener("click", () => {
      let trs = this.fromTemplateAll("tr");
      this.head.removeChild(th);
      this.delBtnList.remove(delBtn);

      for (let i = 0; i < trs.length; i++) {
        this.removeRowDelBtn(trs[i]);
        let tds = trs[i].querySelectorAll("td");
        trs[i].removeChild(tds[index]);
        this.registRowDelBtn(trs[i]);
      }

      this.colCount--;
    });

    this.delBtnList.push(delBtn);

    th.appendChild(delBtn);
  }

  newTableRow(callback) {
    let tr = document.createElement("tr");
    if (callback != null) {
      callback();
    }

    this.content.appendChild(tr);

    this.rowCount++;

    return tr;
  }

  removeRowDelBtn(tr) {
    let lastCell = tr.querySelector("td:last-child");
    let delBtn = tr.querySelector("td:last-child button");

    if (delBtn) {
      lastCell.removeChild(delBtn);
      this.delBtnList.remove(delBtn);
    }
  }

  registRowDelBtn(tr) {
    let delBtn = document.createElement("button");
    delBtn.classList.add("del-row-btn");
    if (this.dataset.editable == "true") {
      delBtn.classList.add("active");
    }
    delBtn.setAttribute("contenteditable", "false");
    delBtn.innerHTML = `<span class="material-icons"> close </span>`;
    delBtn.addEventListener("click", () => {
      this.content.removeChild(tr);
    });

    let lastCell = tr.querySelector("td:last-child");
    lastCell.appendChild(delBtn);
    this.delBtnList.push(delBtn);
  }

  newTableData(data) {
    let td = document.createElement("td");
    td.innerHTML = data;

    return td;
  }

  redrawTable() {
    this.content.innerHTML = "";

    for (let i = 0; i < this.rows.length; i++) {
      let tr = this.newTableRow(() => {});

      for (let j = 0; j < this.data[i].length; j++) {
        if (this.data[i].length != this.colCount) {
          this.content.innerHTML = "";
          throw new Error("unvalid content data: mismatch column count");
        }

        this.data[i][j] = this.data[i][j].trim();
        tr.appendChild(this.newTableData(this.data[i][j]));
      }

      this.registRowDelBtn(tr);
    }

    console.log(this.data);
  }
}

croquis.define("table-", Table);

export default Table;
