# Scene 3 — The conversation at the church (LV = left voice, RV = right voice)

How this file works (same commands in `scene4a.md`):
- `## LV` / `## RV`: one line. Left = black on white highlight, right = white on black. Typed letter by letter.
  - `corner_star: <name>` adds a gold star to the corner (each name only once). `inline_star: yes` puts one after the text.
  - `pause: 2000` waits longer (in ms) before the next line. Readers can press » or Space to skip typing.
  - Blank lines inside a line make new paragraphs.
- `## Section <name>`: a label. `## Go to <name>` jumps there. `## End` stops.
- `## Choice`: options for Twerp, one per line: `- Label -> section-name`.
- `## Button` (settings `side`, `goto`): a button under the last line. `## Wait for button` waits for a click.
- `## Textbox` (setting `button`): Twerp writes something; the body is the grey hint text.
- `{years since 1929-06-01}` is replaced by the number of full years since that date.

Sections this page uses: `arrival` (at the final step), `unit-a`, `unit-b`, `unit-c` (at spots, in the order
listed in scene3.md), `all-found` (after all spots), and `scene4b` (placeholder).

Change requests for Claude:
-

---

## Section arrival

## LV
corner_star: arrival

You made it! You get a gold star!

## LV
If you are a good tourist, practically a local, you will collect all 5 stars!

## RV
What is a *local* in Berlin? No one is local here.

## RV
What is a *local* anywhere really.

## LV
Okay whatever Anderson. Do you want a gold star?

## RV
inline_star: yes

Yes!

## LV
This is Sudstern Church. Or, in German they would call it Kirche am Südstern.

## End

## Section unit-a

## LV
The church was started in 1894 and finished in 1897. The architect was Ernst August Roßteuscher, who was the Prussian State Architect, so this was a government project from the beginning.

## RV
So it went up in three years. Was the opening a big deal?

## LV
Pretty big. Kaiser Wilhelm II came to the inauguration with his wife. In the 1890s Berlin was growing fast and the empire was building a lot of churches. Having the Kaiser at an opening showed how closely church and state were tied together at the time.

## RV
That makes sense. It does look like it was built to impress someone.

## End

## Section unit-b

## LV
The main spire is 89 meters tall. That makes it the third tallest church in Berlin today, after the Berliner Dom at 98.8 meters and St. Marien in Mitte at 89.7 meters.

## RV
So it's almost tied with St. Marien. Does it look like the other two?

## LV
Not really. It's neo-Gothic, so it's all pointed arches and tall vertical lines, built to pull your eye upward. The Berliner Dom is much heavier and rounder, with a big dome. Even though the heights are close, this one feels taller and narrower.

## RV
Yeah, I see that. It's all lines going up.

## End

## Section unit-c

## LV
It was built as a Protestant church, and it stayed Protestant after the First World War. Today it's run by the Christliches Zentrum Berlin, the Christian Center Berlin, which most people shorten to CZB. It's a free church, so it isn't part of the main regional Protestant church.

## RV
Where did CZB come from? Have they been here long?

## LV
The community goes back to the 1950s. Harold Herman, an American who used to work as a Hollywood cameraman, came to Berlin as a missionary after the war and held tent services on Potsdamer Platz, right on the sector border. In 1971 young people dealing with drug addiction started coming, and that became the start of the Jesus People movement here. During reunification in 1989 and 1990, the church opened its doors to people from both East and West.

## RV
That's a lot of history for one congregation. And the building holds up to a thousand people, so there's room for everyone who wants to come.

## End

## Section all-found

## LV
oh I have an answer.

## RV
huh? It's time for church come on.

## LV
what do you think twerp?

## Button
side: left
goto: scene4a

What answer?

## RV
fuck off we shouldn't be rude they invited us

## Button
side: right
goto: scene4b

Go to church.

## Wait for button

## Section scene4b
<!-- Placeholder until Scene 4b is written -->

## RV
[Scene 4b isn't written yet.]

## End
