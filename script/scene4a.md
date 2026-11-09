# Scene 4a — What answer? (the headless statue behind the church)

Same commands as `scene3-dialogue.md`, plus:
- `## Statue flash`: flashes the statue photo for an instant, plays the horror clip full screen, then shows the photo.
- `## Reveal monument`: zooms out from the soldier to the whole monument.
- `## Dictionary add` (setting `word`): adds a page + tab to the dictionary and pokes the page corner up.
- `## Wait for dictionary`: waits until Twerp opens the dictionary (bottom-right page corner).
- `## Wait for page` (setting `word`): waits until the dictionary is open on that word ("flip the page").
- `## Close dictionary`: closes the dictionary straight away.

`## Settings`:
- `statue_image`: the photo. It starts zoomed in by `zoom`, centred on `focus_x` / `focus_y`
  (percent of the photo), and `## Reveal monument` zooms out to show the whole thing.
- `horror_clip`: the decapitation clip (MP4). `flash_ms`: how long the first flash of the photo lasts.

Change requests for Claude:
-

---

## Settings
statue_image: assets/scene4a/statue.jpg
zoom: 6.5
focus_x: 49
focus_y: 32.5
horror_clip: assets/scene4a/horror-clip.mp4
flash_ms: 250

## Section scene4a

## Statue flash

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
Lived here {years since 1929-06-01} years.

## RV
What.

## LV
He has lived here for {years since 1929-06-01} years, since the first of June 1929.

## RV
'He' doesn't live here and can't be 'local'

## LV
I disagree! He is the very definition.

## RV
Oh shut up let's join them we still have time –

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
- What is going on what is that statue where's it's head? -> what

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

## RV
Why do you keep calling the statue a 'he'. Its a statue. Stop trying to personify things and history into people. *People* have character. *People* have will and agency. *People* feel love and pain and joy. Don't subjugate *people* to the fake character and will and agency and love and pain and joy of an old piece of rock. Nonetheless an old nazi piece of rock.

**It** is not a local: Ben and David are locals.

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
Okay, well you guys don't have to agree, but here me out.

## Go to joint

## Section joint

<!-- Your note: REVISE THIS — the second paragraph below ("A monument, a material erection...") -->
## LV
The statue is more local than any person can be. No person can "belong to" a physical space more than an object. A person transcends the material. We don't have to agree on exactly how they transcend, whether there's something spiritual going on or its just an emergent property or whatever, the point is they do.

A monument, a material erection has no 'heritage' in the traditional sense.

## Dictionary add
word: heritage

## LV
Flip the page, please

## Wait for page
word: heritage

## LV
thank you. But the an object has a creator and is constituted by material with an origin

## End
