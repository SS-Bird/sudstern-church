/* Scene 2 — shared by sudstern.html and rant.html (see <body data-page="...">). */
(async function () {
  const { load, all, one, escape, inline, html, showError } = Content;
  const $ = (id) => document.getElementById(id);
  const pageType = document.body.dataset.page;

  // The Sudstern file is always needed: it decides which searches count as "Sudstern".
  let sudstern, rant, profileFile;
  try {
    [sudstern, rant, profileFile] = await Promise.all([
      load("scene2-sudstern"),
      pageType === "rant" ? load("scene2-rant") : Promise.resolve(null),
      pageType === "sudstern" ? load("scene2-profile") : Promise.resolve(null),
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
    // Each ## Reply belongs to the ## Review above it.
    const reviews = [];
    sudstern.forEach((b) => {
      const h = b.heading.toLowerCase();
      if (h === "review") reviews.push({ ...b, replies: [] });
      else if (h === "reply" && reviews.length) reviews[reviews.length - 1].replies.push(b);
    });
    const count = settings.review_count || reviews.length;
    if (settings.rating) {
      $("place-rating").innerHTML =
        `<span class="num">${escape(settings.rating)}</span>
         <span class="stars">${stars(settings.rating)}</span>
         <span>(${escape(count)})</span>`;
    }
    setUpProfile(one(profileFile, "Profile"), one(profileFile, "Quote"));
    reviews.forEach((r, i) => $("reviews").append(reviewEl(r, i, true)));
    carousel(all(sudstern, "Photo"));
  }

  // ── Replies + the replier's profile page ───────────────
  let profile = null;
  const handle = (name) => "@" + String(name || "").replace(/^@/, "");

  function avatarHtml(src, name, color, cls = "") {
    return src
      ? `<img class="avatar avatar-img ${cls}" src="${escape(src)}" alt="">`
      : `<div class="avatar ${cls}" style="background:${color}">${escape(String(name).replace(/^@/, "").trim().charAt(0).toUpperCase())}</div>`;
  }

  function repliesEl(list) {
    const wrap = document.createElement("div");
    wrap.className = "thread";
    const btn = document.createElement("button");
    btn.className = "thread-toggle";
    const label = (open) => `${open ? "▴ Hide" : "▾ View"} ${list.length} ${list.length === 1 ? "reply" : "replies"}`;
    btn.textContent = label(false);
    const box = document.createElement("div");
    box.className = "replies";
    box.hidden = true;
    list.forEach((r) => {
      const name = r.author || "DissemiNadia";
      const el = document.createElement("div");
      el.className = "reply";
      el.innerHTML = `
        ${avatarHtml(r.avatar || (profile && profile.avatar), name, "#8e24aa", "avatar-sm")}
        <div class="reply-main">
          <button class="reply-author">${escape(handle(name))}</button>
          ${r.date ? `<span class="reply-date">${escape(r.date)}</span>` : ""}
          <div class="reply-text">${html(r.body)}</div>
        </div>`;
      el.querySelector(".reply-author").addEventListener("click", openProfile);
      box.append(el);
    });
    btn.addEventListener("click", () => {
      if (box.hidden) list.forEach((r) => r.cite && Stickers.award(r.cite));
      box.hidden = !box.hidden;
      btn.textContent = label(!box.hidden);
    });
    wrap.append(btn, box);
    return wrap;
  }

  let pinned = null;
  function setUpProfile(p, pin) {
    profile = p && p.name ? p : null;
    pinned = pin && pin.body ? pin : null;
    $("profile-back").addEventListener("click", closeProfile);
  }

  function openProfile() {
    if (!profile) return;
    const pane = $("profile");
    pane.querySelector(".profile-body").innerHTML = `
      <div class="profile-head">
        ${avatarHtml(profile.avatar, profile.name, "#8e24aa", "avatar-lg")}
        <div>
          <h2>${escape(handle(profile.name))}</h2>
          <div class="profile-meta">
            ${profile.joined ? `<span>${escape(profile.joined)}</span>` : ""}
            ${profile.replies ? `<span>${escape(profile.replies)}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="profile-bio">${bioHtml()}</div>`;
    pane.hidden = false;
    if (profile.cite) Stickers.award(profile.cite);
    $("panel").classList.add("show-profile");
    $("panel").scrollTop = 0;
    $("profile-back").focus({ preventScroll: true });
  }

  // The profile's content: the bio (if any), with the quote where the bio says {quote} (or after it).
  function bioHtml() {
    const quote = pinned ? `
      <figure class="profile-quote">
        <blockquote>${html(pinned.body)}</blockquote>
        ${pinned.attribution ? `<figcaption>${inline(pinned.attribution)}</figcaption>` : ""}
      </figure>` : "";
    const parts = String(profile.body || "").split(/^\s*\{quote\}\s*$/m);
    return parts.length > 1 ? html(parts[0]) + quote + html(parts.slice(1).join("")) : html(profile.body) + quote;
  }

  function closeProfile() {
    $("profile").hidden = true;
    $("panel").classList.remove("show-profile");
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
    // A review by the profile's owner links to the profile and uses its avatar.
    const isProfile = profile && name.replace(/^@/, "") === profile.name.replace(/^@/, "");
    const nameHtml = isProfile
      ? `<button class="review-author reply-author">${escape(handle(name))}</button>`
      : url
      ? `<a class="review-author" href="${escape(url)}" target="_blank" rel="noopener">${escape(name)}</a>`
      : `<span class="review-author">${escape(name)}</span>`;
    // `rating: 5 and 1` shows two star ratings at once.
    const ratings = String(r.rating || "").split(/\s+and\s+/i).filter((x) => x.trim());
    const sub = [
      ratings.length ? ratings.map((x) => `<span class="stars">${stars(x)}</span>`).join(`<span class="stars-and">and</span>`) : "",
      r.date ? `<span>${escape(r.date)}</span>` : "",
    ].join("");

    const el = document.createElement("article");
    el.className = "review";
    el.innerHTML = `
      <div class="review-head">
        ${isProfile
          ? avatarHtml(r.avatar || profile.avatar, name, "#8e24aa")
          : r.avatar
          ? `<img class="avatar avatar-img" src="${escape(r.avatar)}" alt="">`
          : `<div class="avatar" style="background:${COLORS[i % COLORS.length]}">${escape(name.trim().charAt(0).toUpperCase())}</div>`}
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
    if (r.replies && r.replies.length) el.append(repliesEl(r.replies));
    if (r.cite) Stickers.observe(el, r.cite);
    if (isProfile) el.querySelector(".review-author").addEventListener("click", openProfile);

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
    btn.setAttribute("aria-label", "A little walking man");
    btn.style.top = (parseFloat(p.plane_top) || 8) + "%";
    btn.style.left = (parseFloat(p.plane_left) || 50) + "%";
    btn.style.width = (parseFloat(p.plane_width) || 10) + "%";
    btn.innerHTML = `<img src="${escape(p.plane_image || "assets/scene2/walking-man.svg")}" alt="" draggable="false">`;
    btn.addEventListener("click", () => { location.href = "scene3.html"; });
    return btn;
  }

  if (pageType === "sudstern") renderSudstern();
  else renderRant();
})();
