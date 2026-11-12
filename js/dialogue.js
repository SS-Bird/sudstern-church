/*
 * The two-voice dialogue engine (Left Voice / Right Voice + Twerp's choices).
 * Scripts are lists of blocks from script/*.md. Each block's `## Heading` is a command:
 *
 *   ## LV / ## RV            a line from the left / right voice (body = text)
 *   ## <Character>           a line from an extra speaker passed in as `speakers` (e.g. ## David)
 *                            setting: pause: <ms>
 *   ## Star                  a big gold star spirals into the middle of the screen, then shrinks away
 *   ## Sticker               award a sticker now (setting: id)
 *   any block can also have  cite: <sticker id>[, <id>…]  to award stickers when it runs
 *                            at: <m:ss>  to wait until the sermon video reaches that time (Scene 3.3b)
 *   ## Section <name>        a label you can jump to
 *   ## Go to <name>          jump to a section
 *   ## End                   stop here
 *   ## Choice                Twerp picks one; body lines are `- Label -> section`
 *   ## Button                a button under the last line (settings: side, goto); doesn't wait
 *   ## Wait for button       wait until one of the buttons above is clicked, then go to its section
 *   ## Textbox               Twerp writes something and presses the button (setting: button)
 *   ## Set <flag>            remember that something happened (e.g. ## Set statue)
 *   ## If <flag>             jump to `goto` if the flag is set
 *   ## If not <flag>         jump to `goto` if the flag is NOT set
 *   anything else           an action registered by the page (e.g. ## Wait for dictionary)
 */
const Dialogue = (() => {
  const { inline } = Content;
  let box, track, ffBtn;
  let blocks = [];
  let sections = {};
  let actions = {};
  let speakers = {}; // lowercase heading -> { label, side, color, text }
  let typeSpeed = 40;
  let queue = Promise.resolve();
  let skipping = false;
  let pendingButtons = [];
  const flags = new Set();

  // Pause: while paused, typing, the wait after each line, and the next block all hold.
  let paused = false;
  let resumeWaiters = [];
  function setPaused(p) {
    paused = !!p;
    if (!paused) resumeWaiters.splice(0).forEach((r) => r());
    document.body.classList.toggle("is-paused", paused);
    document.dispatchEvent(new CustomEvent("dialogue:pause", { detail: { paused } }));
  }
  const untilResumed = () => (paused ? new Promise((r) => resumeWaiters.push(r)) : Promise.resolve());
  async function wait(ms) {
    let left = ms;
    while (left > 0) {
      await untilResumed();
      const t = Math.min(left, 40);
      await sleep(t);
      if (!paused) left -= t;
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const num = (v, d) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);

  function init(opts) {
    box = opts.container;
    typeSpeed = num(opts.typeSpeed, 40);

    // Lines live in a track. When it grows (a new line, or a long line wrapping onto another row),
    // it starts that much lower and glides up, so the text scrolls smoothly instead of jumping.
    track = document.createElement("div");
    track.className = "dialogue-track";
    box.append(track);
    let lastHeight = 0;
    new ResizeObserver(() => {
      const h = track.offsetHeight;
      const grew = h - lastHeight;
      lastHeight = h;
      if (grew <= 0) return;
      const now = new DOMMatrix(getComputedStyle(track).transform).m42; // where it is mid-glide
      track.style.transition = "none";
      track.style.transform = `translateY(${now + grew}px)`;
      void track.offsetHeight;
      track.style.transition = "transform .45s ease-out";
      track.style.transform = "translateY(0)";
    }).observe(track);
    Object.assign(actions, opts.actions || {});
    Object.entries(opts.speakers || {}).forEach(([k, v]) => (speakers[k.toLowerCase()] = v));

    // Fast-forward: the » button, or Space / Enter when not typing in a box.
    ffBtn = document.createElement("button");
    ffBtn.className = "ff-btn";
    ffBtn.hidden = true;
    ffBtn.textContent = "»";
    ffBtn.setAttribute("aria-label", "Skip to the end of this line");
    ffBtn.addEventListener("click", () => (skipping = true));
    document.body.append(ffBtn);
    document.addEventListener("keydown", (e) => {
      if (ffBtn.hidden) return;
      const tag = (document.activeElement || {}).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "BUTTON") return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); skipping = true; }
    });
  }

  function add(list) {
    blocks = blocks.concat(list);
    sections = {};
    blocks.forEach((b, i) => {
      const m = b.heading.match(/^section\s+(.+)$/i);
      if (m) sections[m[1].trim().toLowerCase()] = i;
    });
  }

  const has = (name) => sections[String(name).toLowerCase()] !== undefined;

  // Runs a section. Calls are queued so dialogue never overlaps.
  function run(name) {
    queue = queue.then(() => runFrom(sections[String(name).toLowerCase()])).catch((e) => console.error(e));
    return queue;
  }

  async function runFrom(i) {
    if (i === undefined) return;
    while (i < blocks.length) {
      await untilResumed();
      const b = blocks[i];
      const h = b.heading.trim();
      const cmd = h.toLowerCase();
      let jump = null;
      if (b.at && actions["wait for sermon"]) await actions["wait for sermon"]({ at: b.at });
      if (b.cite && typeof Stickers !== "undefined") Stickers.award(b.cite);

      if (cmd === "lv" || cmd === "rv") await say(cmd === "lv" ? "left" : "right", b);
      else if (speakers[cmd]) await say(speakers[cmd].side === "right" ? "right" : "left", b, speakers[cmd], cmd);
      else if (cmd.startsWith("section")) { /* label */ }
      else if (cmd === "end") return;
      else if (cmd.startsWith("go to ")) jump = h.slice(6).trim();
      else if (cmd === "choice") jump = await choice(b);
      else if (cmd === "button") addButton(b);
      else if (cmd === "wait for button") jump = await waitButtons();
      else if (cmd === "textbox") await textbox(b);
      else if (cmd === "star") await spinStar();
      else if (cmd === "sticker") { if (typeof Stickers !== "undefined") Stickers.award(b.id); }
      else if (cmd.startsWith("set ")) flags.add(cmd.slice(4).trim());
      else if (cmd.startsWith("if not ")) { if (!flags.has(cmd.slice(7).trim())) jump = b.goto || null; }
      else if (cmd.startsWith("if ")) { if (flags.has(cmd.slice(3).trim())) jump = b.goto || null; }
      else if (actions[cmd]) await actions[cmd](b);
      else console.warn("Unknown dialogue command:", h);

      if (jump !== null) {
        const target = sections[jump.toLowerCase()];
        if (target === undefined) { console.warn("No section called", jump); return; }
        i = target;
      } else {
        i++;
      }
    }
  }

  // ── Lines ──────────────────────────────────────────────
  function fill(text) {
    return text.replace(/\{years since (\d{4})-(\d{2})-(\d{2})\}/gi, (_, y, m, d) => {
      const now = new Date();
      let n = now.getFullYear() - +y;
      if (now.getMonth() + 1 < +m || (now.getMonth() + 1 === +m && now.getDate() < +d)) n--;
      return String(n);
    });
  }

  function markup(body) {
    return fill(body).split(/\n\s*\n/).map((p) => inline(p.trim()).replace(/\n/g, "<br>")).join("<br><br>");
  }

  function row(cls) {
    const r = document.createElement("div");
    r.className = "line " + cls;
    track.append(r);
    while (track.children.length > 40) track.firstElementChild.remove();
    return r;
  }

  async function say(side, b, who, id) {
    const bubble = document.createElement("span");
    bubble.className = "bubble typing";
    const r = row(side);
    if (who) {
      r.classList.add("speaker");
      if (who.color) bubble.style.background = who.color;
      bubble.style.color = who.text || "#fff";
      if (who.label) {
        const tag = document.createElement("span");
        tag.className = "speaker-name";
        tag.textContent = who.label;
        if (who.color) tag.style.background = who.color;
        r.append(tag);
      }
    }
    r.append(bubble);
    document.dispatchEvent(new CustomEvent("dialogue:say", { detail: { speaker: id || (side === "left" ? "lv" : "rv") } }));
    skipping = false;
    ffBtn.hidden = false;
    await typeInto(bubble, markup(b.body));
    ffBtn.hidden = true;
    bubble.classList.remove("typing");
    if (!skipping) await wait(num(b.pause, 900));
    skipping = false;
  }

  async function typeInto(el, html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const full = nodes.map((n) => n.textContent);
    nodes.forEach((n) => (n.textContent = ""));
    el.append(...tmp.childNodes);
    if (typeSpeed <= 0) { nodes.forEach((n, i) => (n.textContent = full[i])); return; } // appears whole
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < full[i].length; j++) {
        if (skipping) { nodes[i].textContent = full[i]; break; }
        nodes[i].textContent += full[i][j];
        await wait(full[i][j] === " " ? typeSpeed / 2 : typeSpeed);
      }
    }
  }

  // ── ## Star: a big gold star spirals into the centre, then shrinks and fades ──
  const STAR_PATH = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";
  function spinStar() {
    const el = document.createElement("div");
    el.className = "big-star";
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
    document.body.append(el);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A spiral: each keyframe is a smaller circle around the centre, turning as it goes.
    const frames = [];
    const turns = 1.5, steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * 2 * Math.PI;
      const r = (1 - t) * 38; // vmin
      frames.push({
        transform: `translate(${Math.cos(angle) * r}vmin, ${Math.sin(angle) * r}vmin) rotate(${(t - 1) * 540}deg) scale(${0.25 + 0.75 * t})`,
        opacity: Math.min(1, t * 3),
        offset: t * 0.6,
      });
    }
    frames.push({ transform: "translate(0, 0) rotate(0deg) scale(1.1)", opacity: 1, offset: 0.7 });
    frames.push({ transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 0.8 });
    frames.push({ transform: "translate(0, 0) rotate(20deg) scale(0)", opacity: 0, offset: 1 });
    const anim = el.animate(frames, { duration: calm ? 700 : 2000, easing: "ease-out" });
    return new Promise((resolve) => (anim.onfinish = () => { el.remove(); resolve(); }));
  }

  // ── Twerp's turn ───────────────────────────────────────
  function parseOptions(body) {
    return body.split("\n").map((l) => l.replace(/^\s*[-*]\s*/, "").trim()).filter(Boolean).map((l) => {
      const [label, target] = l.split(/\s*->\s*/);
      return { label, target: (target || "").trim() };
    });
  }

  function choice(b) {
    return new Promise((resolve) => {
      const r = row("center choices");
      parseOptions(b.body).forEach((o) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerHTML = inline(o.label);
        btn.addEventListener("click", () => {
          r.querySelectorAll("button").forEach((x) => { x.disabled = true; x.classList.toggle("picked", x === btn); });
          resolve(o.target);
        });
        r.append(btn);
      });
      r.querySelector("button").focus({ preventScroll: true });
    });
  }

  function addButton(b) {
    const r = row(b.side === "right" ? "right" : "left");
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.innerHTML = inline(b.body);
    r.append(btn);
    pendingButtons.push({ btn, target: b.goto || "" });
  }

  function waitButtons() {
    const list = pendingButtons;
    pendingButtons = [];
    if (!list.length) return Promise.resolve(null);
    return new Promise((resolve) => {
      list.forEach(({ btn, target }) => btn.addEventListener("click", () => {
        list.forEach((x) => { x.btn.disabled = true; x.btn.classList.toggle("picked", x.btn === btn); });
        resolve(target);
      }));
    });
  }

  function textbox(b) {
    return new Promise((resolve) => {
      const r = row("center textbox");
      const area = document.createElement("textarea");
      area.rows = 4;
      area.placeholder = b.body || "Write your answer…";
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = b.button || "Submit";
      btn.addEventListener("click", () => {
        if (!area.value.trim()) { area.classList.remove("shake"); void area.offsetWidth; area.classList.add("shake"); area.focus(); return; }
        area.readOnly = true;
        btn.disabled = true;
        btn.classList.add("picked");
        resolve(area.value);
      });
      r.append(area, btn);
      area.focus({ preventScroll: true });
    });
  }

  // Removes all lines on screen (e.g. when the scene changes).
  function clear() { track.innerHTML = ""; pendingButtons = []; }

  // Changes the typing speed (ms per letter; 0 = lines appear whole). Returns the old speed.
  function setTypeSpeed(ms) { const old = typeSpeed; typeSpeed = num(ms, typeSpeed); return old; }

  return { init, add, run, has, clear, flags, setTypeSpeed, setPaused, isPaused: () => paused };
})();
