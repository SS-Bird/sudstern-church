# Scene 3.3b — Go to church (Part 0 the pastors, Part 1 the interior photo, Part 2 the sermon)

Same commands as `scene3-dialogue.md`, plus:
- `## Hide statue`: clears the screen back to Street View (needed when the reader comes here from the statue).
- `## Move to` (settings `lat`, `lng`, optional `face` and `pitch`): moves the reader in Street View to the
  nearest photo point and turns them to face the church (or the compass direction `face`, in degrees). Used to bring them to the front door for
  the pastors. Does nothing in preview mode.
- `## Show cutouts` / `## Hide cutouts`: the pastors' cardboard cutouts (set up in `scene3.md`, `## Cutout`).
  `## David` / `## Ben` are their lines.
- `## Show interior`: full-screen photo of the interior with clickable `## Hotspot` areas.
- `## Wait for hotspots` (setting `count`: a number, or `all`): waits until the reader has opened that many hotspots
  (and closed the pop-up). Sun rays fall on every hotspot from the start, and dim once it has been opened.
- `## Play sermon`: hides the photo and plays the sermon video, muted except between `unmute_at` and `mute_at`.
  LV and RV's lines show as paper notes while it plays.
- `at: m:ss` on any line (e.g. `at: 1:42`) waits until the video reaches that time before the note appears.
  `at` can also be `sound start`, `sound end` or `end`. Every note's time is editable here.
- `## Open page` (setting `page`): fades to black and opens another page (Scene 4 is `scene4.html`).

`## Settings`:
- `interior_image`, `sermon_video`: the photo and the video (206 seconds long, so it ends at 3:26). Notes can be
  timed after 3:26: the video holds its last frame and the clock keeps counting.
- `unmute_at` / `mute_at`: when the sound comes on and goes off again, as m:ss (or seconds).
- `notes_type_speed_ms`: 0 = notes appear whole, like a passed note. Set e.g. 25 to type them out instead.
- `fast_forward_speed`: how fast the "⏩ Fast forward" button (top left of the video) plays it, e.g. 4 = 4×.
  Fast-forwarding is always muted, and it switches itself off when the video reaches `unmute_at`, so the
  consciousness passage plays at normal speed. The notes keep their times, so they arrive faster too.

`## Hotspot`: one clickable area on the interior photo. `x` / `y` = its top-left corner and `w` / `h` = its size, all
in percent of the photo. `label` is for screen readers. `dictionary` (optional) adds that word to Twerp's dictionary
when it's opened. `cite` awards a sticker when that page of the pop-up is shown. The body is the pop-up text.
`## Card` right after a hotspot adds another page to the same pop-up (with ← → arrows and dots); none are used now.
`icon: arch` puts a little pointed arch at the top of a page (or give a path to your own image).
To add another hotspot, copy a whole block. Right now: "a person" is the woman standing alone in the right-hand aisle,
holding something up; "a seat on the left" is an empty chair at the front left.

Flow: the fork in `scene3-dialogue.md` → `## Section scene3b` (Part 0, the pastors at the door) → the interior →
"Find a seat." → `## Section scene3b-sermon`. At the end, if the reader hasn't seen the statue, LV offers "Show me."
(→ `scene3a` in `scene3a.md`); if they have, it goes on to Scene 4.
Test with `scene3.html?jump=scene3b`, `?jump=scene3b-sermon`, or add `&flags=statue` to pretend the statue is done.

Notes in the sermon that quote Bhabha award the `bhabha` sticker (`cite: bhabha`) instead of showing a footnote number.

Change requests for Claude:
-

---

## Settings
interior_image: assets/scene3.3b/interior.jpg
sermon_video: assets/scene3.3b/sermon.mp4
unmute_at: 1:45
mute_at: 2:20
notes_type_speed_ms: 0
fast_forward_speed: 4

## Hotspot
name: a person
label: A woman standing in the aisle
dictionary: imagined community
cite: anderson
x: 67.5
y: 42
w: 7
h: 33

Plenty of people come to see this church. It isn't a major tourist sight, but it turns up online as a place worth visiting for its striking architecture. Most visitors look at the outside. Some come in when nothing is happening, walk the aisle, take a photo and leave. A few might sit, or pray. But most treat it like a relic: something finished, kept behind glass.

Benedict Anderson notices how states turned old monuments into museum pieces, emblems that tell citizens *this is our heritage* without asking them to do anything about it.[^8] A church you only visit works the same way. It says that Germany is a Christian country and Europe is a Christian place, but in the past tense, as background, as wallpaper, as something that unites people precisely because nobody has to believe it any more.

On Sunday morning, though, this one is full of people who very much do.

## Hotspot
name: a seat on the left
label: An empty seat on the left
x: 3.5
y: 77
w: 8.5
h: 13

At around eleven in the morning, the sun comes through the stained-glass windows on this side and lands on whoever is sitting here. For the next hour you are gently blinded by a muted sunray.

The sun has come through these windows the same way for over a century, through the empire, the wars, the empty years, every congregation. It doesn't care who is sitting here.

There are fewer seats in the light now than there used to be. The trees outside have grown up in front of the windows.

## Section scene3b

## Set church

## Hide statue

<!-- Part 0: the pastors at the door. First the reader is moved to the front of the church, facing the west door. -->

## Move to
lat: 52.489250
lng: 13.405560
pitch: 12

## Show cutouts
cite: smith, hobsbawm

## RV
We made it. Okay. Be nice. I've wanted to come to one of these for weeks.

## David
Hello. Welcome. I'm David, I'm the senior pastor here.

## Ben
And I'm Ben. We're glad you found us.

## David
The service is just starting. We meet every Sunday at 10:30 in the morning. You don't need to know anyone, and you don't need to know anything. You can just come and sit.

## Ben
The sermon is in German and English. Today I'll be translating for Pastor David.

## David
This building has held a lot of people over a long time. We try to make sure everyone who walks in feels like they were expected.

## Ben
pause: 1600

The door is open. Come in.

## Hide cutouts

## RV
*(quietly)* …see? They're lovely. Two languages, one sermon. Nobody here was born into this church. They all chose it.

## LV
I didn't say they weren't lovely. And yes, anyone can join. You sign up by believing, not by being born somewhere.

## RV
So why do you sound like there's a "but"?

## LV
No but. Just watch though, then tell me it's one voice.

## RV
Two voices can still be one church.

## LV
pause: 1800

That's true.

<!-- Part 1: the interior -->

## Show interior

## Wait for hotspots
count: all

## Button
side: right
goto: scene3b-sermon

Find a seat.

## Wait for button

<!-- Part 2: the sermon. Muted opening 0:00–1:45 (12 notes) -->

## Section scene3b-sermon

## Play sermon
cite: aganyi

## RV
at: 0:04

ok. we're in. act normal.

## LV
at: 0:11

We are two voices in someone's head. Define normal.

## RV
at: 0:18

look at them though. the English is so loud. the German is so careful.

## LV
at: 0:26
cite: bhabha

Bhabha would love this room. "The margins of the nation displace the centre; the peoples of the periphery return to rewrite the history." An emperor's church, and the people telling its story on Sunday are the ones the empire kept at its edges.

## RV
at: 0:36

the edges?

## LV
at: 0:42

Germany ruled Cameroon from 1884 until the First World War. I'm not sure exactly where everyone is from, but I know at least one person in this room comes from Cameroon. The margins are holding the microphone.

## RV
at: 0:51

so is this still a German church?

## LV
at: 0:58
cite: bhabha

Bhabha says the nation lives in "a much more transitional social reality" than its origin story admits. Nothing here stays one thing long enough to be "the original." Not the building, not the congregation, not Germany.

## Dictionary add
word: transitional social reality

## RV
at: 1:09

ok but then what am I? I'm from somewhere. I've got a passport. I sometimes go to church. I'm not sure I believe. which of those is me?

## LV
at: 1:19
cite: bhabha

All of them, depending on who's asking. His questions: "When did we become 'a people'? When did we stop being one? Or are we in the process of becoming one?"

## RV
at: 1:30
cite: bhabha

and the last one. "what do these big questions have to do with our intimate relationships with each other." like. with the person sitting next to me.

## LV
at: 1:41

Everything, apparently. Shh. He's about to say the good bit.

<!-- With sound 1:45–2:20 (3 notes; placeholders, tune these so they don't cover the key line) -->

## RV
at: 2:05

"you are your consciousness."

## Dictionary add
word: consciousness

## LV
at: 2:10

Rude. Some of us are ONLY our consciousness.

## RV
at: 2:15

finally, a sermon written for us.

<!-- Muted end 2:20 onwards (9 notes). The video ends at 3:26 and stays on its last frame; times after that keep counting, so the last notes get time to be read. -->

## LV
at: 2:22

So if you are your consciousness, and you only produce what comes out of it, then what is it made of?

## RV
at: 2:31

for him: God, I think. that's his point.

## LV
at: 2:39

For the rest of us, a lot of consciousness comes from categories. German. Not German. Christian. Not really. Born here. Came here. We understand ourselves through the boxes we were handed, and then we produce more of them. Every one of those boxes is a story somebody else is still narrating.

## RV
at: 2:54

but look at this room. two languages, two ways of dressing, two ways of praying, one church. they chose each other. that's not a box you're born into.

## LV
at: 3:06
cite: bhabha

It's both. They chose each other and you can still see exactly where everyone came from. The ambivalence never resolves.

## RV
at: 3:20

so what's the city's consciousness then? if it has one.

## LV
at: 3:28
cite: lewis

Everything that ever happened in it, still talking at once. The Kaiser in the spire. Reichensperger's arches in the Kaiser's city. The war on the back wall. The Wall on the map. These people in the pews, rewriting all of it.

## RV
at: 3:43

and ours?

## LV
at: 3:49
pause: 7000

Ours is whatever the reader brings. We don't get a body. We just get Twerp.

<!-- Exit -->

## If statue
goto: church-to-scene4

## LV
I know something else about the consciousness of this site. Can I show you?

## Button
side: left
goto: scene3a

Show me.

## Wait for button

## Section church-to-scene4

## Open page
page: scene4.html
