/* Scene 3 — walk down Hasenheide back to the church, the conversation, and 3.3a (statue) / 3.3b (church). */
(async function () {
  const { load, all, one, html, showError } = Content;
  const $ = (id) => document.getElementById(id);

  let data, talk, statueFile, churchFile;
  try {
    [data, talk, statueFile, churchFile] = await Promise.all(
      ["scene3", "scene3-dialogue", "scene3a", "scene3b"].map(load)
    );
  } catch (err) {
    showError(err);
    return;
  }

  // ── Settings ───────────────────────────────────────────
  const S = one(data, "Settings");
  // The API key lives in script/secrets.md (git-ignored). Missing file = no key = preview mode.
  try {
    const secret = one(await load("secrets"), "Settings");
    if (secret.api_key) S.api_key = secret.api_key;
  } catch { /* no secrets file */ }
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);
  const church = { lat: num(S.church_lat, 52.489246), lng: num(S.church_lng, 13.406337) };
  const start = { lat: num(S.start_lat, 52.48872), lng: num(S.start_lng, 13.410381) };
  const finalStep = num(S.final_step, 14);
  const threshold = num(S.move_threshold_m, 3);
  const roamMargin = num(S.roam_margin_m, 25);
  const units = (S.units || "unit-a, unit-b, unit-c").split(",").map((s) => s.trim()).filter(Boolean);
  const params = new URLSearchParams(location.search);
  const dev = params.has("dev");

  const stepText = {};
  const stepBlock = {};
  data.forEach((b) => {
    const m = b.heading.match(/^step\s+(\d+)$/i);
    if (m) { stepText[+m[1]] = b.body; stepBlock[+m[1]] = b; }
  });
  const spots = all(data, "Spot").map((s) => ({
    name: s.name || "spot",
    section: s.section || "", // a spot with its own section plays that instead of the next history unit
    lat: num(s.lat, 0),
    lng: num(s.lng, 0),
    radius: num(s.radius, 14),
    kind: (s.marker || (s.section ? "pastors" : "history")).toLowerCase(), // which floating marker it gets
    found: false,
    pin: null,
  }));
  // Floating markers in Street View, one per spot, so readers walk towards something. Set up in startStreetView.
  let showMarkers = () => {};
  const hideMarker = (s) => { if (s.pin) { s.pin.setMap(null); s.pin = null; } };

  // Cardboard cutouts (the pastors): each `## Cutout` in scene3.md is also a speaker in the dialogue.
  const cutouts = all(data, "Cutout").filter((c) => c.name);
  const speakers = {};
  cutouts.forEach((c, i) => {
    const side = c.side || (i % 2 ? "right" : "left");
    speakers[c.name] = { label: c.label || c.name, side, color: c.color, text: c.text_color };
    const fig = document.createElement("img");
    fig.className = "cutout cutout-" + side;
    fig.src = c.image || "";
    fig.alt = c.alt || `Cardboard cutout of ${c.label || c.name}`;
    fig.dataset.speaker = c.name.toLowerCase();
    fig.style.setProperty("--x", num(c.position, side === "right" ? 8 : 8) + "%");
    $("cutouts").append(fig);
  });
  document.addEventListener("dialogue:say", (e) => {
    $("cutouts").querySelectorAll(".cutout").forEach((f) => f.classList.toggle("speaking", f.dataset.speaker === e.detail.speaker));
  });

  const statue = Statue(one(statueFile, "Settings"));
  // Each ## Card after a ## Hotspot is another page of that hotspot's pop-up.
  const hotspots = [];
  churchFile.forEach((b) => {
    const h = b.heading.toLowerCase();
    if (h === "hotspot") hotspots.push({ ...b, cards: [b] });
    else if (h === "card" && hotspots.length) hotspots[hotspots.length - 1].cards.push(b);
  });
  const inside = Church(one(churchFile, "Settings"), hotspots);
  Dialogue.init({
    container: $("dialogue"),
    typeSpeed: S.type_speed_ms,
    speakers,
    actions: {
      "show cutouts": () => { $("cutouts").classList.add("show"); },
      "hide cutouts": () => {
        $("cutouts").classList.remove("show");
        $("cutouts").querySelectorAll(".speaking").forEach((f) => f.classList.remove("speaking"));
      },
      "statue flash": () => { inside.leave(); return statue.flash(); },
      "reveal monument": () => statue.reveal(),
      "dictionary add": (b) => Dictionary.add(b.word || ""),
      "wait for dictionary": () => Dictionary.waitOpen(),
      "wait for page": (b) => Dictionary.waitPage(b.word || ""),
      "close dictionary": () => Dictionary.close(),
      "show interior": () => { statue.leave(); inside.show(); },
      "hide statue": () => { statue.leave(); Dialogue.clear(); },
      "move to": (b) => moveTo(b),
      "wait for hotspots": (b) => inside.waitHotspots(b.count),
      "play sermon": () => inside.playSermon(),
      "wait for sermon": (b) => inside.waitSermon(b.at),
      "open page": (b) => goToPage(b.page),
    },
  });
  const pauseBtn = $("pause-btn");
  pauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const p = !Dialogue.isPaused();
    Dialogue.setPaused(p);
    pauseBtn.textContent = p ? "▶ Resume" : "❚❚ Pause";
    pauseBtn.setAttribute("aria-pressed", String(p));
  });

  Dialogue.add(talk);
  Dialogue.add(statueFile);
  Dialogue.add(churchFile.filter((b) => !/^(settings|hotspot|card)$/i.test(b.heading)));

  // Fade to black, then open the next page (e.g. Scene 4).
  function goToPage(page) {
    if (!page) return;
    document.body.classList.add("leaving");
    return new Promise(() => setTimeout(() => { location.href = page; }, 1600));
  }

  // ── Turn around (audio + Bonnie flash) ─────────────────
  const audio = new Audio(S.turn_around_audio || "assets/scene3/turn-around.mp3");
  audio.preload = "auto";
  const bonnie = $("bonnie");
  bonnie.style.backgroundImage = `url("${S.bonnie_image || "assets/scene3/bonnie.jpg"}")`;
  let lastTurn = 0;

  function turnAround() {
    const now = Date.now();
    if (now - lastTurn < 2000) return;
    lastTurn = now;
    if (S.turn_around_cite) Stickers.award(S.turn_around_cite);
    try { audio.currentTime = 0; } catch { /* not loaded yet */ }
    audio.play().catch(() => {});
    bonnie.classList.remove("go");
    void bonnie.offsetWidth;
    bonnie.classList.add("go");
  }

  // ── Progress ───────────────────────────────────────────
  let best = null, last = null, step = 0, finished = false, arrivedAt = null;
  const devInfo = {};

  function onPosition(d, pos) {
    if (best === null) {
      best = last = d;
    } else {
      const movedAway = d > last + threshold;
      if (movedAway && (!finished || d > arrivedAt + roamMargin)) turnAround();
      if (!finished && d < best - threshold) {
        best = d;
        step++;
        if (step >= finalStep) arrivedAt = d;
        showStep(step);
      }
      last = d;
    }
    if (pos && finished) checkSpots(pos);
    devInfo.distance = d.toFixed(1) + " m";
    devInfo.step = `${step} / ${finalStep}`;
    devInfo.spots = spots.map((s) => (s.found ? "✓" : "·") + s.name).join(" ");
    renderDev();
  }

  const caption = $("caption");
  function showStep(n) {
    if (n >= finalStep) {
      finished = true;
      caption.classList.remove("show");
      Dialogue.run("arrival").then(() => showMarkers());
      return;
    }
    const text = stepText[n];
    const blk = stepBlock[n] || {};
    if (/^(yes|true)$/i.test(blk.show_sticker_book || "")) Stickers.reveal();
    if (blk.cite) Stickers.award(blk.cite);
    caption.classList.remove("show");
    if (!text) return;
    setTimeout(() => {
      caption.innerHTML = html(text);
      caption.classList.add("show");
    }, caption.innerHTML ? 350 : 0);
  }

  // History units: each newly found spot plays the next unit.
  let unitIndex = 0;
  function checkSpots(pos) {
    spots.forEach((s) => {
      if (s.found || distance(pos, s) > s.radius) return;
      s.found = true;
      hideMarker(s);
      if (s.section) Dialogue.run(s.section);
      else {
        // Spots without their own section play the next unit no spot has claimed.
        const claimed = spots.map((x) => x.section).filter(Boolean);
        const free = units.filter((u) => !claimed.includes(u));
        if (unitIndex < free.length) Dialogue.run(free[unitIndex++]);
      }
      if (spots.every((x) => x.found)) Dialogue.run("all-found");
    });
  }

  // ── Geometry ───────────────────────────────────────────
  const rad = (d) => (d * Math.PI) / 180;
  function distance(a, b) {
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
    const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  function renderDev() {
    if (!dev) return;
    $("dev").hidden = false;
    $("dev").textContent = Object.entries(devInfo).map(([k, v]) => `${k.padEnd(9)} ${v}`).join("\n");
  }

  // ── ## Move to: jump the Street View to a place (e.g. the front of the church for the pastors) ──
  let streetPano = null;
  async function moveTo(b) {
    if (!streetPano || !window.google) return; // preview mode: nothing to move
    const g = google.maps;
    const target = { lat: num(b.lat, church.lat), lng: num(b.lng, church.lng) };
    try {
      const { data: found } = await new g.StreetViewService().getPanorama({
        location: target, radius: num(b.radius, 30),
        sources: [g.StreetViewSource.GOOGLE], preference: g.StreetViewPreference.NEAREST,
      });
      const here = { lat: found.location.latLng.lat(), lng: found.location.latLng.lng() };
      lastTurn = Date.now(); // never "Turn around" because of a move the story made
      // `face` = compass direction to look in; without it, look at the church. (Not `heading`: every block has one.)
      const pov = { heading: b.face !== undefined && b.face !== "" ? num(b.face, 0) : bearing(here, church), pitch: num(b.pitch, 0) };
      // Street View resets the view direction when the new photo loads, so face the church once it has.
      await new Promise((r) => {
        const once = g.event.addListenerOnce(streetPano, "status_changed", () => { streetPano.setPov(pov); r(); });
        streetPano.setPano(found.location.pano);
        setTimeout(() => { g.event.removeListener(once); r(); }, 2500);
      });
      streetPano.setPov(pov);
      setTimeout(() => streetPano.setPov(pov), 400);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.warn("Move to: no Street View photo near", target, err);
    }
  }

  // ── Real Street View ───────────────────────────────────
  function loadMaps(key) {
    return new Promise((resolve, reject) => {
      window.__mapsReady = resolve;
      window.gm_authFailure = () => startPreview("Google rejected the API key, so this is preview mode. Check the key's restrictions in Google Cloud.");
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__mapsReady`;
      s.async = true;
      s.onerror = () => reject(new Error("Could not load Google Maps"));
      document.head.append(s);
    });
  }

  async function startStreetView(key) {
    await loadMaps(key);
    const g = google.maps;
    // Only Google's own street imagery, so nobody gets dropped inside a café's 360° photos.
    const { data: found } = await new g.StreetViewService().getPanorama({
      location: start,
      radius: 60,
      sources: [g.StreetViewSource.GOOGLE],
      preference: g.StreetViewPreference.NEAREST,
    });
    const here = { lat: found.location.latLng.lat(), lng: found.location.latLng.lng() };
    const pano = new g.StreetViewPanorama($("street"), {
      pano: found.location.pano,
      pov: { heading: (bearing(here, church) + 180) % 360, pitch: 0 },
      addressControl: false,
      fullscreenControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      showRoadLabels: true,
    });
    streetPano = pano;
    pano.addListener("position_changed", () => {
      const p = pano.getPosition();
      const pos = { lat: p.lat(), lng: p.lng() };
      devInfo.lat = pos.lat.toFixed(6);
      devInfo.lng = pos.lng.toFixed(6);
      onPosition(distance(pos, church), pos);
    });
    // The markers float at each spot's position. Google draws them in the 3D scene, smaller when further away.
    showMarkers = () => {
      spots.forEach((s) => {
        if (s.found || s.pin) return;
        const img = S[`marker_${s.kind}_image`] || `assets/scene3/marker-${s.kind}.svg`;
        const size = num(S.marker_size, 80);
        s.pin = new g.Marker({
          position: { lat: s.lat, lng: s.lng },
          map: pano,
          title: s.name,
          icon: { url: img, scaledSize: new g.Size(size, size * 1.3), anchor: new g.Point(size / 2, size * 1.3) },
          optimized: false,
        });
      });
    };
    if (finished) showMarkers();

    if (dev) {
      window.__pano = pano; // for testing from the console
      pano.addListener("pov_changed", () => { devInfo.heading = pano.getPov().heading.toFixed(0) + "°"; renderDev(); });
    }
  }

  // ── Preview mode (no key): a pretend street ────────────
  let previewing = false;
  function startPreview(reason) {
    if (previewing) return;
    previewing = true;
    $("street").innerHTML = "";
    document.body.classList.add("is-preview");
    $("preview").hidden = false;
    $("preview-note").textContent = reason;

    const stepM = 10;
    const startDist = (finalStep + 1) * stepM;
    let pos = 0;
    let facingChurch = false;
    let lap = 0; // after arriving, each walk visits the next spot around the church

    function draw() {
      const d = startDist - pos * stepM;
      const closeness = Math.max(0, Math.min(1, 1 - d / (startDist + 3 * stepM)));
      $("preview-church").hidden = !facingChurch;
      $("preview-church").style.fontSize = `${30 + closeness * 220}px`;
      $("preview-sign").textContent = finished
        ? `Around the church · ${spots.filter((s) => s.found).length}/${spots.length} spots`
        : facingChurch ? `Sudstern Church · ${Math.max(0, Math.round(d))} m` : "Hermannplatz →";
      $("preview-view").style.filter = facingChurch ? "" : "saturate(.7) brightness(.95)";
      return d;
    }

    $("walk").addEventListener("click", () => {
      if (finished && facingChurch) {
        // Pretend to walk around the church: land on the next spot.
        const s = spots[lap++ % Math.max(1, spots.length)];
        if (s) onPosition(arrivedAt ?? 0, s);
        draw();
        return;
      }
      pos += facingChurch ? 1 : -1;
      onPosition(draw());
    });
    $("turn").addEventListener("click", () => {
      facingChurch = !facingChurch;
      draw();
    });
    onPosition(draw());
  }

  // ── Go ─────────────────────────────────────────────────
  if (S.api_key) {
    try {
      await startStreetView(S.api_key);
    } catch (err) {
      console.error(err);
      startPreview("Street View couldn't load (" + err.message + "), so this is preview mode.");
    }
  } else {
    startPreview("Preview mode: add a Google Maps API key in script/scene3.md to use real Street View. You start facing the wrong way.");
  }

  // ?jump=<section> skips straight to part of the conversation (for testing).
  // ?flags=statue,church pretends those parts were already visited.
  (params.get("flags") || "").split(",").map((f) => f.trim().toLowerCase()).filter(Boolean).forEach((f) => Dialogue.flags.add(f));
  if (params.get("jump") === "scene4") { location.href = "scene4.html"; return; }
  if (params.get("jump")) {
    Stickers.reveal(); // testing: show the sticker book straight away
    finished = true;
    arrivedAt = arrivedAt ?? last ?? 0;
    showMarkers();
    Dialogue.run(params.get("jump"));
  }
})();

/* Scene 3.3a's photo layer: the headless statue (and the horror clip). */
function Statue(settings) {
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);
  const layer = document.getElementById("statue");
  const img = layer.querySelector("img");
  const video = layer.querySelector("video");
  const zoom = num(settings.zoom, 2.2);
  img.src = settings.statue_image || "assets/scene3.3a/statue.jpg";
  img.style.transformOrigin = `${num(settings.focus_x, 50)}% ${num(settings.focus_y, 40)}%`;
  img.style.transform = `scale(${zoom})`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let revealed = false;
  document.addEventListener("dialogue:pause", (e) => {
    if (video.hidden) return;
    if (e.detail.paused) video.pause(); else video.play().catch(() => {});
  });

  function playClip() {
    return new Promise((resolve) => {
      const src = settings.horror_clip;
      if (!src) return resolve();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        video.pause();
        video.hidden = true;
        resolve();
      };
      video.hidden = false;
      video.src = src;
      video.onended = finish;
      video.onerror = finish;
      setTimeout(() => { if (video.paused) finish(); }, 4000); // never hang on a missing/blocked clip
      video.play().catch(() => {
        video.muted = true; // browser blocked sound: play it silently rather than not at all
        video.play().catch(finish);
      });
    });
  }

  return {
    async flash() {
      Dialogue.clear();
      Dictionary.close();
      layer.hidden = false;
      document.body.classList.add("in-scene", "in-statue");
      img.classList.remove("revealing");
      img.style.transform = `scale(${zoom})`;
      revealed = false;
      img.hidden = false;
      await sleep(num(settings.flash_ms, 250));
      img.hidden = true;
      await playClip();
      img.hidden = false;
      await sleep(600);
    },
    // Zooms out to the whole monument (does nothing if it already has).
    async reveal() {
      if (revealed) return;
      revealed = true;
      img.classList.add("revealing");
      img.style.transform = "scale(1)";
      await sleep(2200);
    },
    leave() {
      layer.hidden = true;
      document.body.classList.remove("in-statue");
    },
  };
}

/* Scene 3.3b: the church interior (clickable hotspots) and the sermon video. */
function Church(settings, hotspots) {
  const { html } = Content;
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);
  const layer = document.getElementById("church");
  const frame = layer.querySelector(".church-frame");
  const img = frame.querySelector("img");
  const popup = document.getElementById("hotspot-popup");
  const popupText = popup.querySelector(".hotspot-text");
  const popupNav = popup.querySelector(".hotspot-nav");
  const video = layer.querySelector("video");
  img.src = settings.interior_image || "assets/scene3.3b/interior.jpg";
  // Times can be written as seconds (105) or minutes:seconds (1:45).
  const time = (v, d) => {
    const m = String(v ?? "").trim().match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/);
    return m ? +m[1] * 60 + +m[2] : num(v, d);
  };
  const soundFrom = time(settings.unmute_at ?? settings.sound_from, 105);
  const soundTo = time(settings.mute_at ?? settings.sound_to, 140);
  let oldTypeSpeed = null;
  // After the video ends it stays on its last frame, and the clock keeps counting, so notes can be timed
  // past the end (e.g. at: 3:50 on a 3:26 video).
  let endedAt = null;
  video.addEventListener("ended", () => { endedAt = Date.now(); });
  let pausedAt = null;
  const now = () => pausedAt ?? Date.now(); // the clock stands still while paused
  const clock = () => (video.ended && endedAt ? (video.duration || 0) + (now() - endedAt) / 1000 : video.currentTime);
  document.addEventListener("dialogue:pause", (e) => {
    if (e.detail.paused) {
      pausedAt = Date.now();
      if (!video.hidden && !video.ended) video.pause();
    } else {
      if (endedAt && pausedAt) endedAt += Date.now() - pausedAt;
      pausedAt = null;
      if (!video.hidden && !video.ended && !layer.hidden) video.play().catch(() => {});
    }
  });
  let opened = 0;
  let waiters = [];
  let hintTimer = null;

  const spots = hotspots.map((h) => {
    const btn = document.createElement("button");
    btn.className = "hotspot";
    btn.setAttribute("aria-label", h.label || h.name || "Something here");
    btn.style.left = num(h.x, 40) + "%";
    btn.style.top = num(h.y, 40) + "%";
    btn.style.width = num(h.w, 10) + "%";
    btn.style.height = num(h.h, 20) + "%";
    btn.addEventListener("click", () => {
      showCards(h.cards || [h]);
      if (!btn.classList.contains("seen")) {
        btn.classList.add("seen");
        opened++;
        if (h.dictionary) Dictionary.add(h.dictionary);
      }
      btn.classList.remove("hint");
    });
    frame.append(btn);
    return btn;
  });

  // A pop-up can have several pages (cards), with arrows and dots to move between them.
  function showCards(cards) {
    let page = 0;
    const draw = () => {
      const c = cards[page];
      const icon = c.icon ? `<div class="card-icon">${c.icon.includes("/") ? `<img src="${c.icon}" alt="">` : (ICONS[c.icon] || "")}</div>` : "";
      popupText.innerHTML = icon + html(c.body);
      popupText.classList.remove("turn");
      void popupText.offsetWidth;
      popupText.classList.add("turn");
      if (c.cite) Stickers.award(c.cite);
      popupNav.hidden = cards.length < 2;
      popupNav.innerHTML = cards.length < 2 ? "" : `
        <button class="card-prev" aria-label="Previous card" ${page === 0 ? "disabled" : ""}>←</button>
        <span class="card-dots">${cards.map((_, i) => `<i class="${i === page ? "on" : ""}"></i>`).join("")}</span>
        <button class="card-next" aria-label="Next card" ${page === cards.length - 1 ? "disabled" : ""}>→</button>`;
      popupNav.querySelector(".card-prev")?.addEventListener("click", () => { page--; draw(); });
      popupNav.querySelector(".card-next")?.addEventListener("click", () => { page++; draw(); });
    };
    draw();
    popup.hidden = false;
    (popup.querySelector(".card-next:not([disabled])") || popup.querySelector(".hotspot-close")).focus({ preventScroll: true });
  }

  function closePopup() {
    popup.hidden = true;
    checkWaiters();
  }
  popup.querySelector(".hotspot-close").addEventListener("click", closePopup);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !popup.hidden) closePopup(); });

  function checkWaiters() {
    if (!popup.hidden) return;
    waiters = waiters.filter(({ need, r }) => (opened >= need ? (r(), false) : true));
  }

  // ⏩ Fast forward: plays the sermon faster (muted). It stops by itself when the sound passage starts,
  // so nobody skips the key line by accident; after that it can be used again.
  const ffBtn = document.getElementById("sermon-ff");
  const ffSpeed = num(settings.fast_forward_speed, 4);
  let fast = false;
  const setFast = (on) => {
    fast = on;
    video.playbackRate = on ? ffSpeed : 1;
    ffBtn.classList.toggle("on", on);
    ffBtn.setAttribute("aria-pressed", String(on));
    ffBtn.textContent = on ? "▶ Normal speed" : "⏩ Fast forward";
  };
  ffBtn.addEventListener("click", (e) => { e.stopPropagation(); setFast(!fast); });
  video.addEventListener("ended", () => { setFast(false); ffBtn.hidden = true; });

  // Unmuted only between unmute_at and mute_at (and never while fast-forwarding).
  let lastT = 0;
  video.addEventListener("timeupdate", () => {
    const t = video.currentTime;
    if (fast && lastT < soundFrom && t >= soundFrom) setFast(false);
    lastT = t;
    video.muted = fast || !(t >= soundFrom && t < soundTo);
  });

  return {
    show() {
      Dialogue.clear();
      Dictionary.close();
      layer.hidden = false;
      frame.hidden = false;
      video.hidden = true;
      document.body.classList.add("in-scene", "in-church");
      clearTimeout(hintTimer); // the sun rays (CSS) show the hotspots from the start
    },
    waitHotspots(count) {
      const need = /^all$/i.test(count || "all") ? spots.length : Math.min(spots.length, num(count, spots.length));
      return new Promise((r) => { waiters.push({ need, r }); checkWaiters(); });
    },
    playSermon() {
      clearTimeout(hintTimer);
      popup.hidden = true;
      layer.hidden = false;
      frame.hidden = true;
      Dialogue.clear();
      Dictionary.close();
      // Notes are passed, not typed: they appear whole (notes_type_speed_ms: 0).
      if (oldTypeSpeed === null) oldTypeSpeed = Dialogue.setTypeSpeed(num(settings.notes_type_speed_ms, 0));
      document.body.classList.add("in-scene", "in-church", "in-sermon");
      video.hidden = false;
      video.src = settings.sermon_video || "assets/scene3.3b/sermon.mp4";
      video.muted = true;
      endedAt = null;
      lastT = 0;
      setFast(false);
      ffBtn.hidden = false;
      video.currentTime = 0;
      video.play().catch(() => {});
    },
    // Resolves once the video reaches `at` (m:ss or seconds, or "sound start" / "sound end" / "end").
    waitSermon(at) {
      const key = String(at || "end").trim().toLowerCase();
      const t = key === "sound start" ? soundFrom : key === "sound end" ? soundTo : key === "end" ? Infinity : time(key, 0);
      return new Promise((resolve) => {
        const check = () => {
          const broken = video.error || (video.readyState === 0 && video.networkState === 3);
          const over = t === Infinity ? video.ended : clock() >= t;
          if (over || broken) {
            clearInterval(poll);
            resolve();
          }
        };
        const poll = setInterval(check, 200);
        check();
      });
    },
    leave() {
      clearTimeout(hintTimer);
      if (oldTypeSpeed !== null) { Dialogue.setTypeSpeed(oldTypeSpeed); oldTypeSpeed = null; }
      setFast(false);
      ffBtn.hidden = true;
      video.pause();
      popup.hidden = true;
      layer.hidden = true;
      document.body.classList.remove("in-church", "in-sermon");
    },
  };
}

/* Small icons a pop-up card can show at the top (`icon:` on a ## Hotspot or ## Card). */
const ICONS = {
  arch: `<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M6 46 V22 C6 12 13 5 20 2 C27 5 34 12 34 22 V46" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M13 46 V26 C13 19 16 14 20 11 C24 14 27 19 27 26 V46" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 46 H38" stroke="currentColor" stroke-width="3"/></svg>`,
};
