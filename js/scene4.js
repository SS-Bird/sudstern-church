/* Scene 4 — zooming out. A black-and-white map with only the church in red; question pairs zoom it out. */
(async function () {
  const { load, all, one, inline, showError, escape: escapeHtml } = Content;
  const $ = (id) => document.getElementById(id);
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let data, footprint = null;
  try {
    data = await load("scene4");
  } catch (err) {
    showError(err);
    return;
  }
  const S = one(data, "Settings");
  const levels = all(data, "Zoom");
  let center = [num(S.church_lat, 52.48925), num(S.church_lng, 13.40652)];
  const hintMs = num(S.hint_after_s, 8) * 1000;
  const redFadeMs = num(S.red_fade_in_s, 5) * 1000;
  const flyS = num(S.fly_s, 3);

  try {
    footprint = await (await fetch(S.footprint || "assets/scene4/church-footprint.geojson")).json();
  } catch (err) {
    console.warn("No church footprint, using a dot instead", err);
  }
  // Centre on the middle of the building's footprint, unless the script gives exact coordinates.
  if (footprint && !S.church_lat) {
    const c = L.geoJSON(footprint).getBounds().getCenter();
    center = [c.lat, c.lng];
  }

  // ── The map ────────────────────────────────────────────
  const map = L.map("map", {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    zoomSnap: 0,
    maxZoom: 23,
    fadeAnimation: true,
  }).setView(center, num(levels[0] && levels[0].zoom, 22));

  L.tileLayer(S.tiles || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxNativeZoom: num(S.tiles_max_zoom, 19),
    maxZoom: 23,
    attribution: S.attribution || "",
  }).addTo(map);

  const red = S.red || "#e10600";
  if (footprint) L.geoJSON(footprint, { interactive: false, style: { color: red, weight: 0, fillColor: red, fillOpacity: 1 } }).addTo(map);
  // Once the building is smaller than a few pixels, a dot keeps it visible as a red speck.
  const speck = L.circleMarker(center, { radius: 3.5, stroke: false, fillColor: red, fillOpacity: 1, interactive: false });
  const speckFrom = num(S.speck_below_zoom, 15.5);
  const updateSpeck = () => (map.getZoom() < speckFrom ? speck.addTo(map) : speck.remove());
  map.on("zoomend", updateSpeck);
  updateSpeck();

  // ── Questions ──────────────────────────────────────────
  const box = $("questions");
  const hint = $("hint");
  let advance = null;
  function next() { if (advance) { const a = advance; advance = null; a(); } }
  // Clicks on the sticker book (corner or open book) don't move the story on.
  const onBook = (t) => t.closest && t.closest("a, .sticker-corner, .sticker-overlay, .dict-corner, .dict-overlay, .newsletter");
  const bookOpen = () => Stickers.isOpen() || Dictionary.isOpen() || document.querySelector(".newsletter");
  document.addEventListener("click", (e) => { if (!onBook(e.target) && !bookOpen()) next(); });
  document.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !bookOpen() && !onBook(document.activeElement)) { e.preventDefault(); next(); }
  });

  function waitForReader() {
    return new Promise((resolve) => {
      advance = resolve;
      // Only a click moves on. If the reader waits a while, a small "click to continue" appears.
      const t = setTimeout(() => hint.classList.add("show"), hintMs);
      const done = advance;
      advance = () => { clearTimeout(t); done(); };
    });
  }

  function fly(level) {
    return new Promise((resolve) => {
      const z = num(level.zoom, map.getZoom());
      if (Math.abs(z - map.getZoom()) < 0.01) return resolve();
      map.once("moveend", resolve);
      if (calm) map.setView(center, z, { animate: false });
      else map.flyTo(center, z, { duration: flyS, easeLinearity: 0.2 });
    });
  }

  async function play() {
    // The red fades in slowly over the map before the first questions.
    await sleep(400);
    $("solid-red").style.transitionDuration = redFadeMs + "ms";
    $("solid-red").classList.remove("off");
    await sleep(redFadeMs + 300);
    $("solid-red").style.transitionDuration = "";
    // LV and RV talk one last time over the red, then their lines fade before the questions start.
    if (Dialogue.has("ending")) {
      await Dialogue.run("ending");
      await sleep(2500);
      $("dialogue").classList.add("done");
      await sleep(1400);
      $("dialogue").hidden = true;
    }
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      $("solid-red").classList.toggle("off", !/^(yes|true)$/i.test(level.solid || ""));
      if (i > 0) await fly(level);
      $("q-you").innerHTML = inline(level.you || "");
      $("q-place").innerHTML = inline(level.place || "");
      box.classList.add("show");
      await sleep(900);
      await waitForReader();
      hint.classList.remove("show");
      box.classList.remove("show");
      await sleep(900);
    }
    // Hold on the speck, then "The end. The end. The end." rolls away into the distance, forever.
    await sleep(num(S.restart_delay_s, 3) * 1000);
    if (S.the_end !== "") {
      const phrase = (S.the_end || "The end.") + " ";
      const para = `<p>${escapeHtml(phrase.repeat(num(S.the_end_repeat, 60)))}</p>`;
      // Two identical halves: the track moves up by exactly one half, then loops, so it never ends.
      const track = $("crawl-track");
      track.innerHTML = para + para;
      $("crawl").hidden = false;
      // First it rolls in from the bottom, then it loops: same speed for both, so there's no jump.
      const loopS = num(S.the_end_speed_s, 60);
      const half = track.offsetHeight / 2;
      const introS = (window.innerHeight / half) * loopS;
      track.style.animation = `crawl-intro ${introS}s linear, crawl-roll ${loopS}s linear ${introS}s infinite`;
      await sleep(3000);
    }
    const restart = $("restart");
    restart.textContent = S.restart_label || "Start again";
    restart.href = S.restart_page || "index.html";
    restart.addEventListener("click", () => { try { sessionStorage.clear(); } catch { /* ignore */ } });
    restart.hidden = false;
  }

  Dialogue.init({ container: $("dialogue"), typeSpeed: S.type_speed_ms });
  Dialogue.add(data.filter((b) => !/^(settings|zoom)$/i.test(b.heading)));

  if (!levels.length) {
    showError(new Error("script/scene4.md has no ## Zoom blocks"));
    return;
  }
  play();
})();
