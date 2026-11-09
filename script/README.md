# Script — all the words on the site

Every piece of text on the site lives in these files. Edit them and refresh the browser; no code needed.

| File | What it controls |
|---|---|
| `scene1-page.md` | Blog header, intro paragraph, list title, the three "strike" screens, the sheep link, the footer |
| `scene1-churches.md` | The Top 10 entries (name, photo, caption, location, stars, blurb) |
| `scene1-ads.md` | The fake car rental ads |
| `scene1-marx.md` | The Marx quotes on the red screen |
| `scene2-sudstern.md` | Sudstern page: photos, plane position, reviews (Wikipedia, Tripadvisor…) |
| `scene2-rant.md` | Wrong-search page: photo of you at 14, the white text slide, the spaghetti rant |
| `scene3.md` | Street View walk: API key, start/church coordinates, step texts, the spots around the church |
| `scene3-dialogue.md` | The two-voice conversation at the church: arrival, history units A–C, the "What answer? / Go to church." ending |
| `scene4a.md` | Scene 4a (headless statue): all branches, statue photo/zoom settings, horror clip |
| `dictionary.md` | Twerp's dictionary pages (local, heritage) |

## The format (same in every file)

```
Anything up here is notes / change requests for Claude. The site ignores it.

---

## Block name
setting: value
another_setting: value

Body text starts after the first blank line.
**bold**, *italic* and [a link](https://example.com) work.

A blank line starts a new paragraph.
```

- Keep the `---` line. Everything above it is ignored by the site, so use it for change requests.
- Settings must sit directly under the `## Block name` line, with no blank line between them.
- To add another ad, review, photo or church, copy a whole block and change it.
- Image paths point into `assets/` (see `assets/README.md`).

## Change requests

Each file has a "Change requests for Claude" list at the top. Write what you want there,
then ask Claude to "do the change requests in the script folder".

## Dialogue commands

The conversation files (`scene3-dialogue.md`, `scene4a.md`) use headings as commands:
`## LV`, `## RV`, `## Section name`, `## Go to name`, `## End`, `## Choice`, `## Button`, `## Wait for button`,
`## Textbox`, plus the page actions `## Statue flash`, `## Reveal monument`, `## Dictionary add`,
`## Wait for dictionary`, `## Wait for page`. Each file's header explains them.

To test a part without walking there: `scene3.html?dev&jump=scene4a` (or any section name).
