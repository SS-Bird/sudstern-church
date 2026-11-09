/* The gold-star tracker in the top-right corner. Shared by any scene that awards stars.
 * Stars are remembered for the browser tab (sessionStorage) and each star id only counts once. */
const Stars = (() => {
  const KEY = "goldStars";
  let bar = null;
  let slots = 6;

  const STAR_PATH = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";
  function starSvg(cls) {
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
  }

  function earned() {
    try { return JSON.parse(Content.store.get(KEY, "[]")) || []; } catch { return []; }
  }

  function init(n) {
    slots = n;
    bar = document.createElement("div");
    bar.className = "stars-bar";
    document.body.append(bar);
    render(-1);
  }

  function render(popIndex) {
    const count = Math.min(slots, earned().length);
    bar.setAttribute("aria-label", `${count} of ${slots} gold stars`);
    bar.innerHTML = Array.from({ length: slots }, (_, i) =>
      starSvg("star " + (i < count ? "gold" : "empty") + (i === popIndex ? " pop" : ""))
    ).join("");
  }

  function add(id) {
    const list = earned();
    if (list.includes(id)) return;
    list.push(id);
    Content.store.set(KEY, JSON.stringify(list));
    render(Math.min(slots, list.length) - 1);
  }

  return { init, add, starSvg };
})();
