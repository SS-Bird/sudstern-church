# Scene 3 — Street View walk to the church

How this file works (the conversation itself is in `scene3-dialogue.md`):
- `## Settings`: the Street View setup.
  - `api_key`: the Google Maps key. It is public on purpose (the browser needs it, so visitors can always see it);
    it is protected by restrictions in Google Cloud: websites `https://sudstern-church.vercel.app/*` and
    `http://localhost:*/*`, Maps JavaScript API only. A key in `script/secrets.md` (git-ignored) overrides it.
    With no key anywhere, Scene 3 runs in **preview mode** (a fake street with buttons).
  - `start_lat` / `start_lng`: where the reader is dropped (snapped to the nearest Street View photo).
    They start facing AWAY from the church.
  - `church_lat` / `church_lng`: the church itself (from Google's location for Kirche am Südstern).
  - `final_step`: which step starts the arrival conversation. A "step" is a move that gets the reader closer
    to the church than they have been before. Right now step 14 = the last spot before the road splits.
  - `roam_margin_m`: after arriving, readers can walk around the church freely. "Turn around" only plays again
    if they get this many metres further from the church than where they arrived.
  - `units`: the history sections (in `scene3-dialogue.md`) played as spots are found, in this order.
  - Open `scene3.html?dev` to see live coordinates, heading, distance and step number while you walk,
    so you can copy the exact numbers in here. `scene3.html?dev&jump=arrival` (or `jump=unit-b`, `jump=all-found`, `jump=scene3a`,
    `jump=scene3b`, `jump=scene3b-sermon`, `jump=scene4`, etc.)
    skips straight to that part of the conversation.
- `## Step N`: the text shown at step N. Steps with no block (6–13 right now) are blank.
  `show_sticker_book: yes` (optional) would make the sticker book's corner appear at that step; it's not used now,
  because the newsletter pop-up (`newsletter.md`) hands over the dictionary and sticker book at the start.
  `cite: <id>` on a step awards that sticker there.
- `turn_around_cite`: the sticker awarded the first time the "Turn around" clip plays.
- `## Spot`: places around the church. A spot with `section: <name>` always plays that section: the front (west
  door) plays `unit-b`, the Gothic unit. The other spots play the remaining units (A and C) in the order they're
  found. When all spots are found, the `all-found` section (the fork) plays. Spots only work if a
  Street View photo point is inside the circle; use `scene3.html?dev` to read the lat/lng where you're standing.
- Markers: once the reader arrives, every spot gets a marker floating in Street View so they know where to walk.
  It disappears when they reach it. `marker: history` is a yellow pin with a column
  (`assets/scene3/marker-history.svg`). `marker: pastors` (a blue pin with two figures,
  `assets/scene3/marker-pastors.svg`) isn't used now that the pastors are in 3.3b. `marker_size` in Settings is
  the marker's width in pixels. Markers only exist in real Street View, not in preview mode. The three history
  spots are the east end (the side the reader arrives from), the north side, and the front of the church at the
  west door; they're far enough apart that they never overlap.
- `## Cutout`: a cardboard cutout that pops up during the pastor scene (3.3b, Part 0). `name` is the heading
  used for their lines in `scene3b.md` (e.g. `## David`), `label` is the name shown above their lines,
  `color` is their highlight colour, `side` is left/right, `position` is % from that edge of the screen,
  `image` is the cutout picture. Right now both are cropped from `assets/scene3/Ben-and-David.png`; the highlight
  colours are sampled from their suits in that photo (David: royal blue, right of the photo; Ben: navy, left).
  TO CHECK: that David and Ben are the right way round. If not, swap the two `image:` lines and the two `color:` lines.

Change requests for Claude:
-

---

## Settings
api_key: AIzaSyBcstSDJHUWhXIk3jI8DOnHPIG0x8fvAGM
start_lat: 52.488720
start_lng: 13.410381
church_lat: 52.489246
church_lng: 13.406337
final_step: 14
move_threshold_m: 3
roam_margin_m: 25
units: unit-a, unit-b, unit-c
turn_around_audio: assets/scene3/turn-around.mp3
bonnie_image: assets/scene3/bonnie.jpg
turn_around_cite: bonnie-tyler
type_speed_ms: 40
marker_size: 80

## Step 1
Hi Twerp

## Step 2
What? Thought you would get dropped right at the church?

## Step 3
When I was young I had to walk 7 km in 2 meters of snow to get to church.

## Step 4
Jk my mum drove me. I love you Kristin. Also I experienced church for the first time when I was 18, so, yup yup yup, don't trust me.

## Spot
name: north side
marker: history
lat: 52.489503
lng: 13.406359
radius: 14

## Spot
name: east end
marker: history
lat: 52.489380
lng: 13.406950
radius: 14

## Spot
name: front (west door)
section: unit-b
marker: history
lat: 52.489280
lng: 13.405400
radius: 20

## Cutout
name: David
label: David
side: left
position: 6
color: #2f4c9a
image: assets/scene3/pastor-david.jpg
alt: Cardboard cutout of David, the senior pastor

## Cutout
name: Ben
label: Ben
side: right
position: 6
color: #262b45
image: assets/scene3/pastor-ben.jpg
alt: Cardboard cutout of Ben, the other pastor
