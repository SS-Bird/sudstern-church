/*
 * The two-voice dialogue engine (Left Voice / Right Voice + Twerp's choices).
 * Scripts are lists of blocks from script/*.md. Each block's `## Heading` is a command:
 *
 *   ## LV / ## RV            a line from the left / right voice (body = text)
 *                            settings: corner_star: <id>, inline_star: yes, pause: <ms>
 *   ## Section <name>        a label you can jump to
 *   ## Go to <name>          jump to a section
 *   ## End                   stop here
 *   ## Choice                Twerp picks one; body lines are `- Label -> section`
 *   ## Button                a button under the last line (settings: side, goto); doesn't wait
 *   ## Wait for button       wait until one of the buttons above is clicked, then go to its section
 *   ## Textbox               Twerp writes something and presses the button (setting: button)
 *   anything else            an action registered by the page (e.g. ## Wait for dictionary)
 */
const Dialogue = (() => {
  const { inline } = Content;
  let box, track, ffBtn;
  let blocks = [];
  let sections = {};
  let actions = {};
  let typeSpeed = 40;
  let queue = Promise.resolve();
  let skipping = false;
  let pendingButtons = [];

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
      const b = blocks[i];
      const h = b.heading.trim();
      const cmd = h.toLowerCase();
      let jump = null;

      if (cmd === "lv" || cmd === "rv") await say(cmd === "lv" ? "left" : "right", b);
      else if (cmd.startsWith("section")) { /* label */ }
      else if (cmd === "end") return;
      else if (cmd.startsWith("go to ")) jump = h.slice(6).trim();
      else if (cmd === "choice") jump = await choice(b);
      else if (cmd === "button") addButton(b);
      else if (cmd === "wait for button") jump = await waitButtons();
      else if (cmd === "textbox") await textbox(b);
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

  async function say(side, b) {
    const bubble = document.createElement("span");
    bubble.className = "bubble typing";
    row(side).append(bubble);
    skipping = false;
    ffBtn.hidden = false;
    await typeInto(bubble, markup(b.body));
    ffBtn.hidden = true;
    bubble.classList.remove("typing");
    if (/^(yes|true)$/i.test(b.inline_star || "")) bubble.insertAdjacentHTML("beforeend", Stars.starSvg("inline-star"));
    if (b.corner_star) Stars.add(b.corner_star);
    if (!skipping) await sleep(num(b.pause, 900));
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
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < full[i].length; j++) {
        if (skipping) { nodes[i].textContent = full[i]; break; }
        nodes[i].textContent += full[i][j];
        await sleep(full[i][j] === " " ? typeSpeed / 2 : typeSpeed);
      }
    }
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

  return { init, add, run, has, clear };
})();
