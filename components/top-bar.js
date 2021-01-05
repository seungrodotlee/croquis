croquis.newComponent("top-bar", {
  template: `
  <div class="top-bar">
    <nav-bar
      id="nav-bar"
      class="grey-light-border d2"
      data-title="croquis"
      data-logo="./img/logo.svg"
    >
      <div>
        <sync- class="nav-bar-inner">
          <div class="hidden-s">
            <sync- class="no-border hover-underscore">
              <button>알아보기</button>
              <button>시작하기</button>
              <button>CSS</button>
              <button>템플릿</button>
              <button>골라담기</button>
            </sync->
          </div>
          <div class="only-in-s">
            <drop-down id="mobile-menu-drop" data-title="더 알아보기">
              <div>알아보기</div>
              <div>시작하기</div>
              <div>CSS</div>
              <div>템플릿</div>
              <div>골라담기</div>
            </drop-down>
          </div>
        </sync->
      </div>
      <div>
        <button class="primary-bg hover-back">다운로드</button>
        <button id="intro-toggler">인트로 안 볼래요</button>
      </div>
    </nav-bar>
  </div>
`,
});
