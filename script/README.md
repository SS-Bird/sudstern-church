# Script — all the words on the site

Every piece of text on the site lives in these files. Edit them and refresh the browser; no code needed.

| File | What it controls |
|---|---|
| `scene1-page.md` | The list title (the page's big heading), the byline, the three "strike" screens, the sheep link, the footer |
| `scene1-churches.md` | The Top 5 entries (name, photo, caption, location, stars, blurb) |
| `scene1-ads.md` | The fake car rental ads (subtle "Sponsored" cards with a car photo) |
| `scene1-marx.md` | The "hijacked ad" screen: the Marx quote, the hacker's message and the link |
| `scene2-sudstern.md` | Sudstern page: photos, the walking man's position, reviews (Wikipedia, Tripadvisor…) |
| `scene2-rant.md` | Wrong-search page: photo of you at 14, the white text slide, the spaghetti rant |
| `scene2-sudstern.md` (also) | @DissemiNadia's replies under each review (`## Reply`) and her own review |
| `scene2-profile.md` | @DissemiNadia's profile page: the bio (`## Profile`) and the pinned Bhabha quote box (`## Pinned`) |
| `scene3.md` | Street View walk (3.1): API key, start/church coordinates, step texts, the spots around the church, the pastor cutouts |
| `scene3-dialogue.md` | The two-voice conversation: arrival and history units A–C (3.1), the fork "What answer? / Go to church." (3.3) |
| `scene3a.md` | Scene 3.3a (headless statue): all branches, the joint plot, statue photo/zoom settings, horror clip |
| `scene3b.md` | Scene 3.3b (go to church): Part 0 the pastors at the door, Part 1 the interior photo hotspots (with multi-page pop-ups), Part 2 the sermon video, its timings and the notes LV and RV pass |
| `scene4.md` | Scene 4 (zooming out): the map zoom levels, the question pairs, and LV and RV's last conversation (`## Section ending`) |
| `dictionary.md` | Twerp's dictionary pages |
| `stickers.md` | The sticker book: one sticker per author/source (label, art, full Chicago citation), and how `cite:` awards them |
| `newsletter.md` | The fake newsletter pop-up (every page, once per tab): content warnings (audio, jumpscares, blood) and the free dictionary + sticker book |
| `notes.md` | The Chicago notes. `[^4]` anywhere on the site is a superscript linking to note 4 |

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

The conversation files (`scene3-dialogue.md`, `scene3a.md`, `scene3b.md`) use headings as commands:
`## LV`, `## RV`, `## Section name`, `## Go to name`, `## End`, `## Choice`, `## Button`, `## Wait for button`,
`## Textbox`, `## Set <flag>`, `## If <flag>`, `## If not <flag>`, `## Star` (a big gold star spirals into the
middle of the screen, then shrinks away), `## Sticker` (setting `id`: award a sticker now), plus the page actions `## Statue flash`,
`## Reveal monument`, `## Dictionary add`, `## Wait for dictionary`, `## Wait for page`, `## Close dictionary`, `## Hide statue`,
`## Show cutouts`, `## Hide cutouts`, `## Show interior`, `## Wait for hotspots`, `## Play sermon`,
`## Wait for sermon`, `## Open page`. Any line can also have `at: m:ss` (wait for the sermon video to reach that time).
Each file's header explains them.

## Stickers

Any dialogue block, church entry, Marx quote, ad, review, reply, profile, hotspot pop-up, dictionary word or
walk step can have `cite: <sticker id>` (or several, comma-separated). The reader earns that sticker when it is
shown or opened. The stickers themselves (label, drawing, citation) are listed in `stickers.md`.
The book's corner (and the dictionary's) appears when the newsletter pop-up closes; add `?stickers` to any page's
address to show the sticker book straight away while testing.

To test a part without walking there, add `?dev&jump=<name>` to `scene3.html`. Names: `arrival`, `unit-a`, `unit-b`,
`unit-c`, `all-found`, `scene3a` (statue), `scene3b` (church, from the pastors), `scene3b-sermon`, or `scene4`
(opens the Scene 4 page). Add `&flags=church` (or `statue`) to pretend the other branch is already done.

## Pause

Scene 3 has a "❚❚ Pause" button in the top left. It holds the conversation (typing and the gaps between lines) and
pauses the sermon and horror-clip videos; "▶ Resume" carries on.
