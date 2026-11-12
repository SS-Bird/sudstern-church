/*
 * The fake newsletter pop-up (text in script/newsletter.md). Shown once per browser tab: after a few seconds,
 * or on the reader's first click (which it swallows). Closing it reveals the dictionary and the sticker book.
 * Nothing typed into it is stored or sent.
 */
(() => {
  const { load, one, inline, html, escape, store } = Content;
  const KEY = "newsletterShown";
  if (store.get(KEY, "") === "yes") return;

  let shown = false;
  let settings = {}, labels = {};
  const loaded = load("newsletter").then((b) => { settings = one(b, "Popup"); labels = one(b, "Labels"); }).catch(() => {});

  // The first click anywhere opens the pop-up instead of doing what it would have done.
  function onFirstClick(e) {
    if (shown) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    show();
  }
  document.addEventListener("click", onFirstClick, true);

  loaded.then(() => setTimeout(show, (parseFloat(settings.delay_s) || 3) * 1000));

  async function show() {
    if (shown) return;
    shown = true;
    document.removeEventListener("click", onFirstClick, true);
    await loaded;
    const s = settings;
    const box = document.createElement("div");
    box.className = "newsletter";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Newsletter");
    box.innerHTML = `
      <div class="newsletter-card">
        <button class="newsletter-x" aria-label="Close">✕</button>
        <h2>${inline(s.title || "Join our newsletter!")}</h2>
        <div class="newsletter-body">${html(s.body || "")}</div>
        <form class="newsletter-form" onsubmit="return false">
          <input type="email" placeholder="${escape(s.email_placeholder || "you@example.com")}" aria-label="Email (not sent anywhere)" autocomplete="off">
          <button type="submit" class="newsletter-yes">${inline(s.button || "Sign me up!")}</button>
        </form>
        <button class="newsletter-no">${inline(s.decline || "No thanks")}</button>
        ${s.small_print ? `<p class="newsletter-small">${inline(s.small_print)}</p>` : ""}
      </div>`;
    // Clicks inside never reach the page behind.
    box.addEventListener("click", (e) => e.stopPropagation());
    document.body.append(box);
    const close = () => finish(box);
    box.querySelector(".newsletter-form").addEventListener("submit", (e) => { e.preventDefault(); close(); });
    box.querySelector(".newsletter-no").addEventListener("click", close);
    box.querySelector(".newsletter-x").addEventListener("click", close);
    const esc = (e) => { if (e.key === "Escape") { document.removeEventListener("keydown", esc); close(); } };
    document.addEventListener("keydown", esc);
    box.querySelector("input").focus({ preventScroll: true });
  }

  // Closing hands over the free gifts: both page corners appear, each with a label for a few seconds.
  function finish(box) {
    if (box.classList.contains("closing")) return;
    store.set(KEY, "yes");
    box.querySelector("input").value = ""; // never kept
    box.classList.add("closing");
    setTimeout(() => box.remove(), 350);
    const tasks = [];
    if (typeof Dictionary !== "undefined") { Dictionary.reveal(); tasks.push(Dictionary.ready); }
    if (typeof Stickers !== "undefined") { Stickers.reveal(); tasks.push(Stickers.ready); }
    Promise.all(tasks).then(() => setTimeout(showLabels, 500));
  }

  function showLabels() {
    const wrap = document.createElement("div");
    wrap.className = "gift-labels";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
      ${typeof Dictionary !== "undefined" ? `<span class="gift-label gift-dict">↙ ${inline(labels.dictionary || "your free dictionary")}</span>` : ""}
      ${typeof Stickers !== "undefined" ? `<span class="gift-label gift-stickers">↙ ${inline(labels.stickers || "your free sticker book")}</span>` : ""}`;
    document.body.append(wrap);
    setTimeout(() => wrap.classList.add("fade"), (parseFloat(labels.show_s) || 6) * 1000);
    setTimeout(() => wrap.remove(), (parseFloat(labels.show_s) || 6) * 1000 + 800);
  }
})();
