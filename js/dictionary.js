/*
 * Twerp's dictionary: a page corner in the bottom-right that opens a full-screen dictionary,
 * with thumb-index tabs on the right for each word unlocked so far.
 * Entries come from script/dictionary.md.
 */
const Dictionary = (() => {
  const { inline, html, escape } = Content;
  let entries = {};
  let unlocked = [];
  let current = null;
  let corner, overlay, page, tabs;
  let openWaiters = [];
  let pageWaiters = [];

  function init(blocks) {
    blocks.forEach((b) => (entries[b.heading.trim().toLowerCase()] = b));

    corner = document.createElement("button");
    corner.className = "dict-corner";
    corner.hidden = true;
    corner.setAttribute("aria-label", "Open your dictionary");
    corner.addEventListener("click", () => (isOpen() ? close() : open()));

    overlay = document.createElement("div");
    overlay.className = "dict-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="dict-book">
        <article class="dict-page" aria-live="polite"></article>
        <nav class="dict-tabs" aria-label="Dictionary tabs"></nav>
      </div>
      <button class="dict-close" aria-label="Close dictionary">✕</button>`;
    page = overlay.querySelector(".dict-page");
    tabs = overlay.querySelector(".dict-tabs");
    overlay.querySelector(".dict-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) close(); });

    document.body.append(overlay, corner);
  }

  const isOpen = () => overlay && !overlay.hidden;

  function add(word) {
    word = word.toLowerCase();
    if (!entries[word]) console.warn("No dictionary entry for", word);
    if (!unlocked.includes(word)) unlocked.push(word);
    if (!current) current = word;
    corner.hidden = false;
    corner.classList.remove("poke");
    void corner.offsetWidth;
    corner.classList.add("poke");
    renderTabs();
  }

  function open() {
    if (!current) return;
    overlay.hidden = false;
    document.body.classList.add("dict-open");
    corner.classList.remove("beckon");
    corner.classList.add("is-open");
    renderPage(current, false);
    openWaiters.splice(0).forEach((r) => r());
    checkPage();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove("dict-open");
    corner.classList.remove("is-open");
  }

  function show(word) {
    if (word === current) return;
    current = word;
    renderPage(word, true);
    tabs.querySelectorAll(".dict-tab").forEach((t) => t.classList.remove("beckon"));
    checkPage();
  }

  function renderTabs() {
    tabs.innerHTML = "";
    unlocked.forEach((w) => {
      const t = document.createElement("button");
      t.className = "dict-tab" + (w === current ? " active" : "");
      t.dataset.word = w;
      t.textContent = w;
      t.addEventListener("click", () => show(w));
      tabs.append(t);
    });
  }

  function renderPage(word, flip) {
    const e = entries[word] || { body: "" };
    const words = Object.keys(entries).sort();
    const pageNo = 812 + words.indexOf(word) * 37;
    page.innerHTML = `
      <header class="dict-guide"><span>${escape(word)}</span><span>${pageNo}</span></header>
      <h2 class="dict-head">${escape(e.heading || word)}</h2>
      <p class="dict-meta">
        ${e.pronunciation ? `<span class="dict-pron">${escape(e.pronunciation)}</span>` : ""}
        ${e.pos ? `<em>${escape(e.pos)}</em>` : ""}
      </p>
      <div class="dict-body">${html(e.body)}</div>
      ${e.source ? `<p class="dict-source">${inline(e.source)}</p>` : ""}`;
    tabs.querySelectorAll(".dict-tab").forEach((t) => t.classList.toggle("active", t.dataset.word === word));
    if (flip) {
      page.classList.remove("flip");
      void page.offsetWidth;
      page.classList.add("flip");
    }
  }

  // Resolves once the dictionary is open (immediately if it already is).
  function waitOpen() {
    if (isOpen()) return Promise.resolve();
    corner.classList.add("beckon");
    return new Promise((r) => openWaiters.push(r));
  }

  // Resolves once the dictionary is open on `word`.
  function waitPage(word) {
    word = word.toLowerCase();
    return new Promise((r) => {
      pageWaiters.push({ word, r });
      const tab = tabs.querySelector(`[data-word="${CSS.escape(word)}"]`);
      if (tab) tab.classList.add("beckon");
      if (!isOpen()) corner.classList.add("beckon");
      checkPage();
    });
  }

  function checkPage() {
    if (!isOpen()) return;
    pageWaiters = pageWaiters.filter(({ word, r }) => {
      if (word !== current) return true;
      corner.classList.remove("beckon");
      r();
      return false;
    });
  }

  return { init, add, open, close, waitOpen, waitPage };
})();
