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

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  (async () => {
    if (isIntroActive != null && !isIntroActive) {
      croquis.removeElement(introWrap, "hidden-by-slide-right");
    } else {
      await croquis.introSloganTop.geul("당신의 도화지를", 80);
      croquis.introLogo.setAttribute("style", "stroke-dashoffset: 0;");
      await croquis.introSloganBottom.geul("채우는 가장 쉬운 방법", 80, 500);

      // await croquis.delay(() => {
      //   introLogo.setAttribute("style", "stroke-dashoffset: -1700;");
      // }, 1000);

      croquis.delay(() => {
        croquis.removeElement(introWrap, "hidden-by-offset-slide-right");
      }, 1000);
    }
  })();

  if (isIntroActive != null && !isIntroActive) {
    croquis.introToggler.textContent = "인트로 볼래요";
  } else {
    croquis.introToggler.textContent = "인트로 안 볼래요";
  }

  croquis.introToggler.addEventListener("click", () => {
    if (isIntroActive != null && !isIntroActive) {
      croquis.setCookie("intro", true, 7);
      croquis.introToggler.textContent = "인트로 안 볼래요";
      isIntroActive = true;
    } else {
      croquis.setCookie("intro", false, 7);
      croquis.introToggler.textContent = "인트로 볼래요";
      isIntroActive = false;
    }
  });

  let currentPos = 0;
  let hold = false;
  window.addEventListener("mousewheel", async (e) => {
    let h = window.innerHeight;
    let pos = window.scrollY;

    if (pos >= 0 && pos < h) {
      if (currentPos != 0 && croquis.sloganAdj.textContent != "쉬운") {
        if (!hold) {
          currentPos = 0;
          hold = true;
          await croquis.sloganAdj.reverse("");
          await croquis.sloganAdj.geul("쉬운");
          hold = false;
        }
      }

      let origin =
        parseInt(
          window.getComputedStyle(croquis.mainSlogan).width.replace("px", "")
        ) * 1.1;
      let ratio = pos / h;
      let scaleGoal = 0.75;

      if (origin * (1 - (1 - scaleGoal)) >= 0.4 * window.innerWidth) {
        scaleGoal = (0.4 * window.innerWidth) / origin;
      }

      croquis.mainSlogan.setAttribute(
        "style",
        `top: calc(${50 - 50 * ratio}% + ${
          9 * ratio
        }rem); transform: translateY(-50%) scale(${
          1 - (1 - scaleGoal) * ratio
        })`
      );

      croquis.mainLogo.setAttribute(
        "style",
        `stroke-dashoffset: -${1700 * ratio};`
      );
      croquis.bgCurve1.setAttribute(
        "style",
        `stroke-dashoffset: ${1400 - 1400 * ratio};`
      );

      currentPos = 0;
    } else {
      let origin =
        parseInt(
          window.getComputedStyle(croquis.mainSlogan).width.replace("px", "")
        ) * 1.1;
      let scaleGoal = 0.75;

      if (origin * scaleGoal >= 0.4 * window.innerWidth) {
        scaleGoal = (0.4 * window.innerWidth) / origin;
      }

      croquis.mainSlogan.setAttribute(
        "style",
        `top: 9rem; transform: translateY(-50%) scale(${scaleGoal})`
      );
    }

    if (pos >= h && pos < 2 * h) {
      if (currentPos != 0) {
        if (!hold) {
          currentPos = 0;
          hold = true;
          await croquis.sloganAdj.reverse("");
          await croquis.sloganAdj.geul("쉬운");
          hold = false;
        }
      }
    }

    if (pos >= 2 * h && pos < 4 * h) {
      if (currentPos != 1) {
        if (!hold) {
          hold = true;
          currentPos = 1;
          await croquis.sloganAdj.reverse("");
          await croquis.sloganAdj.geul("빠른");
          hold = false;
        }
      }

      let ratio = (pos - 2 * h) / (2 * h);

      croquis.bgCurve1.setAttribute(
        "style",
        `stroke-dashoffset: -${1400 * ratio};`
      );
    }

    if (pos >= 4 * h && pos < 5 * h) {
      if (currentPos != 2) {
        if (!hold) {
          hold = true;
          currentPos = 2;
          await croquis.sloganAdj.reverse("");
          await croquis.sloganAdj.geul("편한");
          hold = false;
        }
      }

      let ratio = (pos - 4 * h) / h;

      croquis.idExample.classList.add("on");
      croquis.idExample.setAttribute("style", "transform: translateY(-50%)");
      croquis.idWithCroquis.setAttribute(
        "style",
        `transform: translateY(${-100 * ratio}px)`
      );
    } else if (pos < 4 * h) {
      if (croquis.idExample.classList.contains("on")) {
        croquis.idExample.classList.remove("on");
        croquis.idExample.setAttribute("style", "transform: translateY(50vh)");
      }
    } else {
      if (croquis.idExample.classList.contains("on")) {
        croquis.idExample.classList.remove("on");
        croquis.idExample.setAttribute(
          "style",
          "transform: translateY(-150vh)"
        );
      }
    }

    // console.log(e.wheelDeltaY);

    if (pos >= 2.6 * h && pos < 3.6 * h) {
      let ratio = (pos - 2.6 * h) / h;

      croquis.dropdownExample.classList.add("on");
      croquis.dropdownExample.setAttribute(
        "style",
        "transform: translateX(-50%) translateY(-3rem)"
      );
      croquis.ddWithoutCroquis.setAttribute(
        "style",
        `transform: translateY(${-100 * ratio}px)`
      );
      croquis.ddWithCroquis.setAttribute(
        "style",
        `transform: translateY(${-300 * ratio}px)`
      );
    } else if (pos < 2.6 * h) {
      if (croquis.dropdownExample.classList.contains("on")) {
        croquis.dropdownExample.classList.remove("on");
        croquis.dropdownExample.setAttribute(
          "style",
          "transform: translateX(-50%) translateY(100%)"
        );
      }
    } else {
      if (croquis.dropdownExample.classList.contains("on")) {
        croquis.dropdownExample.classList.remove("on");
        croquis.dropdownExample.setAttribute(
          "style",
          "transform: translateX(-50%) translateY(-100vh)"
        );
      }
    }
  });
});
