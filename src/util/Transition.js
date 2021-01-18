croquis.transition = (el, transitionName, before, after) => {
  let prom = new Promise(async (resolve, reject) => {
    if (typeof before == "function") {
      await before();
    }

    el.classList.add(`ready-${transitionName}`);

    setTimeout(() => {
      el.classList.add(transitionName);

      let callback = (e) => {
        if (e.target != el) return;
        el.classList.remove(`before-${transitionName}`);
        el.classList.remove(`ready-${transitionName}`);
        el.classList.remove(transitionName);

        if (typeof after == "function") {
          after();
        }

        el.removeEventListener("transitionend", callback);
        resolve(true);
      };

      el.addEventListener("transitionend", callback);
    }, 50);
  });

  return prom;
};

croquis.attachElement = (el, parent, transitionName, before, after) => {
  if (el.classList.contains("_hidden")) {
    el.classList.remove("_hidden");
  }

  el.classList.add(`before-${transitionName}`);
  let found = false;
  for (let c of parent.children) {
    if (c == el) {
      found = true;
      break;
    }
  }

  if (found) {
    let temp = document.createElement("div");
    el.insertAfter(temp);
    temp.insertAfter(el);
    parent.removeChild(temp);
  } else {
    parent.appendChild(el);
  }

  let p = croquis.transition(
    el,
    transitionName,
    function () {
      if (typeof before == "function") {
        let p = before();
        return p;
      }
    },
    after
  );
  return p;
};

croquis.removeElement = (el, transitionName, before, after) => {
  let p = croquis.transition(el, transitionName, before, function () {
    el.parentElement.removeChild(el);

    if (typeof after == "function") {
      after();
    }
  });

  return p;
};
