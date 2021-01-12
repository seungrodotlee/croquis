croquis.newComponent("slogan-", {
  template: `
    <div class="slogan fixed container full-y centered-x flex centering">
      <div class="slogan-wrap abs centered-y">
        <h1 class="slogan-top"></h1>
        <h1 class="slogan-bottom"></h1>
      </div>
      <svg-
        class="abs logo"
        data-src="./img/logo-solid.svg"
      ></svg->
    </div>
  `,
  templateHandler: function () {
    this.sloganWrap = this.fromTemplate(".slogan-wrap");
    this.sloganTop = this.fromTemplate(".slogan-top");
    this.sloganBottom = this.fromTemplate(".slogan-bottom");
    this.logo = this.fromTemplate(".logo");
    this._count = 0;
  },
  childHandler: function (addedNode) {
    if (this._count == 0) {
      this.sloganTop.innerHTML = addedNode.innerHTML;
    }

    if (this._count == 1) {
      this.sloganBottom.innerHTML = addedNode.innerHTML;
    }

    this._count++;
  },
  dataHandler: {
    prefix: function (newVal) {
      this.sloganWrap.setAttribute("id", `${newVal}-slogan`);
      this.sloganTop.setAttribute("id", `${newVal}-slogan-top`);
      this.sloganBottom.setAttribute("id", `${newVal}-slogan-bottom`);
      this.logo.setAttribute("id", `${newVal}-logo`);
    },
  },
});
