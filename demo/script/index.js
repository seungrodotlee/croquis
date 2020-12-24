window.addEventListener("load", () => {
  let intro = document.querySelector("#intro");
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

  intro.addEventListener("ended", (event) => {
    let p = intro.parentElement;
    highway.removeElement(p, "hidden-by-slide-right");
  });
});
