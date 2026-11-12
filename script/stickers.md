# Stickers — the sticker book registry

Every reference the reader meets earns a sticker, on any page. All references by the same author or source
share one sticker. Collected stickers last for the browser tab. The book's page corner appears when the newsletter
pop-up closes (`newsletter.md`), a few seconds into Scene 1; anything collected before that arrives silently.

Each `## <id>` is one sticker, in the order they appear in the book. The id is a single word (dashes are fine).
- `author`: who or what it is (for you; the book shows `label`).
- `label`: the name shown under the sticker.
- `art`: which drawing to use: `assets/stickers/<art>.svg`. To swap a drawing, replace that file
  (keep it square and without a background; the white sticker edge and shadow are added automatically).
  The hover animations look for these classes on parts of the drawing: `st-bob`, `st-spin`, `st-sparkle`,
  `st-glow`, `st-flag`, `st-beam`, `st-bubble`. Without them the whole sticker just wiggles.
- `citation`: the full Chicago note, shown in small type under the sticker.
- The body (optional): more citations for the same author (e.g. Anderson's two books, Bhabha's two essays),
  shown under the first.

How stickers are awarded: add `cite: <id>` (or `cite: id1, id2`) to
- any dialogue block (an LV/RV line, a `## Dictionary add`, `## Statue flash`, `## Play sermon`, …): when it runs
- a `## Step N` in `scene3.md`: when that step is reached; `turn_around_cite` in `scene3.md` Settings: the first "Turn around"
- a church in `scene1-churches.md`: when the entry scrolls into view
- a `## Quote` in `scene1-marx.md`: when that red screen opens (an `## Ad` can have one too: when it's clicked)
- a `## Review` in `scene2-sudstern.md`: when it scrolls into view; a `## Reply`: when its thread is opened;
  `## Profile` in `scene2-profile.md`: when the profile is opened
- a `## Hotspot` or `## Card` in `scene3b.md`: when that page of the pop-up is shown
- a dictionary word in `dictionary.md`: when that page is shown
- or use the `## Sticker` dialogue command (setting `id`) to award one at any moment.

For testing, add `?stickers` to any page's address to show the corner straight away.

Change requests for Claude:
-

---

## marx
author: Karl Marx
label: Karl Marx
art: marx
citation: Karl Marx, preface to *A Contribution to the Critique of Political Economy* (1859), Marx/Engels Internet Archive, accessed November 12, 2026, [https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface-abs.htm](https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface-abs.htm).

## billig
author: Michael Billig
label: Michael Billig
art: billig
citation: Michael Billig, *Banal Nationalism* (London: Sage, 1995), 8.

## google-maps-review
author: SBahnBerlin (map review)
label: SBahnBerlin's review
art: google-maps-review
citation: SBahnBerlin, review of Kirche am Südstern, Google Maps, accessed November 2026, [https://sbahn.berlin/liniennetz/sb_slnp/pois/857/kirche-am-suedstern/](https://sbahn.berlin/liniennetz/sb_slnp/pois/857/kirche-am-suedstern/).

## tripadvisor
author: Brad333Toskana (Tripadvisor)
label: Brad333Toskana's review
art: tripadvisor
citation: Brad333Toskana, review of Kirche am Südstern, Tripadvisor, accessed November 2026, [https://www.tripadvisor.de/ShowUserReviews-g187323-d23829613-r824522439-Kirche_Am_Sudstern-Berlin.html](https://www.tripadvisor.de/ShowUserReviews-g187323-d23829613-r824522439-Kirche_Am_Sudstern-Berlin.html).

## wikipedia
author: Wikipedia
label: Wikipedia
art: wikipedia
citation: "Kirche am Südstern," *Wikipedia*, accessed November 11, 2026, [https://de.wikipedia.org/wiki/Kirche_am_S%C3%BCdstern](https://de.wikipedia.org/wiki/Kirche_am_S%C3%BCdstern).

## bhabha
author: Homi K. Bhabha
label: Homi K. Bhabha
art: bhabha
citation: Homi K. Bhabha, "DissemiNation: Time, Narrative, and the Margins of the Modern Nation," in *Nation and Narration*, ed. Homi K. Bhabha (London: Routledge, 1990), 291–322.

Homi K. Bhabha, "Introduction: Narrating the Nation," in *Nation and Narration*, ed. Homi K. Bhabha (London: Routledge, 1990), 1–7. Bhabha quotes Benedict Anderson's *Imagined Communities* in this introduction.

## bonnie-tyler
author: Bonnie Tyler
label: Bonnie Tyler
art: bonnie-tyler
citation: Bonnie Tyler, "Total Eclipse of the Heart," on *Faster Than the Speed of Night* (CBS, 1983).

## digital-cosmonaut
author: Digital Cosmonaut
label: Digital Cosmonaut
art: digital-cosmonaut
citation: "Denkmal für die Gefallenen der Garde Pioniere – Kirche am Südstern," *Digital Cosmonaut*, accessed November 9, 2026, [https://digitalcosmonaut.com/denkmal-gefallenen-garde-pioniere-kirche-am-suedstern/](https://digitalcosmonaut.com/denkmal-gefallenen-garde-pioniere-kirche-am-suedstern/).

## czb
author: Christliches Zentrum Berlin
label: CZB
art: czb
citation: "About CZB," Kirche am Südstern – Christliches Zentrum Berlin, accessed November 9, 2026, [https://www.kirche-am-suedstern.org/en/about-czb](https://www.kirche-am-suedstern.org/en/about-czb).

"CZB Missionary Work," Kirche am Südstern – Christliches Zentrum Berlin, accessed November 2026, [https://www.kirche-am-suedstern.org/en/copy-of-daughter-churches-1](https://www.kirche-am-suedstern.org/en/copy-of-daughter-churches-1).

## dictionary
author: The dictionary
label: The dictionary
art: dictionary
citation: [PLACEHOLDER: dictionary citation for *local* and *heritage*]

## smith
author: Anthony D. Smith
label: Anthony D. Smith
art: smith
citation: Anthony D. Smith, "Opening Statement: Nations and Their Pasts," *Nations and Nationalism* 2, no. 3 (1996): 358–65, [https://www.lse.ac.uk/researchAndExpertise/units/gellner/Warwick0.html](https://www.lse.ac.uk/researchAndExpertise/units/gellner/Warwick0.html).

## mosse
author: George L. Mosse
label: George L. Mosse
art: mosse
citation: George L. Mosse, *Fallen Soldiers: Reshaping the Memory of the World Wars* (New York: Oxford University Press, 1990).

## koselleck
author: Reinhart Koselleck
label: Reinhart Koselleck
art: koselleck
citation: Reinhart Koselleck, "War Memorials: Identity Formations of the Survivors," in *The Practice of Conceptual History: Timing History, Spacing Concepts*, trans. Todd Samuel Presner et al. (Stanford: Stanford University Press, 2002), 285–326.

## horror-clip
author: The horror clip
label: The horror clip
art: horror-clip
citation: *Leprechaun Returns*, decapitation clip, YouTube video, Movieclips, March 11, 2024, [https://www.youtube.com/watch?v=-uRg2hoE2KI](https://www.youtube.com/watch?v=-uRg2hoE2KI).

## anderson
author: Benedict Anderson
label: Benedict Anderson
art: anderson
citation: Benedict Anderson, "Census, Map, Museum," in *Imagined Communities: Reflections on the Origin and Spread of Nationalism*, rev. ed. (London: Verso, 2006), 167–90.

Benedict Anderson, *Imagined Communities: Reflections on the Origin and Spread of Nationalism*, rev. ed. (London: Verso, 2006), 6.

## lewis
author: Michael J. Lewis
label: Michael J. Lewis
art: lewis
citation: Michael J. Lewis, *The Politics of the German Gothic Revival: August Reichensperger* (New York: Architectural History Foundation; Cambridge, MA: MIT Press, 1993), 160, 220, 246, 266–67.

## gellner
author: Ernest Gellner
label: Ernest Gellner
art: gellner
citation: Ernest Gellner, "Reply: Do Nations Have Navels?," *Nations and Nationalism* 2, no. 3 (1996): 366–70, [https://www.lse.ac.uk/researchAndExpertise/units/gellner/Warwick0.html](https://www.lse.ac.uk/researchAndExpertise/units/gellner/Warwick0.html).

## hobsbawm
author: Eric Hobsbawm
label: Eric Hobsbawm
art: hobsbawm
citation: Eric Hobsbawm, *Nations and Nationalism since 1780: Programme, Myth, Reality* (Cambridge: Cambridge University Press, 1990), 8–13.

## aganyi
author: David Aganyi
label: David Aganyi's sermon
art: aganyi
citation: David Aganyi, *Christ Consciousness*, YouTube video, Christliches Zentrum Berlin TV, February 20, 2017, [https://www.youtube.com/watch?v=dRjQsT_PACg](https://www.youtube.com/watch?v=dRjQsT_PACg).
