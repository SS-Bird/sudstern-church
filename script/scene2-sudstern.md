# Scene 2 — Sudstern Church page (photo viewer + "search result" sidebar)

How this file works:
- `## Settings`: the place name, what's pre-typed in the search bar, and which searches count as
  "still Sudstern" (comma-separated, not case-sensitive). Any OTHER search goes to the rant page.
- `## Photo`: one per slide, in order. To put the plane on a photo, add `plane: yes` and position it
  with `plane_top` / `plane_left` (percent of the photo, measured to the plane's top-left corner)
  and `plane_width` (percent of the photo's width).
- `## Review`: one per internet mention. `author` is the account name (e.g. Wikipedia),
  `url` is the page you got it from (the name and "View original" link go there).
  Paste the review/article text as the body. Blank lines make new paragraphs.
  Long reviews are folded with a "More" button automatically.

Change requests for Claude:
-

---

## Settings
place_name: Sudstern Church
search_text: Sudstern Church
accepted_searches: sudstern church, südstern church, sudstern, südstern, kirche am südstern, kirche am sudstern
subtitle: Church · Berlin-Kreuzberg
rating: 4.6
review_count: 

## Photo
image: assets/scene2/sudstern-1.svg
alt: Sudstern Church from the street

## Photo
image: assets/scene2/sudstern-2.svg
alt: Sudstern Church surrounded by traffic
plane: yes
plane_top: 6
plane_left: 58
plane_width: 11

## Photo
image: assets/scene2/sudstern-3.svg
alt: Sudstern Church detail

## Review
author: Wikipedia
url: https://de.wikipedia.org/wiki/Kirche_am_S%C3%BCdstern
rating: 
date: 

[PLACEHOLDER — paste the content of the Wikipedia article here.]

Blank lines between paragraphs are kept as separate paragraphs.

## Review
author: Tripadvisor
url: https://www.tripadvisor.com/
rating: 
date: 

[PLACEHOLDER — paste the Tripadvisor review here, and put the exact review page in `url` above.]

## Review
author: Google Maps
url: https://maps.google.com/
rating: 
date: 

[PLACEHOLDER — add as many `## Review` blocks as you find mentions. Delete this one if you don't need it.]
