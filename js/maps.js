/* Scene 2 — shared by sudstern.html and rant.html (see <body data-page="...">). */
(async function () {
  const { load, all, one, escape, inline, html, showError } = Content;
  const $ = (id) => document.getElementById(id);
  const pageType = document.body.dataset.page;

  // The Sudstern file is always needed: it decides which searches count as "Sudstern".
  let sudstern, rant;
  try {
    [sudstern, rant] = await Promise.all([
      load("scene2-sudstern"),
      pageType === "rant" ? load("scene2-rant") : Promise.resolve(null),
    ]);
  } catch (err) {
    showError(err);
    return;
  }

  const settings = one(sudstern, "Settings");
  const accepted = (settings.accepted_searches || settings.search_text || "")
    .split(",").map(normalize).filter(Boolean);
  const query = new URLSearchParams(location.search).get("q") || "";

  // ── Search bar ─────────────────────────────────────────
  const input = $("q");
  input.value = pageType === "rant" ? query : (settings.search_text || settings.place_name || "");

  $("search").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    if (accepted.includes(normalize(value))) {
      if (pageType !== "sudstern") location.href = "sudstern.html";
    } else {
      location.href = "rant.html?q=" + encodeURIComponent(value);
    }
  });

  function normalize(s) {
    return String(s).toLowerCase().replace(/\s+/g, " ").trim();
  }

  // ── Page content ───────────────────────────────────────
  function renderSudstern() {
    $("place-name").textContent = settings.place_name || "";
    document.title = settings.place_name || document.title;
    $("place-sub").textContent = settings.subtitle || "";
    const reviews = all(sudstern, "Review");
    const count = settings.review_count || reviews.length;
    if (settings.rating) {
      $("place-rating").innerHTML =
        `<span class="num">${escape(settings.rating)}</span>
         <span class="stars">${stars(settings.rating)}</span>
         <span>(${escape(count)})</span>`;
    }
    reviews.forEach((r, i) => $("reviews").append(reviewEl(r, i, true)));
    carousel(all(sudstern, "Photo"));
  }

  function renderRant() {
    const s = one(rant, "Settings");
    const title = (s.title || "{query}").replace(/\{query\}/g, query);
    $("place-name").textContent = title;
    document.title = title || document.title;
    $("place-sub").textContent = s.subtitle || "";
    all(rant, "Rant").forEach((r, i) => $("reviews").append(reviewEl(r, i, false)));
    carousel(all(rant, "Photo"));
  }

  // ── Review cards ───────────────────────────────────────
  const COLORS = ["#1a73e8", "#e8710a", "#188038", "#a142f4", "#d93025", "#12a4af", "#c5221f"];

  function reviewEl(r, i, foldable) {
    const name = r.author || r.heading;
    const url = r.url && /^https?:\/\//.test(r.url) ? r.url : "";
    const nameHtml = url
      ? `<a class="review-author" href="${escape(url)}" target="_blank" rel="noopener">${escape(name)}</a>`
      : `<span class="review-author">${escape(name)}</span>`;
    const sub = [
      r.rating ? `<span class="stars">${stars(r.rating)}</span>` : "",
      r.date ? `<span>${escape(r.date)}</span>` : "",
    ].join("");

    const el = document.createElement("article");
    el.className = "review";
    el.innerHTML = `
      <div class="review-head">
        <div class="avatar" style="background:${COLORS[i % COLORS.length]}">${escape(name.trim().charAt(0).toUpperCase())}</div>
        <div>
          ${nameHtml}
          ${url ? `<div class="review-meta">${escape(hostname(url))}</div>` : ""}
        </div>
      </div>
      ${sub ? `<div class="review-sub">${sub}</div>` : ""}
      <div class="review-text">${html(r.body)}</div>
      <div class="review-actions">
        ${url ? `<a class="source-link" href="${escape(url)}" target="_blank" rel="noopener">View original ↗</a>` : ""}
      </div>`;

    if (foldable) {
      // Fold long reviews once they're in the page and can be measured.
      requestAnimationFrame(() => {
        const text = el.querySelector(".review-text");
        if (text.scrollHeight <= 190) return;
        text.classList.add("clamped");
        const btn = document.createElement("button");
        btn.className = "more-btn";
        btn.textContent = "More";
        btn.addEventListener("click", () => {
          const folded = text.classList.toggle("clamped");
          btn.textContent = folded ? "More" : "Less";
        });
        el.querySelector(".review-actions").prepend(btn);
      });
    }
    return el;
  }

  function hostname(u) {
    try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; }
  }

  function stars(r) {
    const n = Math.max(0, Math.min(5, parseFloat(r) || 0));
    return "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
  }

  // ── Photo carousel ─────────────────────────────────────
  function carousel(photos) {
    const track = $("slides");
    const viewer = $("viewer");
    const dots = $("dots");
    let index = 0;

    photos.forEach((p, i) => {
      const slide = document.createElement("div");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-label", `Photo ${i + 1} of ${photos.length}`);
      if (p.image) {
        slide.className = "slide";
        const frame = document.createElement("div");
        frame.className = "frame";
        frame.innerHTML = `<img src="${escape(p.image)}" alt="${escape(p.alt || "")}" draggable="false">`;
        if (/^(yes|true)$/i.test(p.plane || "")) frame.append(planeEl(p));
        slide.append(frame);
      } else {
        slide.className = "slide text-slide";
        slide.innerHTML = `<div class="slide-text">${html(p.body)}</div>`;
      }
      track.append(slide);

      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dots.append(dot);
    });

    function go(i) {
      index = Math.max(0, Math.min(photos.length - 1, i));
      track.style.transform = `translateX(${-100 * index}%)`;
      $("prev").disabled = index === 0;
      $("next").disabled = index === photos.length - 1;
      $("counter").textContent = `${index + 1} / ${photos.length}`;
      [...dots.children].forEach((d, j) => d.classList.toggle("active", j === index));
      viewer.classList.toggle("on-white", !photos[index].image);
      // Only the visible slide's controls (e.g. the plane) can be tabbed to.
      [...track.children].forEach((s, j) => (s.inert = j !== index));
    }

    $("prev").addEventListener("click", () => go(index - 1));
    $("next").addEventListener("click", () => go(index + 1));
    document.addEventListener("keydown", (e) => {
      if (document.activeElement === input) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    // Swipe on touch screens
    let startX = null;
    viewer.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") startX = e.clientX; });
    viewer.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    });

    if (photos.length <= 1) {
      $("prev").hidden = $("next").hidden = dots.hidden = $("counter").hidden = true;
    }
    go(0);
  }

  function planeEl(p) {
    const btn = document.createElement("button");
    btn.className = "plane";
    btn.setAttribute("aria-label", "A little plane");
    btn.style.top = (parseFloat(p.plane_top) || 8) + "%";
    btn.style.left = (parseFloat(p.plane_left) || 50) + "%";
    btn.style.width = (parseFloat(p.plane_width) || 10) + "%";
    btn.innerHTML = `<img src="${escape(p.plane_image || "assets/scene2/plane.svg")}" alt="" draggable="false">`;
    btn.addEventListener("click", () => { location.href = "scene3.html"; });
    return btn;
  }

  if (pageType === "sudstern") renderSudstern();
  else renderRant();
})();
