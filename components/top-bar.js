highway.newComponent("top-bar", {
  template: `
  <div class="top-bar">
    <nav-bar
      id="nav-bar"
      class="grey-light-border d2"
      data-title="highway"
      data-logo="./img/logo.svg"
    >
      <div>
        <sync- class="no-border hover-underscore">
          <button>알아보기</button>
          <button>시작하기</button>
          <button>CSS</button>
          <button>템플릿</button>
          <button>골라담기</button>
          <button>12{test}34{test}56</button>
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
