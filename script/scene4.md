# Scene 4 — Zooming out (scene4.html), then LV and RV's last conversation

A black-and-white map of Berlin. Only the church's footprint is red. It starts so zoomed in that the screen is solid
red. Each `## Zoom` block is one pair of questions: `you` appears above the church, `place` below it. The pair fades
in, waits for a click, fades out, and the map flies out to the next block's `zoom`. The page opens on the map
and the red fades in slowly (`red_fade_in_s`) before the first pair.

`## Settings`:
- `red_fade_in_s`: how long the red takes to fade in at the start. `hint_after_s`: if the reader hasn't clicked
  after this many seconds, a small "click to continue" appears. `fly_s`: how long each zoom-out takes.
- `footprint`: the church outline (GeoJSON, from OpenStreetMap). The map centres on it.
- `speck_below_zoom`: below this zoom level the church is drawn as a red dot so it never disappears.
- `tiles` / `attribution`: the map images. They're coloured, and the page turns them black and white.
  The attribution line is required by the map licence; keep it.
- `the_end`: once LV and RV's conversation is over, this text repeats on and on, in red, rolling away into the
  distance forever. `the_end_repeat` is how many times it repeats in one loop, `the_end_speed_s` how long one loop
  takes (bigger = slower). Leave `the_end` empty to skip it.
- `restart_label` / `restart_page`: the small link that appears in the corner a few seconds after the end begins.

`## Zoom`:
- `zoom`: map zoom level (bigger = closer; 22 is a few metres across, 5 is most of Europe). Decimals work.
- `solid: yes` covers the screen in solid red (only the first one).
- `label` is just a note for you; it isn't shown.

`## Section ending`: LV and RV's last conversation, after the final pair of questions, while the map holds on the
red speck. Same commands as the Scene 3 dialogue files (`## LV`, `## RV`, `pause`, `cite`, …). The "Start again"
link appears once it ends.

Change requests for Claude:
-

---

## Settings
red_fade_in_s: 5
hint_after_s: 8
fly_s: 3.2
footprint: assets/scene4/church-footprint.geojson
speck_below_zoom: 15.5
tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
tiles_max_zoom: 19
attribution: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
the_end: The end.
the_end_repeat: 60
the_end_speed_s: 60
restart_label: Start again
restart_page: index.html
restart_delay_s: 3

## Zoom
label: 1. Solid red: the church fills the screen
zoom: 22
solid: yes
you: Who narrates who you are? Name three voices.
place: Who narrates this church? Whose voice is loudest: the architect's, the congregation's, or the reviewers'?

## Zoom
label: 2. The church's outline appears
zoom: 18.7
you: Which objects in your life speak for you without being asked: a passport, a name, a house, a photo?
place: What does a building say about a place just by refusing to move?

## Zoom
label: 3. The traffic island and the square
zoom: 17.2
you: Which of your communities did you choose, and which were you born into?
place: Is this congregation held together by what its members chose, or by what they inherited? Can it be both?

## Zoom
label: 4. Kreuzberg
zoom: 14.2
you: When you meet people like you, what makes them "like you": belief, language, skin, accent, clothes?
place: Who is local in this neighbourhood: the people who stay, the people who arrive, or the things that never leave?

## Zoom
label: 5. Berlin
zoom: 10.8
you: How do you take part in the communities you belong to: by showing up, by paying, by remembering, by staying away?
place: A city where so many people arrive and leave: what holds Berlin together, and is it the same thing that holds Germany together?

## Zoom
label: 6. Berlin and Brandenburg
zoom: 8.2
you: Which parts of your past do you look after, and which do you let collect paint and weeds?
place: What does Germany keep, protect and restore, and what does it leave headless?

## Zoom
label: 7. Germany: the church is a red speck
zoom: 6.3
you: How conscious are you of your connections to other people? How do you value them?
place: If a city has a consciousness, what is Berlin's made of?

## Zoom
label: 8. Germany, fully zoomed out
zoom: 5.4
you: If you are your consciousness, what have you made from yours?
place: What will this church be narrating in another hundred years, and who will be listening?

## Section ending

## LV
So. A brand-new empire in a medieval costume, already out of fashion the day it opened.

## RV
A soldier on the back wall that nobody looks after, waiting for whoever wants to tell his story next.

## LV
And a sermon telling us we are our consciousness, in a room full of people who chose each other anyway.

## RV
pause: 1600

I still don't know what to make of it. Of any of it. The place, the people, him.

## LV
pause: 2200

Huh.

## LV
cite: czb

I just went on their website. They're doing missionary work in India now.

## RV
pause: 1800

So it goes on.

## LV
pause: 2600

It does.
