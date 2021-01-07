croquis.transition = (el, transitionName, before, after) => {
  if (typeof before == "function") {
    before();
  }

  el.classList.add(`ready-${transitionName}`);

  setTimeout(() => {
    el.classList.add(transitionName);

    let callback = () => {
      el.classList.remove(`ready-${transitionName}`);
      el.classList.remove(transitionName);
      el.removeEventListener("transitionend", callback);

      if (typeof after == "function") {
        after();
      }
    };

    el.addEventListener("transitionend", callback);
  }, 50);
};

croquis.attachElement = (el, parent, transitionName) => {
  croquis.transition(el, transitionName, () => {
    parent.attachElement(el);
  });
};

croquis.removeElement = (el, transitionName) => {
  croquis.transition(el, transitionName, undefined, () => {
    el.parentElement.removeChild(el);
  });
};
