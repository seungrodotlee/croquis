croquis.transition = (el, transitionName, before, after) => {
  if (typeof before == "function") {
    before();
  }

  el.classList.add(`ready-${transitionName}`);

  setTimeout(() => {
    el.classList.add(transitionName);

    let callback = (e) => {
      el.classList.remove(`ready-${transitionName}`);
      el.classList.remove(`before-${transitionName}`);
      el.classList.remove(transitionName);
      el.removeEventListener("transitionend", callback);

      if (typeof after == "function") {
        after();
      }
    };

    el.addEventListener("transitionend", callback);
  }, 50);
};

croquis.attachElement = (el, parent, transitionName, before, after) => {
  el.classList.add(`before-${transitionName}`);
  parent.appendChild(el);
  setTimeout(() => {
    croquis.transition(
      el,
      transitionName,
      function () {
        if (typeof before == "function") {
          before();
        }
      },
      after
    );
  }, 100);
};

croquis.removeElement = (el, transitionName, before, after) => {
  croquis.transition(el, transitionName, before, function () {
    el.parentElement.removeChild(el);

    if (typeof after == "function") {
      after();
    }
  });
};
