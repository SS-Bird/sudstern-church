/*
 * The sticker book. Every reference the reader meets earns a sticker (one per author/source),
 * on every page. Stickers are remembered for the browser tab (Content.store).
 *
 * - The registry is script/stickers.md: `## <id>` with `author`, `label`, `art`, `citation`.
 * - Anything with `cite: <id>` (or `cite: id1, id2`) awards stickers when shown/opened;
 *   pages call Stickers.award(), or Stickers.observe(el, ids) to award when an element scrolls into view.
 * - Collecting is silent until Stickers.reveal() (the newsletter pop-up). From then on the page corner
 *   shows on every page and each new sticker flies into it.
 * - Art lives in assets/stickers/<art>.svg and is inlined so hover animations can move its parts.
 * - ?stickers on any page reveals the corner straight away (for testing).
 */
const Stickers = (() => {
  const { load, one, escape, inline, html, store } = Content;
  const OWNED = "stickers";
  const SHOWN = "stickerBookShown";
  let registry = []; // [{ id, author, label, art, citation, body }]
  let byId = {};
  let corner, overlay, grid, countEl;
  const artCache = {};

  const owned = () => { try { return JSON.parse(store.get(OWNED, "[]")) || []; } catch { return []; } };
  const isShown = () => store.get(SHOWN, "") === "yes";

  // ── Setup ──────────────────────────────────────────────
  const ready = (async () => {
    try {
      const blocks = await load("stickers");
      registry = blocks.filter((b) => b.heading && !/\s/.test(b.heading.trim())).map((b) => ({ ...b, id: b.heading.trim().toLowerCase() }));
      registry.forEach((s) => (byId[s.id] = s));
    } catch (err) {
      console.warn("Sticker registry (script/stickers.md) didn't load:", err);
    }
    if (document.readyState === "loading") await new Promise((r) => document.addEventListener("DOMContentLoaded", r));
    build();
    if (new URLSearchParams(location.search).has("stickers")) store.set(SHOWN, "yes");
    if (isShown()) corner.hidden = false;
  })();

  function build() {
    corner = document.createElement("button");
    corner.className = "sticker-corner";
    corner.hidden = true;
    corner.setAttribute("aria-label", "Open your sticker book");
    corner.addEventListener("click", (e) => { e.stopPropagation(); isOpen() ? close() : open(); });

    overlay = document.createElement("div");
    overlay.className = "sticker-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Sticker book");
    overlay.innerHTML = `
      <div class="sticker-page">
        <header class="sticker-guide"><span>Sticker book</span><span class="sticker-count"></span></header>
        <div class="sticker-grid"></div>
      </div>
      <button class="sticker-close" aria-label="Close sticker book">✕</button>`;
    grid = overlay.querySelector(".sticker-grid");
    countEl = overlay.querySelector(".sticker-count");
    overlay.querySelector(".sticker-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) close(); });
    document.body.append(overlay, corner);
  }

  // ── Art ────────────────────────────────────────────────
  function artUrl(s) {
    const a = (s && s.art) || "";
    return a.includes("/") ? a : `assets/stickers/${a || "blank"}.svg`;
  }
  async function art(s) {
    const url = artUrl(s);
    if (!(url in artCache)) {
      artCache[url] = fetch(url).then((r) => (r.ok ? r.text() : "")).catch(() => "");
    }
    const svg = await artCache[url];
    return svg.replace(/<\?xml[^>]*>/, "") || `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#f5c518"/></svg>`;
  }

  // ── Awarding ───────────────────────────────────────────
  const parse = (ids) => String(ids || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);

  function award(ids) {
    const list = parse(ids);
    if (!list.length) return;
    ready.then(() => {
      list.forEach((id) => {
        if (!byId[id]) { console.warn("No sticker called", id, "in script/stickers.md"); return; }
        const have = owned();
        if (have.includes(id)) return;
        have.push(id);
        store.set(OWNED, JSON.stringify(have));
        if (isShown()) flyIn(byId[id]);
        if (isOpen()) render();
      });
    });
  }

  // Awards once the element is at least half on screen.
  function observe(el, ids) {
    if (!parse(ids).length || !el) return;
    if (!("IntersectionObserver" in window)) { award(ids); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { award(ids); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
  }

  // "Stuck on": the sticker pops up in the middle of the screen, then flies into the corner.
  async function flyIn(s) {
    const el = document.createElement("div");
    el.className = "sticker-fly";
    el.innerHTML = await art(s);
    document.body.append(el);
    const c = corner.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const dx = c.left + c.width * 0.35 - (box.left + box.width / 2);
    const dy = c.top + c.height * 0.65 - (box.top + box.height / 2);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anim = el.animate([
      { transform: "translate(0, 0) scale(0) rotate(-30deg)", opacity: 0 },
      { transform: "translate(0, 0) scale(1.15) rotate(6deg)", opacity: 1, offset: 0.25 },
      { transform: "translate(0, 0) scale(1) rotate(-4deg)", opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.18) rotate(20deg)`, opacity: 0.9 },
    ], { duration: calm ? 600 : 1500, easing: "cubic-bezier(.4, 0, .3, 1)" });
    anim.onfinish = () => {
      el.remove();
      corner.classList.remove("stuck");
      void corner.offsetWidth;
      corner.classList.add("stuck");
    };
  }

  function reveal() {
    ready.then(() => {
      const first = !isShown();
      store.set(SHOWN, "yes");
      corner.hidden = false;
      if (first) {
        corner.classList.remove("poke");
        void corner.offsetWidth;
        corner.classList.add("poke");
      }
    });
  }

  // ── The book ───────────────────────────────────────────
  const isOpen = () => overlay && !overlay.hidden;

  async function render() {
    const have = owned();
    countEl.textContent = `${registry.filter((s) => have.includes(s.id)).length} / ${registry.length}`;
    const cells = await Promise.all(registry.map(async (s) => {
      if (!have.includes(s.id)) return `<div class="sticker-slot empty" aria-label="Empty sticker space"></div>`;
      return `
        <figure class="sticker-slot">
          <div class="sticker art-${escape(s.art || "")}" title="${escape(s.label || s.author || s.id)}">${await art(s)}</div>
          <figcaption>
            <strong>${inline(s.label || s.author || s.id)}</strong>
            <span class="sticker-cite">${inline(s.citation || "")}</span>
            ${s.body ? `<span class="sticker-cite">${html(s.body)}</span>` : ""}
          </figcaption>
        </figure>`;
    }));
    grid.innerHTML = cells.join("");
  }

  async function open() {
    await ready;
    if (typeof Dictionary !== "undefined" && Dictionary.close) Dictionary.close();
    await render();
    overlay.hidden = false;
    document.body.classList.add("stickers-open");
    corner.classList.add("is-open");
    overlay.querySelector(".sticker-close").focus({ preventScroll: true });
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("stickers-open");
    corner.classList.remove("is-open");
  }

  return { ready, award, observe, reveal, open, close, isOpen, owned };
})();
