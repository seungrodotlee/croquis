import "../components/top-bar.js";

window.addEventListener("load", () => {
  let isIntroActive = JSON.parse(highway.getCookie("intro"));
  let intro = document.querySelector("#intro");

  if (isIntroActive != null && !isIntroActive) {
    let p = intro.parentElement;
    highway.removeElement(p, "hidden-by-slide-right");
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
      highway.removeElement(p, "hidden-by-slide-right");
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
      highway.setCookie("intro", true, 7);
      introToggler.textContent = "인트로 안 볼래요";
      isIntroActive = true;
    } else {
      highway.setCookie("intro", false, 7);
      introToggler.textContent = "인트로 볼래요";
      isIntroActive = false;
    }
  });
});
