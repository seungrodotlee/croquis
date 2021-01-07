import "../components/top-bar.js";

croquis.abc = {
  test: "a",
  test2: "b",
  test3: "c",
};

window.addEventListener("load", async () => {
  let isIntroActive = JSON.parse(croquis.getCookie("intro"));
  let introWrap = document.querySelector(".intro-wrap");

  if (isIntroActive != null && !isIntroActive) {
    croquis.removeElement(introWrap, "hidden-by-slide-right");
  } else {
    let introSloganTop = document.querySelector("#intro-slogan-top");
    let introSloganBottom = document.querySelector("#intro-slogan-bottom");
    let introLogo = document.querySelector("#intro-logo");

    await introSloganTop.geul("당신의 도화지를", 80);
    introLogo.setAttribute("style", "stroke-dashoffset: 0;");
    await introSloganBottom.geul("채우는 가장 쉬운 방법", 80, 500);

    await croquis.delay(() => {
      introLogo.setAttribute("style", "stroke-dashoffset: -1700;");
    }, 1000);

    croquis.delay(() => {
      croquis.removeElement(introWrap, "hidden-by-offset-slide-right");
    }, 1000);
  }

  let introToggler = document.querySelector("#intro-toggler");

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
});
