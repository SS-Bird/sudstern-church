# Scene 3 — Street View walk to the church

How this file works (the conversation itself is in `scene3-dialogue.md`):
- `## Settings`: the Street View setup.
  - `api_key`: leave this empty. The real key lives in `script/secrets.md`, which git ignores so it never
    goes to GitHub. With no key anywhere, Scene 3 runs in **preview mode** (a fake street with buttons).
  - `start_lat` / `start_lng`: where the reader is dropped (snapped to the nearest Street View photo).
    They start facing AWAY from the church.
  - `church_lat` / `church_lng`: the church itself (from Google's location for Kirche am Südstern).
  - `final_step`: which step starts the arrival conversation. A "step" is a move that gets the reader closer
    to the church than they have been before. Right now step 14 = the last spot before the road splits.
  - `roam_margin_m`: after arriving, readers can walk around the church freely. "Turn around" only plays again
    if they get this many metres further from the church than where they arrived.
  - `units`: the history sections (in `scene3-dialogue.md`) played as spots are found, in this order.
  - Open `scene3.html?dev` to see live coordinates, heading, distance and step number while you walk,
    so you can copy the exact numbers in here. `scene3.html?dev&jump=arrival` (or `jump=scene4a`, etc.)
    skips straight to that part of the conversation.
- `## Step N`: the text shown at step N. Steps with no block (6–13 right now) are blank.
- `## Spot`: places around the church. Reaching one (within `radius` metres) plays the next history unit.
  When all spots are found, the `all-found` section plays.

Change requests for Claude:
-

---

## Settings
api_key:
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
star_slots: 6
type_speed_ms: 40

## Step 1
What?

## Step 2
Thought you would just get to arrive there?

## Step 3
When I was young I had to walk 7 km in 2 meters of snow to get to church. You're already close.

## Step 4
Jk my mum drove me I love you Kristin

Also I experienced church for the first time when I was 18, so, yup yup yup, don't trust me.

## Step 5
So in the meantime I let you have a nice quiet thought. What do you think people should do about the many, many beautiful churches built in a time when christianity has a bigger role in the public's lives?

## Spot
name: north side
lat: 52.489503
lng: 13.406359
radius: 14

## Spot
name: west end
lat: 52.489324
lng: 13.405495
radius: 14

## Spot
name: south side
lat: 52.488924
lng: 13.406374
radius: 14
