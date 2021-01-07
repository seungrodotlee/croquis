import "../components/top-bar.js";

croquis.abc = {
  test: "a",
  test2: "b",
  test3: "c",
};

window.addEventListener("load", () => {
  let introSloganTop = document.querySelector("#intro-slogan-top");
  let introSloganBottom = document.querySelector("#intro-slogan-bottom");
  let p = introSloganTop.geul("당신의 도화지를");

  p.then((r) => {
    introSloganBottom.geul("더 쉽게 채우기 위한 도구");
  });

  return;
  let isIntroActive = JSON.parse(croquis.getCookie("intro"));
  let intro = document.querySelector("#intro");

  if (isIntroActive != null && !isIntroActive) {
    let p = intro.parentElement;
    croquis.removeElement(p, "hidden-by-slide-right");
  } else {
    intro.classList.remove("_hidden");
    let promise = intro.play();

    if (promise != undefined) {
      promise
        .then(() => {
          console.log("play");
        })
        .catch((e) => {
          console.log(e);
        });
    }

    intro.addEventListener("ended", () => {
      let p = intro.parentElement;
      croquis.removeElement(p, "hidden-by-slide-right");
    });
  }

  let introToggler = document.querySelector("#intro-toggler");

  console.log(isIntroActive);
  // if (isIntroActive != null) {
  //   if (isIntroActive) {
  //     introToggler.textContent = "인트로 안 볼래요";
  //   } else {
  //     introToggler.textContent = "인트로 볼래요";
  //   }
  // } else {
  //   introToggler.textContent = "인트로 안 볼래요";
  // }

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
