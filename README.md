# Wildora Expeditions — website

Small-group, naturalist-led nature trips in the Western Ghats of South India, Central India and the
Himalaya. Next.js 16 / React 19 / Tailwind v4, exported as a static site for GitHub Pages
(basePath `/nature_trip`). The working repository is the `calvin223/nature_trip` fork, branch
`develop`. It is **temporarily hosted on the fork's GitHub Pages** at
https://calvin223.github.io/nature_trip/ (`SITE_URL` in `lib/site.ts`) until the new domain or host
is decided; pushing to `main` redeploys.

## Languages

The site is built for English plus French, German, Spanish, Portuguese (Portugal) and Polish
(next-intl). **Only English is published today**, so every page is under `/nature_trip/en/`; the bare
`/nature_trip/` sends visitors to their language, and the 404 page forwards old links without `/en/`.
Page wording lives in `messages/en/*.json`, never in components. How the text is organised and how to
publish a translation: **`messages/README.md`**. On a host with middleware, set
`localePrefix: 'as-needed'` in `i18n/routing.ts` so English drops the `/en/` prefix.

## Before launch: things only the owners can supply

All contact details live in **`lib/site.ts`**. Nothing else in the code hard-codes them.

| Setting | Now | What to do |
|---|---|---|
| `whatsapp` | `+91 94431 61606` | Owner-supplied. Every WhatsApp button and the enquiry form use it. |
| `social.facebook`, `social.instagram` | `null` | Paste the page URLs. Footer links and the `sameAs` structured data appear automatically. |
| `email` | `null` | Set only when a real inbox exists. The contact page then offers "send by email" as well. |
| `formEndpoint` | `null` | A form service URL (https only). Until set, the enquiry form writes a WhatsApp message. |
| `legal` | placeholders | Company, registration, money-protection and privacy-contact details for the six legal pages (`/legal/`, `/terms/`, `/package-travel/`, `/privacy/`, `/cookies/`, `/accessibility/`). Pages show a draft banner until a lawyer has reviewed them and `legal.reviewed` is `true`. |
| `launchDate` | `null` | Optional `YYYY-MM-DD`. Departure dates are generated from whichever is later, today or this date. |
| `searchVerification` | `null` / `null` | Google Search Console and Bing Webmaster Tools "HTML tag" codes. Once set and rebuilt, verify, then submit `sitemap.xml` (generated at build from every page). |

Open questions for the client are tracked in **`CLIENT_QUESTIONS.md`**. Policy answers on the FAQ are
**proposed defaults**: review them in `POLICY_REVIEW.md`. Species notes need a naturalist's check:
`SPECIES_FACTS_REVIEW.md`.

## How departure dates work

`lib/schedule.ts` computes each trip's next departures at **build time** from its `seasonMonths`
and `departureRule` in `lib/data.ts`, at least `bookingLeadDays` (6 weeks) ahead. The GitHub
workflow rebuilds **every Monday**, so the listed dates never go stale. Override the date for a
test build with `BUILD_DATE=2026-12-01 npm run build`.

## Commands

```bash
npm ci
npm run dev           # http://localhost:3000/nature_trip/ (redirects to /nature_trip/en/)
npm run build         # static export to out/ (+ prefetch-file fix for static hosts)
npm run build:images  # home hero crops from the originals + blur placeholders for every photo
npm run build:maps    # regenerate lib/geo/*.json from Natural Earth (only after editing lib/mapData.ts)
```

Pushing to `main` deploys via `.github/workflows/deploy.yml` (also runs weekly and on demand).

## Where things are

| Path | Holds |
|---|---|
| `app/[locale]/` | Every page, once per published language; `app/page.tsx` is the language picker, `app/not-found.tsx` the static 404 |
| `components/SiteShell.tsx` | The document around every page: header, footer, WhatsApp button, business structured data |
| `app/sitemap.ts`, `app/robots.ts` | `sitemap.xml` (finds every page under `app/[locale]` automatically) and `robots.txt` |
| `messages/en/*.json`, `messages/README.md` | All page wording (one file per page or area; `common.json` = header, footer, shared UI) and the translation guide |
| `i18n/` | Language list (`locales.ts`), routing, metadata helpers, content overlays for translated trips/FAQ/species |
| `lib/content.ts` | `getContent(locale)`: trips, experts, FAQ etc. in one language (pages read content through this) |
| `content/legal/en/*.tsx`, `components/LegalPage.tsx` | The six legal documents (drafts) and their page layout |
| `lib/data.ts` | Trips, itineraries, seasons, experts, FAQ, guest responsibilities, health & insurance, guest reviews (empty until real ones exist) |
| `lib/site.ts` | Contact, form, legal and social settings; WhatsApp link helpers |
| `lib/schedule.ts` | Departure-date generator |
| `lib/photos.ts`, `public/photos/` | Wildlife photo library (supplied by the Wildora team) |
| `lib/speciesFacts.json`, `lib/speciesFacts.ts` | Notes shown when a photo opens full screen; sources in `SPECIES_FACTS_REVIEW.md` |
| `lib/placePhotos.ts`, `public/photos/places/` | Landscape photos from Wikimedia Commons (CC0 / CC BY / CC BY-SA), credited on each photo and on `/credits/` |
| `lib/routePhotos.ts` | Which photo goes with which days of each trip page's itinerary |
| `lib/placeholders.json` | Blur placeholders, generated by `npm run build:images` |
| `lib/mapData.ts`, `lib/geo/`, `components/TripMap.tsx`, `components/IndiaOverviewMap.tsx` | Maps from Natural Earth public-domain data, India point-of-view boundaries; see `public/maps/LICENCE.md` |
| `DESIGN.md` | The "Field Notes" design system: tokens, type, motion budget, what not to use |

## Content rules

- No hype. No guaranteed sightings: the disclaimer sits next to species promises (each trip page,
  the species gallery, About) and in the footer.
- Never invent a review, credential, statistic, price or contact. Reviews only from real guests,
  with permission, word for word.
- Each fact has one home page; other pages link to it rather than repeat it (for example, health
  and insurance detail lives on Practical Info; trip pages keep only the one-line booking condition).
- British English.
- New or changed wording goes into `messages/en/*.json` (type-checked keys), not into components.
  Long-form trip, FAQ and species content stays in `lib/`.
