/* Scene 3 — walk down Hasenheide back to the church, then the conversation (and Scene 4a). */
(async function () {
  const { load, all, one, html, showError } = Content;
  const $ = (id) => document.getElementById(id);

  let data, talk, s4a, dict;
  try {
    [data, talk, s4a, dict] = await Promise.all(["scene3", "scene3-dialogue", "scene4a", "dictionary"].map(load));
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
  data.forEach((b) => {
    const m = b.heading.match(/^step\s+(\d+)$/i);
    if (m) stepText[+m[1]] = b.body;
  });
  const spots = all(data, "Spot").map((s) => ({
    name: s.name || "spot",
    lat: num(s.lat, 0),
    lng: num(s.lng, 0),
    radius: num(s.radius, 14),
    found: false,
  }));

  Stars.init(num(S.star_slots, 6));
  Dictionary.init(dict);
  const statue = Statue(one(s4a, "Settings"));
  Dialogue.init({
    container: $("dialogue"),
    typeSpeed: S.type_speed_ms,
    actions: {
      "statue flash": () => statue.flash(),
      "reveal monument": () => statue.reveal(),
      "dictionary add": (b) => Dictionary.add(b.word || ""),
      "wait for dictionary": () => Dictionary.waitOpen(),
      "wait for page": (b) => Dictionary.waitPage(b.word || ""),
      "close dictionary": () => Dictionary.close(),
    },
  });
  Dialogue.add(talk);
  Dialogue.add(s4a);

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
      Dialogue.run("arrival");
      return;
    }
    const text = stepText[n];
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
      if (unitIndex < units.length) Dialogue.run(units[unitIndex++]);
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
    pano.addListener("position_changed", () => {
      const p = pano.getPosition();
      const pos = { lat: p.lat(), lng: p.lng() };
      devInfo.lat = pos.lat.toFixed(6);
      devInfo.lng = pos.lng.toFixed(6);
      onPosition(distance(pos, church), pos);
    });
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
  if (params.get("jump")) {
    finished = true;
    arrivedAt = arrivedAt ?? last ?? 0;
    Dialogue.run(params.get("jump"));
  }
})();

/* Scene 4a's photo layer: the headless statue (and the horror clip). */
function Statue(settings) {
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);
  const layer = document.getElementById("statue");
  const img = layer.querySelector("img");
  const video = layer.querySelector("video");
  const zoom = num(settings.zoom, 2.2);
  img.src = settings.statue_image || "assets/scene4a/statue.jpg";
  img.style.transformOrigin = `${num(settings.focus_x, 50)}% ${num(settings.focus_y, 40)}%`;
  img.style.transform = `scale(${zoom})`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      layer.hidden = false;
      document.body.classList.add("in-scene4a");
      img.hidden = false;
      await sleep(num(settings.flash_ms, 250));
      img.hidden = true;
      await playClip();
      img.hidden = false;
      await sleep(600);
    },
    async reveal() {
      img.classList.add("revealing");
      img.style.transform = "scale(1)";
      await sleep(2200);
    },
  };
}
