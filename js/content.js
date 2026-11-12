/*
 * Loads the editable text from the script/ folder.
 *
 * Format of every script/*.md file:
 *   - Everything ABOVE the first line that is exactly `---` is notes /
 *     change requests and is ignored by the site.
 *   - Below it, each `## Heading` starts a block.
 *   - Lines directly under the heading that look like `key: value`
 *     are that block's settings.
 *   - The first blank line ends the settings; everything after it is the
 *     block's body text (supports **bold**, *italic* and [links](url)).
 *   - <!-- HTML comments --> are ignored anywhere.
 */
const Content = (() => {
  async function load(name) {
    const res = await fetch(`script/${name}.md`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load script/${name}.md (${res.status})`);
    return parse(await res.text());
  }

  function parse(text) {
    text = text.replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
    const sep = text.match(/^---[ \t]*$/m);
    if (sep) text = text.slice(sep.index + sep[0].length);

    const blocks = [];
    let cur = null;
    for (const line of text.split("\n")) {
      const h = line.match(/^##\s+(.*)$/);
      if (h) {
        cur = { title: h[1].trim(), fields: {}, lines: [], inFields: true };
        blocks.push(cur);
        continue;
      }
      if (!cur) continue;
      if (cur.inFields) {
        const f = line.match(/^([a-z_]+):\s*(.*)$/);
        if (f) { cur.fields[f[1]] = f[2].trim(); continue; }
        if (line.trim() === "") {
          if (Object.keys(cur.fields).length) cur.inFields = false;
          continue;
        }
        cur.inFields = false;
      }
      cur.lines.push(line);
    }
    return blocks.map((b) => ({ ...b.fields, heading: b.title, body: b.lines.join("\n").trim() }));
  }

  // Helpers for picking blocks out of a parsed file.
  const all = (blocks, title) => blocks.filter((b) => b.heading.toLowerCase() === title.toLowerCase());
  const one = (blocks, title) => all(blocks, title)[0] || { body: "" };

  function escape(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Inline markdown: **bold**, *italic*, [text](url), and footnotes [^4] (→ notes.html#n4)
  function inline(s) {
    return escape(s)
      .replace(/\[\^(\d+)\]/g, '<sup class="fn"><a href="notes.html#n$1" target="_blank" rel="noopener" title="Note $1">$1</a></sup>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)([^*\n]*?\S)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // Paragraphs separated by blank lines; single line breaks are kept.
  // A paragraph starting with #, ## or ### becomes a heading.
  function html(s) {
    if (!s) return "";
    return s.split(/\n\s*\n/).map((p) => {
      const h = p.trim().match(/^#{1,6}\s+(.*)$/s);
      if (h) return `<h3>${inline(h[1].trim())}</h3>`;
      return `<p>${inline(p.trim()).replace(/\n/g, "<br>")}</p>`;
    }).join("");
  }

  function showError(err) {
    const box = document.createElement("div");
    box.className = "load-error";
    const local = location.protocol === "file:";
    box.innerHTML = local
      ? `<strong>The site can't read its script files when opened directly.</strong><br>
         Run <code>./serve.sh</code> in the project folder, then open
         <a href="http://localhost:8000">http://localhost:8000</a>.`
      : `<strong>Something went wrong loading the content.</strong><br>${escape(err.message)}`;
    document.body.prepend(box);
    console.error(err);
  }

  // Tiny wrapper so a blocked storage never breaks the page. If sessionStorage is unavailable,
  // values are kept in memory instead (they then last until the page changes).
  const memory = {};
  const store = {
    get(k, d) {
      try { const v = sessionStorage.getItem(k); if (v !== null) return v; } catch { /* blocked */ }
      return k in memory ? memory[k] : d;
    },
    set(k, v) {
      memory[k] = String(v);
      try { sessionStorage.setItem(k, v); } catch { /* blocked: memory only */ }
    },
  };

  return { load, parse, all, one, escape, inline, html, showError, store };
})();
