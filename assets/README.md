# Assets

All images live here, one folder per scene. Files still ending in `.svg` are labelled placeholders; `.jpg`/`.png` files are your real assets.

**To swap in your own image**, either:
1. drop your file in with the **same name** (e.g. `church-02.jpg`) and change the extension in the
   matching `script/*.md` file (`image: assets/scene1/church-02.jpg`), or
2. use any filename you like and update the `image:` line in the script file.

| File | Used in | Set in |
|---|---|---|
| `scene1/church-01`, `02`, `05`, `07`, `10` | Top 5 list photos, in that order (#1 is Sudstern). `image_focus` picks which part shows | `script/scene1-churches.md` |
| `scene1/fancy-car.jpg`, `woman-in-car.jpg` | The photos on the "Sponsored" car ads (they alternate) | `image:` in each `## Ad` of `script/scene1-ads.md` |
| `scene1/unused/church-03`, `04`, `06`, `08`, `09` | **Not used.** Photos for the five entries cut when the list became a Top 5. Kept in case you bring an entry back | |
| `scene2/sudstern-1` … `sudstern-3` | Sudstern photo viewer (add more by adding `## Photo` blocks) | `script/scene2-sudstern.md` |
| `scene2/wikipedia-logo.jpeg`, `tripadvisor-logo.png`, `s-bahn-logo.png` | Review avatars in the Sudstern sidebar | `avatar:` in each `## Review` of `script/scene2-sudstern.md` |
| `scene2/walking-man.svg` | The little clickable figure that leads to Scene 3: the green walking Ampelmännchen, cut out of `Ampelmann.svg` (your original, with the red man, kept as the source) | `plane_image:` in `script/scene2-sudstern.md` |
| `scene2/plane.svg` | The old drawn plane, not used any more | |
| `scene2/me-at-14` | Wrong-search page photo | `script/scene2-rant.md` |
| `scene3/bonnie.jpg` | Bonnie Tyler flash when walking the wrong way | `bonnie_image:` in `script/scene3.md` |
| `scene3/turn-around.mp3` | The "Turn around" clip | `turn_around_audio:` in `script/scene3.md` |
| `scene3/pastor-david.jpg`, `pastor-ben.jpg` | The pastors' cardboard cutouts at the church entrance (cropped from `Ben-and-David.png`; David = right of the photo, Ben = left; **check this**) | `image:` in each `## Cutout` of `script/scene3.md` |
| `scene3/marker-history.svg`, `marker-pastors.svg` | The markers floating in Street View over each spot around the church (yellow = history unit, blue = pastors) | `marker:` on each `## Spot` in `script/scene3.md` (or `marker_history_image` / `marker_pastors_image` in Settings) |
| `scene3/Ben-and-David.png` | The original photo the cutouts were cropped from (not used directly) | |
| `scene3.3a/statue.jpg` | Photo of the full monument | `statue_image:`, `zoom`, `focus_x/y` in `script/scene3a.md` |
| `scene3.3a/horror-clip.mp4` | The decapitation clip | `horror_clip:` in `script/scene3a.md` |
| `scene3.3b/interior.jpg` | Inside the church (the clickable photo) | `interior_image:` and the `## Hotspot` positions in `script/scene3b.md` |
| `scene3.3b/sermon.mp4` | The sermon video (206 s) | `sermon_video:`, `unmute_at`, `mute_at` in `script/scene3b.md` |
| `stickers/<name>.svg` | The 17 sticker drawings in the sticker book (marx, billig, bhabha, anderson, smith, ignatieff, mosse, koselleck, lewis, wikipedia, digital-cosmonaut, czb, google-maps-review, tripadvisor, bonnie-tyler, horror-clip, dictionary) | `art:` in each sticker of `script/stickers.md` |
| `scene4/church-footprint.geojson` | The church's outline on the Scene 4 map (from OpenStreetMap, way 303145491) | `footprint:` in `script/scene4.md` |

Tips:
- JPG/PNG/WebP all work. Keep photos under ~1 MB each (about 2000 px wide is plenty).
- If you replace a Sudstern photo, re-check the walking man's position (`plane_top`, `plane_left`, `plane_width`
  are percentages of that photo) so it sits above the church.
- To swap the walking man: an SVG or a PNG with a transparent background works best.

Audio: use **MP3**, trimmed to just the "Turn arounddd" (about 2–3 seconds), ideally with a short fade-out.
Name it `turn-around.mp3` and drop it in `scene3/`. Until it exists, the Bonnie flash still happens, just silently.

Horror clip: **MP4 (H.264 video, AAC audio)** plays everywhere. Keep it short (a few seconds) and small
(under ~5 MB). If it's missing, Scene 3.3a just skips straight from the flash to the photo.

Statue photo: one photo of the **whole monument** (soldier + plaque). The scene starts zoomed in on the
soldier; set `zoom` and `focus_x` / `focus_y` (the point to zoom into, as % of the photo) in `script/scene3a.md`.

Interior photo: if you swap it, re-place the hotspots (`x`, `y`, `w`, `h` are percentages of the photo).

Stickers: to swap a drawing, replace `assets/stickers/<name>.svg` with your own square SVG (or point `art:` in
`script/stickers.md` at another file, e.g. `art: assets/stickers/my-drawing.svg`). Leave out any background and
white edge: the white die-cut border and shadow are added by the page. Parts of a drawing can move on hover if they
have one of these classes: `st-bob`, `st-spin`, `st-sparkle`, `st-glow`, `st-flag`, `st-beam`, `st-bubble`.
Keep stickers free of real people's faces; each one is an object linked to the author's idea.

Pastor cutouts: rectangular photos get a cardboard-coloured edge. A PNG with a transparent background also works.
