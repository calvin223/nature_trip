# Wildora "Field Notes" design system

Light and editorial: pale shola-lichen paper, forest ink, one shola-green action colour and a
little hornbill gold. Photographs carry the mood; the chrome stays quiet. Chosen on 2026-10-14
from three samples (`../design-samples/`): Sample A's look, Sample B's full-bleed hero and route
story, Sample C's species index. Second pass the same day adapted Apple's sub-nav and type
discipline and Airbnb's underline tabs, ink-star reviews and photo-first lists
(`../design-samples/references/`), and removed the generic "generated site" tells listed below.
A third pass tightened the space between sections (`.wd-section`: 1.5–2.5rem each side), made the
header solid once the page scrolls, moved the whole site to one typeface and removed repeated
information. A fourth pass (same day) grouped the header into dropdowns, gave the footer a legal
row, rebuilt the species page around a focus-species carousel and a drifting gallery, and tuned
the site for phones (safe areas, tap feedback, no sticky hover).

## Motion budget

Nothing moves on its own except: the home hero photo settling in on load (1.2 s, once per visit);
the species page's "All" gallery, whose columns drift slowly (other groups sit still, and hover does
not stop it); and the focus-species carousel, which advances every 5 s (pausable with its button,
by hover or focus; no autoplay under reduced motion). Sections do not fade in on scroll, and page
heads do not animate on navigation.

- **Curves** (tokens in `app/globals.css`): `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` for
  enter, exit and press; `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)` for movement on screen;
  `--ease-drawer` `cubic-bezier(0.32, 0.72, 0, 1)` for gesture follow-through. Never `ease-in`.
- **Budgets:** press 160 ms (`scale(0.97)`; gallery and species tiles `0.98`), hover colour 200 ms,
  photo hover zoom 300 ms at 2 %, nav underline 200 ms, accordions 250 ms (height + fade),
  messages after an action 200 ms (`.wd-appear`, `@starting-style`), mobile menu 200 ms in / 150 ms
  out (menu icon turns with it), header dropdowns 160 ms in / 120 ms out, filter-tab underline
  slides 260 ms (CSS transform), species-group switch fades the new group in 220 ms while the page
  jumps back to the tabs instantly, focus-species details cross-fade 300 ms and photos 450 ms,
  lightbox captions fade in 200 ms. Springs have no bounce: species re-flow 0.35.
- **Lightbox:** a swipe follows through on the drawer curve (300 ms); arrow keys and buttons change
  photo instantly, because keyboard actions repeat too often to animate.
- **Longer by design:** the itinerary photo cross-fade (600 ms) and the route map drawing itself
  once in view are storytelling, not controls.
- Hover effects run only for a real pointer (`@media (hover: hover) and (pointer: fine)`; Tailwind's
  `hover:` already checks `hover: hover`).
- **Reduced motion is gentler, not zero:** fades stay, movement goes (no slide, zoom or height
  animation). `prefers-reduced-transparency` and `prefers-contrast` are honoured too.

## Not on this site

These read as template defaults, so they are gone and should stay gone:

- Pill-shaped tags and chips. Facts such as duration or grade are plain text (`.chip` is now just
  a text style); filters are underline tabs (`FilterTabs`); in-page links are the sticky sub-nav
  (`PageNav`). Pill shapes are kept only for buttons.
- Small all-caps "eyebrow" labels above headings, and all-caps labels generally (the wordmark is
  the one exception). Known deviation, owner to decide: the focus-species details and the phone
  menu's section headings use small all-caps labels (`.focus__tags`, `.focus__label`,
  `.mobile-menu__heading`).
- Arrows appended to links (`.link-arrow` is an underlined link, despite the name).
- Icons in tinted circles, ✓/✕ glyphs as icons, glowing halos, "01 / 02" numbering on things that
  are not a sequence.
- Grids of identical text-only cards. Text lists are ruled rows (term left, detail right) or
  columns with a rule above; cards remain only where a photo leads.
- Centred section heads: heads sit left, aligned with their content.
- Repeated information. Each fact has one home and other pages link to it: health and insurance
  detail lives on Practical Info (trip pages keep the one-line booking condition), start and end
  points live in a trip's "At a glance", seasons on When to Visit. One floating button (WhatsApp);
  the enquiry form is "Plan a Trip" in the header.

## Files

| File | Role |
|---|---|
| `app/globals.css` | Tokens and every shared class. Some names are historical (`glass`, `card-3d`, `chip`, `link-arrow`) |
| `components/HomeHero.tsx` | Full-bleed hero; art-directed crops (16:9 desktop, 9:16 phone) |
| `components/SpeciesIndex.tsx` | Home species index: underline tabs, Motion layout spring, lightbox with species notes |
| `components/FilterTabs.tsx` | Underline filter tabs; one bar slides between tabs (CSS transform, works inside the sticky bar) |
| `components/FloatingGallery.tsx` | Species gallery in packed columns; drifts on "All", still masonry otherwise (adapted from Originkit) |
| `components/BlurCarousel.tsx` | Focus-species photo carousel: edge blur on hover, press tilt, swipe (adapted from Originkit); autoplay is the active dot's fill in `SpeciesExplorer` |
| `components/PageNav.tsx` | Sticky in-page nav under the main bar (Practical info, Trips) |
| `components/SpeciesCaption.tsx` | Lightbox notes panel: Latin name, description, size, IUCN status, range |
| `lib/speciesFacts.json` | Notes for every field photo; sources and doubts in `SPECIES_FACTS_REVIEW.md` |
| `components/GuestReviews.tsx` | "What our guests say": hidden on the live site until `reviews` in `lib/data.ts` has real entries |
| `components/SeasonLegend.tsx` | Key for the month charts (green runs, grey no departures) |
| `components/PhotoStrip.tsx` | "What you might see" strip on trip pages (Embla) |
| `lib/placePhotos.ts`, `lib/routePhotos.ts` | Credited Wikimedia landscape photos and which days of each trip's itinerary show them ("Photographed at …" when it is an example from elsewhere) |
| `components/FloatingCTA.tsx` | The one floating button: WhatsApp |
| `public/photos/field/`, home "Long before Wildora", Custom groups | The team's own photos from past field courses: a large lead photo beside four smaller ones, captions with month and year; built from camera originals by `scripts/build-images.mjs` at quality 86 |
| `components/HeroImage.tsx` | Every eagerly loaded hero `<img>` goes through this client component: in a server component React turns it into a preload hint that every page linking to it would download |
| `app/[locale]/practical/page.tsx` | Practical info as a trail of four stages in the order a guest acts (`.trail`): stage heads stick beside a rail on wide screens; pace scale, booking conditions, tickable packing list (`.pack-item`), one-at-a-time inclusions (`details name`) |
| `app/[locale]/schools/page.tsx` | Custom groups: group entries led by the team's field-course photos (thumbnail beside the text on phones), the sample day as six slots hung off a thin rail of daylight, dawn to after dark (`.day-band`, the page's one bold element: down the left on phones, across the top on wide screens), customise options as ruled rows whose items flow as one line (`.opt-list`), one closing block with the health condition |
| `app/[locale]/trips/RouteStory.tsx` | Each trip's itinerary: sticky place photo cross-fades as the days scroll past; photos per day in `lib/routePhotos.ts` |
| `app/[locale]/species/SpeciesExplorer.tsx` | Species page tabs + gallery; lightbox is yet-another-react-lightbox |
| `app/[locale]/species/page.tsx` | Also the collapsed species list under the gallery (`.species-index`, a `.wd-acc` accordion): every photo's notes as plain text for search engines |
| `app/[locale]/trips/[id]/page.tsx` | Trip page; each departure row ends with a quiet "Ask about this date" link (opens the form pre-filled), the panel beside keeps the one green WhatsApp button |
| `components/Navigation.tsx` | Solid paper bar; clear with white text over the home hero until scrolled. Trips ▾ · Species · About ▾ · Travel info ▾ from 1024 px (dropdowns: page names only, left-aligned), full-screen menu below |
| `app/icon.svg`, `app/favicon.ico` | Browser tab icon: the header's leaf (`components/LeafMark.tsx`); the .ico is the same leaf at 16, 32 and 48 px for browsers without SVG icons |
| `components/Footer.tsx` | Link columns, WhatsApp as a quiet link (one green button per screen), bottom row with every legal page; text uses `--wd-muted` on the darker footer for contrast |
| `components/LegalPage.tsx` | Legal document layout: draft notice, contents list, section cards, last updated, see also |
| `components/LanguageSwitcher.tsx` | Footer and menu language list; renders only once a second language is published |
| `components/map/shared.tsx` | Map styles. Maps size themselves to the screen height; route maps put the stop list beside the map on wide screens |
| `scripts/build-images.mjs` | `npm run build:images`: hero crops from the originals + `lib/placeholders.json` |
| `lib/placeholders.ts` | Thumbhash blur behind each photo until it loads (`blurStyle`, `blurUrl`) |

## Tokens

| Token | Value | Use |
|---|---|---|
| `--wd-night` | `#f1f2e9` | Page background (name kept from the dark theme) |
| `--wd-deep` | `#e6e8dc` | Sunken sections, image placeholders |
| `--wd-canopy` | `#dcdfcf` | "No departures" months in the season charts |
| `--wd-surface` | `#fafaf4` | Cards (`.glass`) |
| `--wd-ink` / `--wd-muted` / `--wd-faint` | `#1b211b` / `#4c554a` / `#646d61` | Text, ≥4.7:1 on paper; `--wd-faint` is only 4.3:1 on `--wd-deep`, so use `--wd-muted` there |
| `--wd-emerald` / `--wd-forest` | `#2c5e3f` / `#1f4630` | Primary button, hover, "trip runs" months |
| `--wd-lime` | `#2c5e3f` | Accent text and active states (green on light) |
| `--wd-sun` | `#8f6112` | Hornbill gold as text ("Endemic", Moderate grade); `--wd-sun-soft` `#e9b54a` for fills |
| `--wd-trogon` | `#b03e28` | Errors, "Required", Challenging grade |

Type: one family, Hanken Grotesk (variable weight, with real italics for Latin names), chosen on
2026-10-14 from three directions (`../design-samples/font-preview.html`). Headings are bold and tight:
display −0.04em, section −0.035em, card −0.015em, body 0. Labels are sentence case.

Maps (`.wdm`) keep the original dark palette as a deliberate inset: the dark tokens are
re-declared on `.wdm`, so the page around them stays light.

## Rules

- Caption photos with species, Latin name and where on the route. Tag "Endemic" only for
  species found nowhere outside the Western Ghats.
- Reviews only from real guests, with permission, word for word.
- One primary action per block. No carousels on the home page; the strip lives on trip pages.
- New photos: add the file under `public/photos/`, register it in `lib/photos.ts`, add its notes
  to `lib/speciesFacts.json`, then run `npm run build:images` to refresh the placeholders.
