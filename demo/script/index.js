import "../components/TopBar.js";
import "../components/Slogan.js";

croquis.abc = {
  test: "a",
  test2: "b",
  test3: "c",
};

window.addEventListener("load", () => {
  let isIntroActive = JSON.parse(croquis.getCookie("intro"));
  let introWrap = document.querySelector(".intro-wrap");
  let introSloganTop = document.querySelector("#intro-slogan-top");
  let introSloganBottom = document.querySelector("#intro-slogan-bottom");
  let introLogo = document.querySelector("#intro-logo");
  let introToggler = document.querySelector("#intro-toggler");

  let bigLogo = document.querySelector("#main-logo");
  let sloganWrap = document.querySelector("#main-slogan");
  let mainSloganTop = document.querySelector("#main-slogan-top");
  let mainSloganBottom = document.querySelector("#main-slogan-bottom");

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  (async () => {
    if (isIntroActive != null && !isIntroActive) {
      croquis.removeElement(introWrap, "hidden-by-slide-right");
    } else {
      await introSloganTop.geul("당신의 도화지를", 80);
      introLogo.setAttribute("style", "stroke-dashoffset: 0;");
      await introSloganBottom.geul("채우는 가장 쉬운 방법", 80, 500);

      // await croquis.delay(() => {
      //   introLogo.setAttribute("style", "stroke-dashoffset: -1700;");
      // }, 1000);

      croquis.delay(() => {
        croquis.removeElement(introWrap, "hidden-by-offset-slide-right");
      }, 1000);
    }
  })();

  if (isIntroActive != null && !isIntroActive) {
    introToggler.textContent = "인트로 볼래요";
  } else {
    introToggler.textContent = "인트로 안 볼래요";
  }

  introToggler.addEventListener("click", () => {
    if (isIntroActive != null && !isIntroActive) {
      croquis.setCookie("intro", true, 7);
      introToggler.textContent = "인트로 안 볼래요";
      isIntroActive = true;
    } else {
      croquis.setCookie("intro", false, 7);
      introToggler.textContent = "인트로 볼래요";
      isIntroActive = false;
    }
  });

  window.addEventListener("scroll", (e) => {
    let h = window.innerHeight;
    let pos = window.scrollY;

    if (pos >= 0 && pos <= h) {
      let xTarget =
        parseInt(
          window.getComputedStyle(mainSloganTop).width.replace("px", "")
        ) * 1.1;
      let ratio = pos / h;

      sloganWrap.setAttribute(
        "style",
        `top: calc(${50 - 50 * ratio}% + ${
          9 * ratio
        }rem); transform: translateY(-50%) scale(${1 - 0.25 * ratio})`
      );

      bigLogo.setAttribute("style", `stroke-dashoffset: -${1700 * ratio};`);
    }
  });
});
