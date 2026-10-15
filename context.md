# 2_Business/Wildora/western-ghats-tours — context

*Updated 2026-10-14, end of session. State: REDESIGNED + MULTILINGUAL STRUCTURE + SEARCH BASICS,
COMMITTED, TEMPORARILY HOSTED at https://calvin223.github.io/nature_trip/ (fork's GitHub Pages).*

## What this is

The Wildora website. Next.js 16 static export for GitHub Pages (basePath `/nature_trip`).
Working copy: the `calvin223/nature_trip` fork, branch `develop`, merged into `main`. Pushing to
`main` runs `.github/workflows/deploy.yml`, which builds and publishes `out/` to the `gh-pages`
branch served by GitHub Pages (enabled on the fork 2026-10-14). The owner asked for this push on
2026-10-14; ask again before further remote changes, and nothing goes to the original
`vivian4fb/nature_trip`. Commits only when asked.

## State

*Measured 2026-10-14.*

- **Stack:** Next.js **16.3.8** (upgraded from 16.0.7 for a critical advisory), React 19,
  Tailwind 4, next-intl 4.14.7. `npm audit --omit=dev`: **0 vulnerabilities**. Six dev-only
  advisories remain (e.g. `sharp` for `npm run build:images`, `braces`); fixing them needs breaking
  upgrades, and they only run locally on your own files.
- **Design:** "Field Notes" (`DESIGN.md`). Header: Trips ▾ · Species · About ▾ · Travel info ▾ ·
  Plan a Trip · 🌐 EN ▾ (language menu, also on phones beside the burger; unpublished languages are
  listed as "coming soon", not links). Footer has a row with every legal page.
- **Custom groups page (redesigned 2026-10-15):** was seven same-shaped text sections; now hero photo,
  six group entries led by the team's field-course photos (schools folded in), the sample day as six slots on a dawn-to-night rail of daylight,
  customise options as ruled rows (logistics merged in), academic options, and one closing
  block holding the health condition (detail stays on Practical Info).
- **Itineraries:** the separate 10-day route page (`/journey/`) was removed; every trip page's
  itinerary is now that scroll story (sticky place photo cross-fading per day, `RouteStory`). Which
  photo goes with which days: `ROUTE` in `lib/routePhotos.ts`. Trips without named places use
  example photos, captioned "Photographed at …". "Scenery along the way" was removed from trip pages
  (it repeated the same photos); `sceneryHighlights` stays in `lib/data.ts` as tripFit evidence.
  Home/About "10-day route" links go to `/trips/western-ghats-endemics/#itinerary`, and the static
  404 forwards old `/journey/` links there (`MOVED` in `app/not-found.tsx`).
- **Languages, step 1:** every page under `app/[locale]/`, only English published (`/nature_trip/en/...`).
  Bare `/nature_trip/` picks the language; the 404 forwards old unprefixed links. Wording in
  `messages/en/*.json`; long-form content in `lib/` behind overlays; legal docs per language in
  `content/legal/`. Guide: `messages/README.md`. Five more languages planned, translated only once
  the English copy is final.
- **Legal pages (drafts, visible "[To be confirmed]" markers):** legal notice, booking conditions,
  package travel information, privacy, cookies, accessibility. Reviewed by 131 agents; 25 confirmed
  problems fixed and re-checked. A lawyer must still review (`SITE.legal.reviewed`).
- **Search basics (this session):** `sitemap.xml` + `robots.txt`; trip search titles and
  descriptions ≤155 characters; keywords tag removed; TouristTrip + BreadcrumbList data on trip
  pages; a crawlable species list on /species/; per-page sharing titles; verification-code slots in
  `lib/site.ts` (`searchVerification`).
- **Conversion bits:** "Ask about this date" on every departure opens the enquiry form with the trip
  and dates filled in; printed itineraries include "You arrange" and Wildora's contact line.
- **Practical info (redesigned 2026-10-15):** four stages along one trail (When you enquire → When you
  book → Before you leave home → On the trip); stage heads stick beside a rail on wide screens. Pace
  scale for the grades, the three booking conditions once, a tickable packing list (ticks not saved),
  one-trip-at-a-time inclusions. Old anchors #health, #difficulty, #packing still land.
- **Photo audit (2026-10-15, second pass):** no photo repeats across home, About and custom groups
  except the Nilgiri flycatcher (only photo of a key endemic). Osprey re-cropped from its 6000 px
  original, langur trimmed (car window frame), Asian openbill removed (tiny original). "GMV
  Photography" (watermark on the saw-scaled viper) is one of the clients: full permission, keep it.
  Owner questions open: painted background on the rock eagle-owl, low-res originals (treepie,
  grassbird, spiny lizard, hornbill, barbet, paradise flycatcher, sloth bear), bay owl's face away.
- **Past field courses (2026-10-15):** the team's own photos from Heber Au Sable Institute courses
  (Bishop Heber College; Sony originals, January 2010 and 2012, in `../Past photos/` with
  "au sable india accomplishments.ppt": Ecology of Indian Tropics for US universities since 1995,
  UK since 2009). Used once each, high quality (WebP 86, up to 2400 px, `public/photos/field/`):
  home section "Long before Wildora" (after the naturalists), the About hero (shola walk; replaced
  the Wikimedia landscape), two photos in the custom groups academic section. Left out on purpose:
  elephant ride (ethics), students on a bus roof (safety), students asleep on a bus. Owner to
  confirm the people shown are happy to be on the site.
- **Photo ownership (2026-10-15):** every flora and fauna photo is the team's own: 87 trace to
  camera originals (Nikon, Sony, Fujifilm, Canon), the rest confirmed by the user (2004 Photoshop
  scans, Picasa edits, the GMV batch, sloth bear, moon moth, treepie). Only the itinerary place
  photos are third-party (Wikimedia, credited).
- **Home hero (2026-10-15):** a young Bengal tiger (`Tiger cub (2).JPG`), crops in
  `scripts/build-images.mjs` (WebP quality 72). The share image is still the lion-tailed macaque.
- **Accessibility & speed pass (2026-10-15):** axe on all 21 pages, phone and desktop: everything
  fixed except the itinerary's faded inactive days (contrast; kept as flair by owner request).
  Lighthouse (phone, gzip): home 95, practical 99, trips 94, trip page 90, species ~87, schools 86,
  about 85; accessibility, best practice and SEO 100. Main fix: hero images go through
  `components/HeroImage.tsx` (a client component), because an eager `<img>` in a server component
  becomes a preload hint in the page's prefetch data, so every page linking to it downloaded it.
  Only basic Latin fonts are preloaded; portrait thumbnails are 480 × 720 (`THUMB_WIDTH`). Left:
  the focus-species carousel loads its four photos full size on phones (part of its cross-fade).
- **Species page:** focus-species carousel (autoplay with pause button; keyboard focus pauses it, mouse hover does not, by owner request), drifting "All" gallery,
  still grids for groups, a collapsed full species list.
- Build: **24 HTML pages + sitemap + robots** (after the route page's removal), type check and lint clean; word-level comparison with
  the pre-migration English shows only intended changes. Headless Edge (1440 px, 390 px touch):
  redirects, menus, dropdowns, carousel, pause, form prefill, print view and client-side navigation
  (0 failed requests) all work. VERIFIED 2026-10-14.

## Decisions made with the owner (don't re-propose)

- **Group sizes stay as they are** (max 10; 12 on the monsoon trip). Declined gap #14, 2026-10-14.
- **No paid SEO tools** (the DataForSEO skill was installed and removed again).
- **Airport-to-airport scope** is the real service, but the owner will supply the wording; don't write
  it yet (it is a marker in the booking conditions §4).
- **Translate later**, after the English copy is final; move to a host with middleware later.

## Known issues and open threads

- **Restart `npm run dev`** before checking anything: the old dev server served a stale stylesheet.
- **Contradictions waiting on the owner:** `guestResponsibilities` and some FAQ answers in
  `lib/data.ts` say guests travel to the start point (airport scope).
- **Design inconsistency:** the focus-species details and the phone menu's section headings use small
  all-caps labels, which `DESIGN.md` otherwise rules out. Owner to choose.
- **Mobile audit (2026-10-15, code and headless Chrome):** no page runs off the right edge at 320, 375 or 390 px
  (15 pages), no undersized tap targets, every hover style gated to real pointers, inputs 16 px.
- **Real-phone checks still to do:** sticky hover, tap feel, notch/home-bar spacing, keyboard over
  the enquiry form (`npm run dev -- -H 0.0.0.0`, open `http://192.168.55.139:3000/nature_trip/` on phones: the Wi-Fi IP,
  not the VMware one Next prints; `allowedDevOrigins` in `next.config.ts` lets the phone load the scripts).
- **Session scratchpad** (backup tarball, English snapshot, headless-Edge check scripts) is temporary
  and will be gone next session.

## Next session, in order

1. **Owner answers** (`CLIENT_QUESTIONS.md`, items 1–15, 33–50): prices, deposit and cancellation,
   business identity, email and reply time, emergency number, airport wording, minimum numbers,
   where three trips go, leaders per trip. Each unlocks a gap in `COMPETITOR_GAPS.md` ("Waiting on
   the owners").
2. **Search Console + Bing** (needs the owner's login): verify with the meta tag (paste codes into
   `SITE.searchVerification`, rebuild), submit `<site>/sitemap.xml`.
3. **Build the gaps the answers unlock**, e.g. prices + single supplement on trip pages and in the
   TouristTrip data, date status + "runs with N", "Led by Dr …" on trips and dates, named lodges,
   a booking/protection box under the dates.
4. **Copy the owners approve:** search phrases in trip intros, 3–5 trip FAQs, place pages
   (Thattekad; Munnar & Eravikulam; Valparai & Anamalai) and month-by-month wildlife notes.
5. **Lawyer review** of the legal drafts; naturalist check of `SPECIES_FACTS_REVIEW.md`; owners tick
   `POLICY_REVIEW.md`.
6. **When the owner says so:** commit, choose the new host/domain (update `SITE_URL` in
   `lib/site.ts`; on a middleware host set `localePrefix: 'as-needed'`), then translations.
