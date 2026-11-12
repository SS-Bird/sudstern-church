# Sudstern Church — an ergodic digital story

## Run it

```sh
./serve.sh
```

Then open http://localhost:8000. (Opening `index.html` by double-clicking won't work, because the
pages read their text from the `script/` folder and browsers block that for local files.)

To reset the "three strikes" counter, close the tab or open the site in a new one.

## Map

- `index.html`: Scene 1, the tourism blog Top 5 (ads → the "hijacked ad" Marx screen; churches 2–5 → strikes → sheep)
- `sudstern.html`: Scene 2, the photo viewer and review sidebar (the walking man → Scene 3; another search → rant)
- `rant.html`: Scene 2b, the wrong-search page
- `scene3.html`: Scene 3, the Street View walk (3.1), the fork (3.3), and both branches on the same page: 3.3a the headless statue, and 3.3b church (the pastors at the door, the interior, the sermon). `scene3.html?dev` shows coordinates; `?jump=scene3a`, `?jump=scene3b`, `?jump=scene3b-sermon` etc. skip ahead (`&flags=church` pretends the other branch is done); see `script/README.md`
- `scene4.html`: Scene 4, zooming out on the map with the question pairs
- `notes.html`: the Chicago notes; the small superscript numbers on the site link here
- Newsletter pop-up (every page, once per tab, after 3 s or the first click): the content warnings, and it hands over the dictionary and sticker book, which then work on every page. Text in `script/newsletter.md`
- Sticker book (every page): references earn stickers from Scene 1. Registry in `script/stickers.md`, drawings in `assets/stickers/`. Add `?stickers` to any page to show the book while testing
- `script/`: **all the text**, see `script/README.md`
- `assets/`: **all the images**, see `assets/README.md`
- `css/`, `js/`: styling and behaviour
- `LLM Bibliography/`: a record of each AI-assisted session
- `Kirche am Südstern A Place Without a Place.md`: the design document the site follows

## Hosting

It's a static site, so it can be hosted for free on GitHub Pages (or Netlify) to get a link for submission.
