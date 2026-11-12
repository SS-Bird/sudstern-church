# Scene 2 — Sudstern Church page (photo viewer + "search result" sidebar)

How this file works:
- `## Settings`: the place name, what's pre-typed in the search bar, and which searches count as
  "still Sudstern" (comma-separated, not case-sensitive). Any OTHER search goes to the rant page.
- `## Photo`: one per slide, in order. To put the clickable figure (the green walking Ampelmännchen, which leads to
  Scene 3) on a photo, add `plane: yes` and position it with `plane_top` / `plane_left` (percent of the photo,
  measured to its top-left corner) and `plane_width` (percent of the photo's width). `plane_image` is the picture.
- `## Review`: one per internet mention. `author` is the account name (e.g. Wikipedia),
  `avatar` (optional) is a logo image for the round profile picture; without it you get a coloured letter.
  `url` is the page you got it from (the name and "View original" link go there).
  Paste the review/article text as the body. Blank lines make new paragraphs.
  Long reviews are folded with a "More" button automatically.
- `## Reply`: a reply under the `## Review` above it. Readers see a "View N replies" button that opens the thread.
  `author` is the account name (shown as @name). Clicking the name opens @DissemiNadia's profile page.
- @DissemiNadia's profile page (and its pinned quote) is in `scene2-profile.md`.
- A review whose `author` is the profile's name (DissemiNadia) gets the profile's avatar, and her name opens the
  profile. `rating: 5 and 1` shows two star ratings side by side ("★★★★★ and ★☆☆☆☆").
- `cite` awards a sticker (see `stickers.md`): reviews when they scroll into view, replies when the thread
  is opened.
- `[^5]` is a footnote marker that links to note 5 on the Notes page (`notes.md`).

To check: whether the church is on the Berlin monument list (Denkmalliste), for the second Wikipedia reply.

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
image: assets/scene2/sudstern-1.jpg
alt: Sudstern Church from the street

## Photo
image: assets/scene2/sudstern-2.jpg
alt: Sudstern Church surrounded by traffic
plane: yes
plane_image: assets/scene2/walking-man.svg
plane_top: 71
plane_left: 76
plane_width: 14

## Photo
image: assets/scene2/sudstern-3.jpg
alt: Sudstern Church detail


## Review
author: SBahnBerlin
cite: google-maps-review
avatar: assets/scene2/s-bahn-logo.png
url: https://sbahn.berlin/liniennetz/sb_slnp/pois/857/kirche-am-suedstern/
rating: 
date: 

The Kirche am Südstern, an imposing neo-Gothic church, was built at the end of the 19th century and dominates the Südstern. The church is not only a place of worship, but also a venue for cultural events such as concerts and readings. Its striking towers and detailed façade make it an architectural highlight in Kreuzberg.

## Reply
author: DissemiNadia
cite: bhabha

"Dominates the Südstern." Look at who the subject of that sentence is. Not the square, not the people crossing it, not the S-Bahn. The church. It was built to dominate this square, and 129 years later we still describe it that way without thinking. The building wrote that sentence. You just typed it.

## Review
author: Brad333Toskana
cite: tripadvisor
avatar: assets/scene2/tripadvisor-logo.png
url: https://www.tripadvisor.de/ShowUserReviews-g187323-d23829613-r824522439-Kirche_Am_Sudstern-Berlin.html 
rating: 
date: 

Die Kirche am Südstern steht quasi auf einer "Verkehrsinsel". Sie wird umrahmt von den Südstern-Straßen, die vorher Gneisenaustr. und Hasenheide heißen.
Die Kirche ist ein imposantes und beeindruckendes Gebäude von über 60 Metern Länge und fast 40 Metern Breite. Der Kirchturm ist beeindruckende 90 Meter hoch.
Die Kirche wird heute vom Christlichen Zentrum Berlin, einem Zusammenschluss verschiedener Freikirchen, genutzt

## Reply
author: DissemiNadia
cite: bhabha

Brad, notice what you reached for: length, width, height. Sixty, forty, ninety metres. Nobody measured it at you. The building is designed so that the first thing you want to say about it is how big it is, and size was the argument Prussia was making. Also "umrahmt," framed. The roads bend around the church, not the other way round. Every car on the roundabout is still being steered by an 1890s decision. The people who use it now get your last sentence.

## Review
author: Wikipedia
cite: wikipedia
avatar: assets/scene2/wikipedia-logo.jpeg
url: https://de.wikipedia.org/wiki/Kirche_am_S%C3%BCdstern
rating: 
date: 

Die Kirche am Südstern wurde in den Jahren 1894 bis 1897 als evangelische Garnisonkirche im neugotischen Stil auf dem Kaiser-Friedrich-Platz – heute: Südstern – in Berlin-Kreuzberg nach einem Entwurf des Garnison-Bauinspektors Ernst August Roßteuscher erbaut.

Die Kirche wurde 1897 mit einer Orgel von Wilhelm Sauer ausgestattet, die 40 Register auf zwei Manualen und Pedal besitzt.[1] Diese Orgel besteht heute noch, allerdings in beschädigtem und verändertem Zustand.[2]

Zur selben Zeit wie die Kirche am Südstern entstand in unmittelbarer Nähe die Johannes-Basilika als katholische Garnisonkirche. Die beiden Kirchen wurden am 8. Mai 1897 in Anwesenheit von Kaiser Wilhelm II. und seiner Frau Auguste Viktoria eingeweiht.

Aufgrund ihrer monumentalen Dimensionen beherrscht die Kirche am Südstern den sie umgebenden Platz bis heute. Sie verfügt bei einer Länge von 62 Metern über eine Breite von 38 Metern. Der Hauptturm misst bis in die Spitze 90 Meter. Nach dem Ende des Ersten Weltkriegs 1918 verlor die Kirche ihre Funktion als Garnisonkirche und wurde zunächst vom Reichsfiskus für 30 Jahre gepachtet, um sie als evangelisches Gotteshaus zu erhalten. Nach Beschädigungen während des Zweiten Weltkriegs wurde sie für die Berliner Stadtmission instand gesetzt, die hier noch bis 1970 ihre Gottesdienste hielt. Nach dem Umzug der Stadtmission wurde die Kirche von der evangelischen Landeskirche an die Serbisch-Orthodoxe Kirche verpachtet, die die Kirche bis 1981 nutzte. Danach blieb sie frei, bis das Christliche Zentrum Berlin den Bau erwarb.

## Reply
author: DissemiNadia
cite: bhabha

This is what Bhabha calls the pedagogical voice. It is one tidy, dated story that teaches you what this place *is*. It describes the years, style, architect, emperor. It's a typical formula for describing any old building, and it hands the opening line to whoever built it. The Kaiser and his wife get full names. The Serbian Orthodox congregation, eleven years of other people's prayers, gets one clause. The congregation that fills it every Sunday now gets the last five words.

## Reply
author: DissemiNadia
cite: bhabha

And the past doesn't only speak through words. A protected building can't easily be changed. <!-- verify: whether the church is on the Berlin monument list --> The spire, the roundabout, the brick are all the 1890s getting a vote in what this place can become. The dead are participants in the narration. They just don't have to argue, because they poured concrete.

## Reply
author: DissemiNadia
cite: bhabha

So who is narrating Südstern? The Kaiser, through the stone. Wikipedia, through the dates. Brad, through the tape measure. The people inside, through every Sunday in two languages. None of them agree, and that's the point. A nation isn't the story that wins, it's the argument that never ends.

## Review
author: DissemiNadia
rating: 5 and 1
cite: bhabha

Five stars, one star, I genuinely can't decide, which I think is the review.

On Sunday mornings this building holds exactly what Bhabha calls "the new realities of internationalism, multi-nationalism": a congregation from all over the world, preaching in English and translating into German. But he warns that these new realities are "most often underwritten in that grim prose of power."[^12] Look up and you can read the prose. The congregation's roof is an imperial building. It is still standing, still warm, still letting them in, but it was built to say something else.

Historians like to talk about a nation's "origins" as if that were one tidy moment. Bhabha says the nation actually lives in "a much more transitional social reality."[^12] This church is what that looks like in brick. Empire, defeat, war damage, a city mission, a Serbian Orthodox congregation, an empty decade, an American revival, a West African Sunday. Every rupture is still here, and the founders still get their line in, because stone outlives the people who carved it.

Bhabha borrows a line from Benedict Anderson about how nation-states "loom out of an immemorial past and … glide into a limitless future."[^12] I don't think anyone has ever described a neo-Gothic church better. It's a young empire wearing a medieval costume, built big enough for a future it never got.

Would visit again. Would argue with it again. Bring a friend who disagrees with you.
