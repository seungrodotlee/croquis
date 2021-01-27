import "../components/TopBar.js";
import "../components/Slogan.js";

window.addEventListener("load", () => {
  let isIntroActive = JSON.parse(croquis.getCookie("intro"));

  let introWrap = document.querySelector(".intro-wrap");

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  let origin = parseInt(
    window.getComputedStyle(croquis.mainSlogan).width.replace("px", "")
  );
  let originRatio = 1;

  if (origin >= 0.4 * window.innerWidth) {
    originRatio = (0.4 * window.innerWidth) / origin;
  }

  croquis.introSlogan.setAttribute(
    "style",
    `top: 50%; transform: translateY(-50%) scale(${originRatio})`
  );

  croquis.mainSlogan.setAttribute(
    "style",
    `top: 50%; transform: translateY(-50%) scale(${originRatio})`
  );

  croquis.landingTitle.setAttribute(
    "style",
    `top: 50%; transform: translateY(-50%) scale(${originRatio})`
  );

  (async () => {
    if (isIntroActive != null && !isIntroActive) {
      croquis.removeElement(introWrap, "hidden-by-slide-right");
    } else {
      await croquis.introSloganTop.geul("당신의 도화지를", 80);
      croquis.introLogo.setAttribute("style", "stroke-dashoffset: 0;");
      await croquis.introSloganBottom.geul("채우는 가장 쉬운 방법", 80, 500);

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

  window.addEventListener("resize", (e) => {
    if (origin >= 0.4 * window.innerWidth) {
      originRatio = (0.4 * window.innerWidth) / origin;
    }

    croquis.introSlogan.setAttribute(
      "style",
      `top: 50%; transform: translateY(-50%) scale(${originRatio})`
    );

    croquis.mainSlogan.setAttribute(
      "style",
      `top: 50%; transform: translateY(-50%) scale(${originRatio})`
    );

    croquis.landingTitle.setAttribute(
      "style",
      `top: 50%; transform: translateY(-50%) scale(${originRatio})`
    );
  });

  window.addEventListener("scroll", async (e) => {
    let h = window.innerHeight;
    let pos = window.scrollY;

    if (pos >= 0 && pos < 0.6 * h) {
      let ratio = 7 - (pos / (0.6 * h)) * 7;

      croquis.landingTitle.textContent = "croquis".slice(0, ratio);

      if (parseInt(ratio) == 0) {
        croquis.landingTitle.classList.add("_hidden");
      } else {
        croquis.landingTitle.classList.remove("_hidden");
      }
    } else if (pos < 2 * h) {
      croquis.landingTitle.classList.add("_hidden");
    }

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

      let ratio = pos / h;
      let scaleStart = 1;
      let scaleGoal = 0.75;

      if (origin >= 0.4 * window.innerWidth) {
        scaleStart = (0.4 * window.innerWidth) / origin;
      }

      if (origin * (1 - (1 - scaleGoal)) >= 0.4 * window.innerWidth) {
        scaleGoal = (0.4 * window.innerWidth) / origin;
      }

      croquis.mainSlogan.setAttribute(
        "style",
        `top: calc(${50 - 50 * ratio}% + ${
          9 * ratio
        }rem); transform: translateY(-50%) scale(${
          scaleStart - (scaleStart - scaleGoal) * ratio
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
      let scaleGoal = 0.75;

      if (origin * (1 - (1 - scaleGoal)) >= 0.4 * window.innerWidth) {
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

    if (pos >= 2.5 * h && pos < 3.5 * h) {
      let ratio = (pos - 2.5 * h) / h;

      croquis.dropdownExample.setAttribute(
        "style",
        "transform: translateX(-50%) translateY(-3rem)"
      );
      croquis.ddWithoutCroquis.setAttribute(
        "style",
        `transform: translateY(${-3 * ratio}rem)`
      );
      croquis.ddWithCroquis.setAttribute(
        "style",
        `transform: translateY(${-9 * ratio}rem)`
      );
    } else if (pos < 2.5 * h) {
      croquis.dropdownExample.setAttribute(
        "style",
        "transform: translateX(-50%) translateY(100%)"
      );
    } else {
      croquis.dropdownExample.setAttribute(
        "style",
        "transform: translateX(-50%) translateY(-100vh)"
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
    }

    if (pos >= 3.6 * h && pos < 4.6 * h) {
      let ratio = (pos - 3.6 * h) / h;

      croquis.idExample.setAttribute("style", "transform: translateY(100%)");
      croquis.idWithCroquis.setAttribute(
        "style",
        `transform: translateY(${-100 * ratio}%)`
      );
      croquis.mainSlogan.setAttribute(
        "style",
        `transition: top 1s; ${croquis.mainSlogan.getAttribute("style")}`
      );
    } else if (pos < 3.6 * h) {
      croquis.idExample.setAttribute("style", "transform: translateY(100vh)");
    } else {
      croquis.idExample.setAttribute("style", "transform: translateY(-150vh)");
      croquis.mainSlogan.setAttribute(
        "style",
        `transition: top 1s; top: 50%; ${croquis.mainSlogan
          .getAttribute("style")
          .replace(/top:.*;/g, "")}`
      );
    }

    if (pos > 4.8 * h) {
      if (!hold && croquis.landingTitle.classList.contains("_hidden")) {
        hold = true;
        croquis.delay(() => {
          croquis.landingTitle.classList.remove("_hidden");
        }, 100);
        await croquis.landingTitle.geul("croquis");
        hold = false;
      }
    } else if (pos > 4 * h) {
      if (!hold && !croquis.landingTitle.classList.contains("_hidden")) {
        hold = true;
        await croquis.landingTitle.reverse("");
        croquis.landingTitle.classList.add("_hidden");
        hold = false;
      }
    }
  });
});
