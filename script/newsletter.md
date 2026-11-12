# Newsletter pop-up (every page, once per browser tab)

A fake "join our newsletter!" pop-up. It appears after `delay_s` seconds on the site, or the first time the reader
clicks anything (that first click is swallowed by the pop-up, like a real one). It only ever appears once per tab.
It doubles as the content warning, and closing it (either button) hands the reader their dictionary and sticker
book: both page corners pop up in the bottom left with a little label each.

Nothing typed into the email box is saved or sent anywhere.

- `## Popup`: `delay_s`, `title`, `email_placeholder`, `button` (sign up), `decline` (the "no thanks" link),
  `small_print` (tiny text at the bottom). The body is the message; each line keeps its own line break.
- `## Labels`: the little labels that appear next to the two corners afterwards. `dictionary`, `stickers`,
  `show_s` (how long they stay).

Change requests for Claude:
-

---

## Popup
delay_s: 3
title: ✉️ WAIT!! Before you go exploring… 🌸
email_placeholder: your email
button: Sign me up!
decline: no thanks, I hate free things
small_print:

**Join my newsletter!**

Quick heads up first, babes, because I care about you:

🔊 This site **plays audio**. Turn your sound on (or off, I'm not your mum).
😱 There could be **jumpscares**. Sorry in advance.
🩸 There could be **blood**. Not a lot, overall. But… a lot at once.

🎁 **FREE GIFT!** Everyone who signs up gets a **FREE pocket dictionary** AND a **FREE sticker book**! Every source you find on your travels earns you a sticker. Look in the bottom-left corner, they're already there for you!! 👇

## Labels
dictionary: your free dictionary
stickers: your free sticker book
show_s: 6
