# Sudstern Church — an ergodic digital story

## Run it

```sh
./serve.sh
```

Then open http://localhost:8000. (Opening `index.html` by double-clicking won't work, because the
pages read their text from the `script/` folder and browsers block that for local files.)

To reset the "three strikes" counter, close the tab or open the site in a new one.

## Map

- `index.html`: Scene 1, the tourism blog Top 10 (ads → Marx; churches 2–10 → strikes → sheep)
- `sudstern.html`: Scene 2, the photo viewer and review sidebar (plane → Scene 3; another search → rant)
- `rant.html`: Scene 2b, the wrong-search page
- `scene3.html`: Scene 3, the Street View walk and the conversation around the church, plus Scene 4a (the headless statue) on the same page. `scene3.html?dev` shows coordinates; `?jump=scene4a` skips ahead
- `script/`: **all the text**, see `script/README.md`
- `assets/`: **all the images**, see `assets/README.md`
- `css/`, `js/`: styling and behaviour
- `LLM Bibliography/`: a record of each AI-assisted session

## Hosting

It's a static site, so it can be hosted for free on GitHub Pages (or Netlify) to get a link for submission.
