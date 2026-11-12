# Scene 3.1 and 3.3 — The conversation at the church (LV = left voice, RV = right voice)

How this file works (same commands in `scene3a.md` and `scene3b.md`):
- `## LV` / `## RV`: one line. Left = black on white highlight, right = white on black. Typed letter by letter.
- `## David` / `## Ben`: the pastors' lines, used in `scene3b.md` (cutouts set up in `scene3.md`, `## Cutout`).
  `## Show cutouts` / `## Hide cutouts` make the cardboard figures pop up and go away.
- Settings any line can have:
  - `pause: 2000` waits longer (in ms) before the next line. Readers can press » or Space to skip typing.
  - Blank lines inside a line make new paragraphs.
- `## Section <name>`: a label. `## Go to <name>` jumps there. `## End` stops.
- `## Choice`: options for Twerp, one per line: `- Label -> section-name`.
- `## Button` (settings `side`, `goto`): a button under the last line. `## Wait for button` waits for a click.
- `## Textbox` (setting `button`): Twerp writes something; the body is the grey hint text.
- `## Star`: a big gold star spirals into the middle of the screen (about 1.2 s), then shrinks and fades away.
  The conversation waits for it.
- `cite: <sticker id>` (or `cite: id1, id2`) on ANY block awards those stickers when it runs (see `stickers.md`).
  `## Sticker` (setting `id`) awards one at that moment, without a line.
- `{years since 1929-06-01}` is replaced by the number of full years since that date.
- `[^1]` is a footnote marker: a small superscript 1 that links to note 1 on the Notes page (`notes.md`).
- `## Set <flag>` remembers something happened. `## If <flag>` / `## If not <flag>` (setting `goto`) jump if it did / didn't.
  The flags `statue` and `church` are set when the reader starts 3.3a / 3.3b, so each knows if the other is done.

Sections this page uses: `arrival` (at the final step), `unit-a`, `unit-b`, `unit-c` (at the three spots, in
whatever order the reader finds them; each one stands alone), and `all-found` (Scene 3.3, the fork, once all three
spots are found). The fork's buttons go to `scene3a` (the statue, `scene3a.md`) and `scene3b` (church, `scene3b.md`).
Unit B adds "Gothic Revival" to the dictionary, so the dictionary corner can first appear on the walk.

Change requests for Claude:
-

---

## Section arrival

## LV
Look at you Twerp, wandering through a niche little Kreuzberg neighbourhood like you live here. You're such a good tourist. Here, have a gold star!

## Star

## LV
Practically a local!

## RV
What is a *local* in Berlin? No one is local here.

## RV
What is a *local* anywhere really.

## LV
Okay whatever. Do you want a gold star?

## RV
Yes!

## Star

## LV
This is Sudstern Church. Or, in German they would call it Kirche am Südstern.

## End

## Section unit-a

## LV
cite: wikipedia

You've probably already read the dates, 1894 to 1897. Kaiser Wilhelm II and Empress Auguste Viktoria opened it on 8 May 1897. On the same day they also consecrated the Johannes-Basilika, a Catholic church built just around the corner at the same time.[^1]

## RV
So the Kaiser opened two churches, one Protestant and one Catholic, side by side, on the same afternoon. That's a lot of effort for one square.

## LV
It was deliberate. Berlin was growing fast, the empire was barely 25 years old, and putting the emperor at the altar told everyone that church, crown and state came as a package. The architect, Ernst August Roßteuscher, was a state building official.[^1] That makes this a government building as much as a religious one.

## End

## Section unit-b

## LV
cite: wikipedia, lewis, gellner, smith

It's neo-Gothic: pointed arches, buttresses, everything pulling your eye up to a spire about 90 metres high. Look at what that does. The German Empire was barely 25 years old when this went up, and it dressed itself in the Middle Ages. In that era, picking a style was picking a story about the nation. When the new empire argued over what style its Reichstag should be, classical meant a centralised state like Rome, and Gothic meant the Middle Ages: spread-out power, old parliaments. The historian Michael Lewis puts the stakes simply: "what Germany chose to find in the past would signal her aspirations for the future." A brand-new state referencing a proud "ancient" history. In their Warwick debate, Ernest Gellner and Anthony Smith argued over whether nations have "navels": real roots in an ethnic past, or modern inventions that only look as if they were born. Gellner thought a nation could be fully modern without one. The Gothic is the empire drawing its own navel on.

## RV
But why Gothic? Plenty of Berlin is all Greek columns and domes. The Berliner Dom looks nothing like this.

## LV
cite: lewis

Because Gothic spent the whole century being fought over. In the 1840s and 50s a Catholic politician from the Rhineland, August Reichensperger, campaigned for Gothic as the true art of the German people, rooted in a "healthy folk instinct" and surviving in village carpentry. His enemy was Berlin. He told a Berlin audience: "Berlin has no folk art. She only has court art," imitation Greek, "out of place in the cold north." Then the Protestant north took his style and made it national. Lutherans came to see Gothic "in chiefly nationalist terms," and in 1861 the church rules drawn up at Eisenach brought Gothic into Protestant church building. But actually, by the time this church opened, it was already a little out of date after its peak fashionability in the 80s. Wilhelm II, the Kaiser who opened it, preferred round-arched Romanesque. The nationalist feeling Gothic used to carry was, in Lewis's words, "being drained toward Romanesque building."

## Dictionary add
word: Gothic Revival

## RV
So a style the margins used against the capital ended up as the capital's own costume. A Catholic, small-town, "folk" style, built here by a state architect and opened by the Kaiser.

## LV
The story never stops changing hands.

## RV
And now look who fills it on Sunday. It's changing hands again.

## End

## Section unit-c

## LV
cite: wikipedia

After 1918 the building lost its original job, and the Reich treasury leased it for 30 years to keep it running as a Protestant church. It was damaged in the Second World War, then repaired for the Berliner Stadtmission, which held services here until 1970. After that it was leased to the Serbian Orthodox Church, which used it until 1981. Then it stood empty.[^1]

## RV
Empty? This huge thing?

## LV
cite: czb

For a while, until the Christliches Zentrum Berlin bought it, an alliance of free churches.[^1] Its roots go back to the 1950s. Harold Herman, an American who used to be a Hollywood cameraman, held tent services on Potsdamer Platz, right on the sector border. According to their website, in the 1970s young people dealing with addiction joined as part of the Jesus People movement, and then in 1989 and 1990 the church opened its doors to East and West alike.[^3]

## RV
So it's had imperial Prussians, a city mission, Serbian Orthodox families, an empty decade, and an American revival that has grown into a congregation from all over the world.

## End

## Section all-found

## LV
oh I have an answer.

## RV
huh? To what question?

## LV
To that question you asked at the start.

## RV
What question? It's Sunday. I've been meaning to come to a service here for weeks, and it starts any minute. Come on.

## LV
what do you think Twerp?

## Button
side: left
goto: scene3a

What answer?

## RV
fuck off, I've waited ages for this, we're going in

## Button
side: right
goto: scene3b

Go to church.

## Wait for button
