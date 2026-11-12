# Scene 3.3a — What answer? (the headless statue behind the church)

Same commands as `scene3-dialogue.md` (including `## Set`, `## If`, `## If not` and `[^n]` footnotes), plus:
- `## Statue flash`: flashes the statue photo for an instant, plays the horror clip full screen, then shows the photo.
- `## Reveal monument`: zooms out from the soldier to the whole monument (only once: if it has already zoomed out,
  it does nothing). It's used in the "What is going on…" branch, and again just before RV's oak-leaves line in the
  joint plot, so every path ends up seeing the whole statue.
- `## Dictionary add` (setting `word`): adds a page + tab to the dictionary and pokes the page corner up.
- `## Wait for dictionary`: waits until Twerp opens the dictionary (bottom-left page corner).
- `## Wait for page` (setting `word`): waits until the dictionary is open on that word ("flip the page").
- `## Close dictionary`: closes the dictionary straight away.
- `## Open page` (setting `page`): fades to black and opens another page (Scene 4 is `scene4.html`).

Flow: the fork in `scene3-dialogue.md` → `## Section scene3a`. At the end, if the reader hasn't been to church yet,
RV offers "Go to church." (→ `scene3b` in `scene3b.md`); if they have, it goes on to Scene 4.
The `church` flag (set when 3.3b starts) also picks RV's "**It** is not a local" ending: "the people inside that
church are locals" before church, "Ben and David are locals" after.
Test with `scene3.html?jump=scene3a`, or `scene3.html?jump=scene3a&flags=church` to pretend church is done.

`## Settings`:
- `statue_image`: the photo. It starts zoomed in by `zoom`, centred on `focus_x` / `focus_y`
  (percent of the photo), and `## Reveal monument` zooms out to show the whole thing.
- `horror_clip`: the decapitation clip (MP4). `flash_ms`: how long the first flash of the photo lasts.

To do: replace the placeholder dictionary definitions for *local* and *heritage* (in `dictionary.md`) with a cited dictionary.

Change requests for Claude:
-

---

## Settings
statue_image: assets/scene3.3a/statue.jpg
zoom: 6.5
focus_x: 49
focus_y: 32.5
horror_clip: assets/scene3.3a/horror-clip.mp4
flash_ms: 250

## Section scene3a

## Set statue

## Statue flash
cite: horror-clip

## RV
What the hell??

## LV
You asked for it.

## RV
When? I didn't, I really didn't.

## LV
You asked *whose a local* well here you go. He's a local.

## RV
What?

## LV
He has lived here for {years since 1929-06-01} years, since the first of June 1929.

## RV
What. 'He' doesn't live here and can't be 'local'

## LV
I disagree! He is the very definition.

## If church
goto: statue-been-to-church

## RV
Oh shut up let's join them we still have time –

## Go to statue-dictionary

## Section statue-been-to-church

## RV
Oh shut up, we've already been to church, can we just go home –

## Section statue-dictionary

## LV
Twerp, would you please pull up your dictionary?

## Dictionary add
word: local

## Wait for dictionary

## LV
So Twerp, you think my rock buddy counts as a local?

## Choice
- Yes -> yes-1
- No -> no-1
- What is going on what is that statue where's its head? -> what

## Section yes-1

## LV
HA! Twerp agrees.

## RV
well I still don't, so both of you, make your case.

## Textbox
button: Submit

Make your case…

## RV
...okay… and what do you say?

## Go to joint

## Section no-1

## RV
See! Twerp agrees you are crazy! What do you even mean?

## Go to joint

## Section what

## Close dictionary

## LV
Oh sorry Twerp, didn't mean to confuse ya. We're just behind the church. I guess you couldn't quite see this part from the road, with the tree blocking it.

## RV
So you took as away from a lovely hospitable community to come to the smoking alley where you are watched by a headless nazi?

## LV
He's not a Nazi! Well, I mean, the dude who made him was, and yeah he was a German soldier, or he represents German soldiers. But the soldiers of world war 1, not 2. Can you even read?? Look at his plaque.

## Reveal monument

## LV
And I mean, yeah not great either, but sounds better than Nazi.

## RV
Could you give us some real information for once?

## LV
cite: digital-cosmonaut

*Fine*, Ahem *cough cough*: This is the Denkmal für die Gefallenen Garde-Pioniere, the Memorial to the Fallen Guard Pioneers. It was unveiled on the 1st of June, 1929, on the wall of this church. The figure is larger than life.

It shows a pioneer. Pioneers were the combat engineers, the ones who dug, built and blew things up. His rifle is slung over his back. He holds a pickaxe in his right hand and what look like oak leaves in his left. Two stick grenades hang from his ammunition belt. Lightning bolts frame him, probably meant to look like a little Roman shrine, a niche for a god.

The inscription says: '1914–1918. Den gefallenen Garde-Pionieren. Vorwärts und durch.' That means: to the fallen Guard Pioneers, forward and through. There's an Iron Cross on each side and a Prussian Guard star underneath.

His head has been broken off since at least 2008. Nobody knows where it is.

These days the base is usually covered in graffiti, and someone throws paint on him every so often. The area around him is full of rubbish and weeds. As far as anyone can tell, neither the church nor the city has much interest in looking after him.

## RV
And it was built by a Nazi?

## LV
Yeah, Hermann Hosaeus. Born 1875 in Eisenach, died 1958 in Berlin.

He trained all over the place: the arts and crafts school in Dresden in 1891, then Nuremberg in 1892, the Munich Art Academy in 1894, and the Berlin Art Academy in 1898. Sculpture and design, and he especially liked medals.

He fought in the first world war and was wounded. In 1918 he settled in Berlin and taught at the Art Academy.

By the early 1920s he was working for the Prussian state's advisory office for war memorials, part of the Ministry of Science, Arts and Public Education. He helped write the national guidelines for how war memorial committees should do things. So he didn't just make war memorials, he helped write the rules for them.

He made more than fifty monuments and war memorials. The best known are the Hindenburg statue at the Kyffhäuser Monument and the lion monument at Rudelsburg.

At some point he joined the Nazi Party. The records aren't clear on when. What is clear is that it didn't hurt his career at all.

## If church
goto: locals-met-pastors

## RV
Why do you keep calling the statue a 'he'. Its a statue. Stop trying to personify things and history into people. *People* have character. *People* have will and agency. *People* feel love and pain and joy. Don't subjugate *people* to the fake character and will and agency and love and pain and joy of an old piece of rock. Nonetheless an old nazi piece of rock.

**It** is not a local: the people inside that church are locals.

## Go to locals-done

## Section locals-met-pastors

## RV
Why do you keep calling the statue a 'he'. Its a statue. Stop trying to personify things and history into people. *People* have character. *People* have will and agency. *People* feel love and pain and joy. Don't subjugate *people* to the fake character and will and agency and love and pain and joy of an old piece of rock. Nonetheless an old nazi piece of rock.

**It** is not a local: Ben and David are locals.

## Section locals-done

## LV
pause: 1800

...

## LV
You know I think you might be reading too much into it.

## RV
Yeah well, shit matters. You still think it's local?

## LV
Well honestly yeah, **it** *is* local. Twerp, pull up your dictionary.

## Wait for dictionary

## LV
So is **it** local?

## Choice
- Yes -> yes-2
- No -> no-2

## Section yes-2

## Textbox
button: Submit

Explain…

## LV
Ha! Thanks Twerp.

## Go to joint

## Section no-2

## Textbox
button: Submit

Explain…

## LV
Okay, well you guys don't have to agree, but hear me out.

## Go to joint

## Section joint

## LV
Here's my case. Forget blood, forget birthplace. Say belonging to a place means showing up, staying, being part of what happens there. Then he wins. He's been on this wall for {years since 1929-06-01} years. He outlasted the Reich treasury lease, the bombs, the Stadtmission, the Serbian Orthodox congregation and the empty years. Every single person who ever came to this church walked past him. If the collective is this neighbourhood, he's its longest-standing member.

## RV
That's a civic argument for the least civic thing in Kreuzberg. Look at what he's made of.

## Dictionary add
word: civic nationalism
cite: smith

## Dictionary add
word: ethnic nationalism
cite: smith

## Dictionary add
word: ethno-symbolism
cite: smith

## Reveal monument

## RV
cite: mosse

Oak leaves: the German oak. An Iron Cross, which is literally a cross. A motto telling dead men they died moving forward. Mosse calls it the cult of the fallen soldier.[^9] The nation borrowed the church's story of sacrifice and resurrection and gave it to soldiers. Then someone hung it on a church, so that you'd feel the two were the same thing. He's not a member of the neighbourhood's collective. He's the membership card for a different one, the kind you are born into and die for.

## Dictionary add
word: cult of the fallen soldier

## Dictionary add
word: heritage

## LV
Fine. But then he's pure heritage. Heritage is what gets handed down. People inherit things and then decide what to do with them. He can't decide anything. He just keeps saying what he was made to say.

## RV
Which is exactly why he can't be local. Being local means you could have left, and you didn't.

## LV
cite: koselleck

But here's the thing: nobody hears what he was made to say any more. Koselleck says memorials are built to give the survivors an identity.[^10] The survivors are all dead. Now people walk past, see a German soldier, decide he's a Nazi, and throw paint. He's still in the conversation. He's just losing the argument.

## RV
Loudly. Headlessly.

## RV
And that's the part this country mostly doesn't want to look at. Prussia's army, two world wars, the Holocaust. A lot of that past is either quietly neglected, like him behind this church, or carried around as guilt.

## LV
Both make sense. Neglect is easier than deciding what to do with him. And guilt is the honest response to a lot of it.

## RV
But a neglected symbol isn't a neutral one. If nobody else narrates him, someone else will. Violent groups today are very good at picking up an abandoned soldier and recruiting him into their own version of the nation.

## LV
So the space where his head used to be is an open invitation. Whoever tells his story next gets to decide what he meant.

## LV
So is he local, Twerp? Not "does he deserve to be." Is he?

## Close dictionary

## Textbox
button: Submit

Your answer…

## If church
goto: to-scene4

## RV
Oh, I think there's still time for us to go in. They'd be okay if we were a little late.

## Button
side: right
goto: scene3b

Go to church.

## Wait for button

## Section to-scene4

## Open page
page: scene4.html
