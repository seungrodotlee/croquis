highway.transition = ({ el, transitionName, before, after }) => {
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
  }, 1);
};

highway.attachElement = (el, parent, transitionName) => {
  highway.transition({
    el: el,
    transitionName: transitionName,
    before: () => {
      parent.attachElement(el);
    },
  });
};

highway.removeElement = (el, transitionName) => {
  highway.transition({
    el: el,
    transitionName: transitionName,
    after: () => {
      el.parentElement.removeChild(el);
    },
  });
};
