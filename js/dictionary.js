/*
 * Twerp's dictionary: a page corner in the bottom-left that opens a full-screen dictionary,
 * with thumb-index tabs on the right for each word unlocked so far.
 * Entries come from script/dictionary.md. Works on every page: unlocked words are remembered for
 * the browser tab (Content.store), and the corner shows once Dictionary.reveal() has been called
 * (the newsletter pop-up does that) or a word has been added.
 * Before any word is unlocked, opening it shows the cover page (`## (cover)` in dictionary.md).
 */
const Dictionary = (() => {
  const { load, inline, html, escape, store } = Content;
  const WORDS = "dictWords";
  const SHOWN = "dictShown";
  let entries = {};
  let cover = null;
  let unlocked = [];
  let current = null;
  let corner, overlay, page, tabs;
  let openWaiters = [];
  let pageWaiters = [];

  try { unlocked = JSON.parse(store.get(WORDS, "[]")) || []; } catch { unlocked = []; }
  current = unlocked[unlocked.length - 1] || null;
  const save = () => store.set(WORDS, JSON.stringify(unlocked));

  const ready = (async () => {
    try {
      (await load("dictionary")).forEach((b) => {
        const key = b.heading.trim().toLowerCase();
        if (key === "(cover)") cover = b;
        else entries[key] = b;
      });
    } catch (err) {
      console.warn("Dictionary (script/dictionary.md) didn't load:", err);
    }
    if (document.readyState === "loading") await new Promise((r) => document.addEventListener("DOMContentLoaded", r));
    build();
    renderTabs();
    if (store.get(SHOWN, "") === "yes" || unlocked.length) corner.hidden = false;
  })();

  function build() {
    corner = document.createElement("button");
    corner.className = "dict-corner";
    corner.hidden = true;
    corner.setAttribute("aria-label", "Open your dictionary");
    corner.addEventListener("click", (e) => { e.stopPropagation(); isOpen() ? close() : open(); });

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
    overlay.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) close(); });

    document.body.append(overlay, corner);
  }

  const isOpen = () => overlay && !overlay.hidden;

  function poke() {
    corner.hidden = false;
    corner.classList.remove("poke");
    void corner.offsetWidth;
    corner.classList.add("poke");
  }

  // Shows the corner (with an empty dictionary if no words are unlocked yet).
  function reveal() {
    ready.then(() => {
      const first = store.get(SHOWN, "") !== "yes";
      store.set(SHOWN, "yes");
      if (first || corner.hidden) poke();
    });
  }

  function add(word) {
    word = String(word || "").toLowerCase();
    if (!word) return;
    if (!unlocked.includes(word)) { unlocked.push(word); save(); }
    if (!current) current = word;
    ready.then(() => {
      if (!entries[word]) console.warn("No dictionary entry for", word);
      store.set(SHOWN, "yes");
      poke();
      renderTabs();
    });
  }

  function open() {
    if (typeof Stickers !== "undefined") Stickers.close();
    overlay.hidden = false;
    document.body.classList.add("dict-open");
    corner.classList.remove("beckon");
    corner.classList.add("is-open");
    renderPage(current, false);
    openWaiters.splice(0).forEach((r) => r());
    checkPage();
  }

  function close() {
    if (!overlay) return;
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
    if (!tabs) return;
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
    if (!word) {
      // The cover: no words yet.
      const c = cover || { heading: "Twerp's Dictionary", body: "" };
      page.innerHTML = `
        <header class="dict-guide"><span>${escape(c.guide || "Contents")}</span><span>i</span></header>
        <h2 class="dict-head">${escape(c.title || "Twerp's Dictionary")}</h2>
        <div class="dict-body">${html(c.body)}</div>`;
      return;
    }
    const e = entries[word] || { body: "" };
    if (e.cite && typeof Stickers !== "undefined") Stickers.award(e.cite);
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
  async function waitOpen() {
    await ready;
    if (isOpen()) return;
    corner.hidden = false;
    corner.classList.add("beckon");
    return new Promise((r) => openWaiters.push(r));
  }

  // Resolves once the dictionary is open on `word`.
  async function waitPage(word) {
    await ready;
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

  // Kept so older page code that calls init() still works; the dictionary now sets itself up.
  function init() {}

  return { ready, init, add, reveal, open, close, isOpen, waitOpen, waitPage };
})();
