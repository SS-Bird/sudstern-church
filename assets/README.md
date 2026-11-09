# Assets

All images live here, one folder per scene. The current files are labelled placeholders (`.svg`).

**To swap in your own image**, either:
1. drop your file in with the **same name** (e.g. `church-02.jpg`) and change the extension in the
   matching `script/*.md` file (`image: assets/scene1/church-02.jpg`), or
2. use any filename you like and update the `image:` line in the script file.

| File | Used in | Set in |
|---|---|---|
| `scene1/church-01` … `church-10` | Top 10 list photos (#1 is Sudstern) | `script/scene1-churches.md` |
| `scene2/sudstern-1` … `sudstern-3` | Sudstern photo viewer (add more by adding `## Photo` blocks) | `script/scene2-sudstern.md` |
| `scene2/plane.svg` | The little clickable plane | `plane_image:` in `script/scene2-sudstern.md` (optional) |
| `scene2/me-at-14` | Wrong-search page photo | `script/scene2-rant.md` |
| `scene3/bonnie.jpg` | Bonnie Tyler flash when walking the wrong way | `bonnie_image:` in `script/scene3.md` |
| `scene3/turn-around.mp3` | The "Turn around" clip | `turn_around_audio:` in `script/scene3.md` |
| `scene4a/statue.jpg` | Photo of the full monument | `statue_image:`, `zoom`, `focus_x/y` in `script/scene4a.md` |
| `scene4a/horror-clip.mp4` | **You provide this:** the decapitation clip | `horror_clip:` in `script/scene4a.md` |

Tips:
- JPG/PNG/WebP all work. Keep photos under ~1 MB each (about 2000 px wide is plenty).
- If you replace a Sudstern photo, re-check the plane position (`plane_top`, `plane_left`, `plane_width`
  are percentages of that photo) so it sits above the church.
- To draw your own plane: a PNG with a transparent background works best.

Audio: use **MP3**, trimmed to just the "Turn arounddd" (about 2–3 seconds), ideally with a short fade-out.
Name it `turn-around.mp3` and drop it in `scene3/`. Until it exists, the Bonnie flash still happens, just silently.

Horror clip: **MP4 (H.264 video, AAC audio)** plays everywhere. Keep it short (a few seconds) and small
(under ~5 MB). If it's missing, Scene 4a just skips straight from the flash to the photo.

Statue photo: one photo of the **whole monument** (soldier + plaque). The scene starts zoomed in on the
soldier; set `zoom` and `focus_x` / `focus_y` (the point to zoom into, as % of the photo) in `script/scene4a.md`.
