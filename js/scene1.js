/* Scene 1 — the kitschy Top 10 list, the Marx ads and the three strikes. */
(async function () {
  const { load, all, one, escape, inline, html, showError, store } = Content;

  let page, churches, ads, quotes;
  try {
    [page, churches, ads, quotes] = await Promise.all(
      ["scene1-page", "scene1-churches", "scene1-ads", "scene1-marx"].map(load)
    );
  } catch (err) {
    showError(err);
    return;
  }

  const $ = (id) => document.getElementById(id);
  const info = one(page, "Page");

  // ── Page text ──────────────────────────────────────────
  $("site-name").textContent = info.site_name || "";
  $("page-header").textContent = info.header || "";
  $("byline").textContent = info.byline || "";
  $("intro").innerHTML = html(info.body);
  $("list-title").textContent = info.list_title || "";
  $("site-footer").innerHTML = html(one(page, "Footer").body);

  // ── Ads ────────────────────────────────────────────────
  const adList = all(ads, "Ad");
  const CARS = ["🚗", "🚙", "🚕", "🏎️", "🚐", "🚘"];

  function adEl(ad, i) {
    const el = document.createElement("div");
    el.className = `ad ad--${ad.look || "yellow"}`;
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.innerHTML = `
      <span class="ad-label">Advertisement</span>
      <div class="ad-brand">${inline(ad.brand)}</div>
      <div class="ad-car" aria-hidden="true">${CARS[i % CARS.length]}</div>
      <div class="ad-headline">${inline(ad.headline)}</div>
      <div class="ad-body">${html(ad.body)}</div>
      ${ad.button ? `<span class="ad-button">${inline(ad.button)}</span>` : ""}`;
    el.addEventListener("click", showMarx);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showMarx(); }
    });
    return el;
  }

  adList
    .filter((a) => a.placement === "sidebar")
    .forEach((a, i) => $("ad-sidebar").append(adEl(a, i)));

  const footerAd = adList.find((a) => a.placement === "footer");
  if (footerAd) {
    const el = adEl(footerAd, 3);
    const dismiss = document.createElement("button");
    dismiss.className = "ad-dismiss";
    dismiss.setAttribute("aria-label", "Close ad");
    dismiss.textContent = "✕";
    dismiss.addEventListener("click", (e) => {
      e.stopPropagation();
      $("ad-footer").remove();
      document.body.style.paddingBottom = "24px";
    });
    el.append(dismiss);
    $("ad-footer").append(el);
  }

  // ── Church list (inline ads after every second entry) ──
  const inlineAds = adList.filter((a) => a.placement === "inline");
  const list = $("church-list");

  churches.forEach((c, i) => {
    const toScene2 = c.goes_to === "scene2";
    const href = toScene2 ? "sudstern.html" : "#";
    const li = document.createElement("li");
    li.className = "church" + (i === 0 ? " is-top" : "");
    li.innerHTML = `
      <div class="rank">#${i + 1}</div>
      <h3><a href="${href}" class="go">${escape(c.heading)}</a></h3>
      <div class="meta">📍 ${inline(c.location)} &nbsp;·&nbsp; <span class="stars">${stars(c.rating)}</span></div>
      <a href="${href}" class="photo go">
        <img src="${escape(c.image)}" alt="${escape(c.caption || c.heading)}" loading="lazy">
        ${c.caption ? `<span class="caption">${inline(c.caption)}</span>` : ""}
      </a>
      <div class="blurb">${html(c.body)}</div>
      <a href="${href}" class="read-more go">Read more →</a>`;
    if (!toScene2) {
      li.querySelectorAll(".go").forEach((a) =>
        a.addEventListener("click", (e) => { e.preventDefault(); strike(); })
      );
    }
    list.append(li);
    if (i % 2 === 0 && inlineAds.length) list.append(adEl(inlineAds.shift(), i + 1));
  });

  function stars(r) {
    const n = Math.max(0, Math.min(5, parseFloat(r) || 0));
    const full = Math.floor(n);
    return "★".repeat(full) + (n - full >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(n));
  }

  // ── Red Marx screen ────────────────────────────────────
  const quoteList = all(quotes, "Quote");
  let quoteIndex = Number(store.get("marxIndex", 0)) || 0;
  let lastFocus = null;

  function showMarx() {
    if (!quoteList.length) return;
    const q = quoteList[quoteIndex % quoteList.length];
    quoteIndex++;
    store.set("marxIndex", quoteIndex);
    $("marx-quote").innerHTML = inline(q.body);
    $("marx-source").innerHTML = "— " + inline(q.source);
    open($("marx"), $("marx-close"));
  }
  $("marx-close").addEventListener("click", () => close($("marx")));

  // ── Three strikes ──────────────────────────────────────
  const strikes = [1, 2, 3].map((n) => one(page, `Strike ${n}`));

  function strike() {
    const count = Math.min(3, (Number(store.get("strikes", 0)) || 0) + 1);
    store.set("strikes", count);
    const s = strikes[count - 1];
    $("strike-text").innerHTML = inline(s.body);
    const back = $("strike-back");
    const leave = $("strike-leave");
    if (count < 3) {
      back.hidden = false;
      back.textContent = s.button || "Back";
      leave.hidden = true;
      open($("strike"), back);
    } else {
      back.hidden = true;
      leave.hidden = false;
      leave.textContent = s.button || "Leave";
      leave.href = s.link || "#";
      open($("strike"), leave);
    }
  }
  $("strike-back").addEventListener("click", () => close($("strike")));

  // ── Overlay helpers ────────────────────────────────────
  function open(overlay, focusEl) {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    focusEl.focus();
  }
  function close(overlay) {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("marx").hidden) close($("marx"));
    // Strike 3 can't be escaped: the only way out is Leave.
    else if (!$("strike").hidden && $("strike-leave").hidden) close($("strike"));
  });
})();
