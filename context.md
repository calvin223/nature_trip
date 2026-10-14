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
  Plan a Trip. Footer has a row with every legal page.
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
- **Species page:** focus-species carousel (autoplay with pause button), drifting "All" gallery,
  still grids for groups, a collapsed full species list.
- Build: **25 HTML pages + sitemap + robots**, type check and lint clean; word-level comparison with
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
- **Real-phone checks still to do:** sticky hover, tap feel, notch/home-bar spacing, keyboard over
  the enquiry form (`npm run dev -- -H 0.0.0.0`, open `http://<PC IP>:3000/nature_trip/` on phones).
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
