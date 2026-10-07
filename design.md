# Design — InfoDaily

The design system for the whole site, and the reasons behind it. A page is
changed to fit this file; when the system has to grow, this file is changed first.

The brief was "a site that feels like it cost $10,000". The owner's own
reference for that is two sites he built, FORGE and FORNACE: both dark and
cinematic, both carried by very large display type, few elements, lots of air
and one strong accent. Those are a gym and a restaurant. This is a reading
publication, so the system keeps what actually makes those sites feel expensive
— scale, restraint, one accent — and leaves the darkness to the front door.

## Genre
editorial

## Surfaces
Two, and the split is deliberate.

- **Stage** — dark. The home page only. A front door: one lead story at
  cinematic scale, then the index. Independent of the reader's theme choice.
- **Paper** — light by default, and follows the reader's theme picker. Every
  reading and browsing page. Long guides read better on paper; a
  thousand-word article on near-black is tiring.

A page opts into the stage with `data-surface="stage"` plus the `dark` class
on its root. The stage block in `globals.css` re-declares the same token names
the site already uses (`--bg-base`, `--text-base`, `--accent` …), so components
inside it go dark without being edited.

## Macrostructure family
- Front page: **Marquee Hero.** The lead story *is* the page above the fold:
  full-bleed image, the headline at display scale, nothing competing with it.
  The lead is the post with `featured: true` in its frontmatter (newest wins
  if several), otherwise the newest post. Move that one line to change it.
  Below the fold the page becomes an index: Latest (one large, a list beside
  it), Watch (review videos), then one band per section, each band a
  different shape so the page does not read as one rail repeated.
- Reading pages: **Long Document.** A single reading column at a measured line
  length, serif text, the headline at display scale. The left margin holds
  the table of contents; above 1400px the right margin holds one ad slot.
  In-article and end-of-article ad slots stay in the reading column.
- Browsing pages (articles, category, authors, videos, games): **Index-First.**
  Dense and quiet. Type and thumbnails, no decoration.

## Theme
custom (tuned) — anchored on the petrol accent the site already runs on.

| Token | Paper | Stage |
| --- | --- | --- |
| `--bg-base`   | `#f8f7f4` | `#060f11` |
| `--bg-card`   | `#ffffff` | `#0e191b` |
| `--text-base` | `#0d1117` | `#f1f0eb` |
| `--text-muted`| `#5a6270` | `#a9b3b5` |
| `--border`    | `#e0ddd7` | `#253032` |
| `--accent`    | `#007883` (accent-600) | `#4ab5c0` (accent-400) |

Stage colours are generated in OKLCH at hue 210, one step from the accent hue,
so the dark is petrol-tinted rather than generic black. The reader's Dark
theme uses the stage palette too, so going from the front page into a guide
in dark mode does not switch to a different dark.

Measured contrast on the stage: ink 16.98 · muted 9.04 · accent 7.99.

Accent is ≤ 5 % of any viewport. It marks things you can act on, and the
current position. It is never a background wash.

## Typography
- **Display:** Archivo, weight 800, `font-stretch: 75%`, tracking −0.02em.
  Archivo is variable on width as well as weight, so one family carries both
  the condensed headlines and the normal-width interface. A sharp grotesk is
  the right voice for a technology publication.
- **Reading text:** Source Serif 4, weight 400, optical size on. Article body
  only, 1.125rem, line-height 1.7, measure 66ch.
- **Interface:** Archivo at normal width, 400–600.
- **No italic headings.** Both reference sites put an italic accent word inside
  a heading ("born from *fire*", "the *will.*"). That is one of the most
  recognisable generated-design tells, so emphasis is carried by weight and
  colour instead.

The reader's font picker still offers sans or serif for body text; it now
chooses between Archivo and Source Serif 4.

Display scale:
- `.type-display-hero` clamp(4.5rem, 13vw, 11.5rem) · line-height 0.86 — front page lead only, short kicker (16 characters or fewer)
- `--text-display`   clamp(3rem, 7.5vw, 7rem) · line-height 0.92
- `--text-display-s` clamp(2.25rem, 5vw, 4.25rem) · line-height 0.95
- `--text-headline`  clamp(1.625rem, 3vw, 2.25rem) · line-height 1.08

## Labels
Small caps in the interface face, 0.6875rem, tracking 0.16em, weight 600.
Used for category and date only — never as section numbering, never more than
one per block.

## Motion
The owner asked for a front page with plenty of motion, imagery and video —
it is a technology site. Motion lives on the front page; reading pages stay
still apart from hover feedback.

- Curves from the animate skill: `--ease-out` cubic-bezier(0.23, 1, 0.32, 1),
  `--ease-in-out` cubic-bezier(0.77, 0, 0.175, 1), `--ease-drawer`
  cubic-bezier(0.32, 0.72, 0, 1).
- Front page, once per visit: the lead photo settles from 108 % over 2.4 s
  (transform only — it is the LCP element, so it never starts transparent);
  the kicker rises out of a mask, then deck and button, 80 ms apart.
- Scroll-linked parallax on the lead photo via a CSS scroll timeline — off
  the main thread, no JS, simply absent in browsers without support.
- Bands below the fold reveal once as they enter (opacity + 32 px rise,
  800 ms, 60–70 ms stagger). Hidden only by JS and only below the fold, so
  nothing is lost without JS and nothing on the first screen flashes.
- Card image hover: scale 1.04 over 700 ms, only on fine pointers.
- Buttons: press to 0.97 over 150 ms. Menu drawer: 500 ms on the drawer curve.
- Reduced motion: every transform off, opacity fades of 200 ms or less stay.

## Video
The Watch band on the front page and the /videos page play other channels'
videos, credited by name on every item. The front page loads thumbnails only;
the YouTube player (youtube-nocookie) is created on click. Shorts are
filtered out — vertical video does not sit in a 16:9 frame.

## Navigation — N9, edge-aligned
Wordmark left; Technology, Gaming, Articles; search; menu. That is all. The
font picker, the theme picker, About, Videos, Games and Editorial move into the
menu drawer. The header previously carried about twelve controls and a second
row of category tabs, which is the densest thing on the page and the least
premium.

On the stage the header is transparent over the lead image.

## Footer — Ft5, statement
One line of what the site is, then legal links. No four-column link farm.

## Cards
No rounded-card-with-shadow, no pill badges sitting on the photo, no repeated
author-and-"Read →" footer on every card. A card is the image, a small-caps
label, the headline in the display face, and a date. The whole card is the
link.

## What every page must share
- The wordmark.
- Archivo display + Source Serif 4 reading text.
- The petrol accent and its ≤ 5 % rule.
- Small-caps label style.
- Card anatomy.

## What pages may differ on
- Surface: only the front page uses the stage.
- Macrostructure, within the family above.
