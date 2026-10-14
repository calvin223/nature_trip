# Wildora Expeditions — website

Small-group, naturalist-led nature trips in the Western Ghats of South India.
Next.js 16 / React 19 / Tailwind v4, exported as a static site and served by GitHub Pages at
`https://vivian4fb.github.io/nature_trip/` (basePath `/nature_trip`).

## Before launch: things only the owners can supply

All contact details live in **`lib/site.ts`**. Nothing else in the code hard-codes them.

| Setting | Now | What to do |
|---|---|---|
| `whatsapp` | `+91 94431 61606` | Owner-supplied. Every WhatsApp button and the enquiry form use it. |
| `social.facebook`, `social.instagram` | `null` | Paste the page URLs. Footer links and the `sameAs` structured data appear automatically. |
| `email` | `null` | Set only when a real inbox exists. The contact page then offers "send by email" as well. |
| `launchDate` | `null` | Optional `YYYY-MM-DD`. Departure dates are generated from whichever is later, today or this date. |

Policy answers on the FAQ are **proposed defaults**: review them in `POLICY_REVIEW.md`.

## How departure dates work

`lib/schedule.ts` computes each trip's next departures at **build time** from its `seasonMonths`
and `departureRule` in `lib/data.ts`, at least `bookingLeadDays` (6 weeks) ahead. The GitHub
workflow rebuilds **every Monday**, so the listed dates never go stale. Override the date for a
test build with `BUILD_DATE=2026-12-01 npm run build`.

## Commands

```bash
npm ci
npm run dev          # http://localhost:3000/nature_trip/
npm run build        # static export to out/ (+ prefetch-file fix for static hosts)
npm run build:maps   # regenerate lib/geo/*.json from Natural Earth (only after editing lib/mapData.ts)
npm run build:camo   # regenerate public/textures/camo.svg
```

Pushing to `main` deploys via `.github/workflows/deploy.yml` (also runs weekly and on demand).

## Where things are

| Path | Holds |
|---|---|
| `lib/data.ts` | Trips, itineraries, seasons, experts, FAQ, guest responsibilities, health & insurance |
| `lib/site.ts` | Contact and social settings, WhatsApp link helpers |
| `lib/schedule.ts` | Departure-date generator |
| `lib/photos.ts`, `public/photos/` | Wildlife photo library (supplied by the Wildora team) |
| `lib/peoplePhotos.ts`, `public/photos/people/CREDITS.md` | Licensed photos of people in the field (CC BY / CC BY-SA, attribution shown on site) |
| `lib/mapData.ts`, `lib/geo/`, `components/TripMap.tsx`, `components/IndiaOverviewMap.tsx` | Maps from Natural Earth public-domain data, India point-of-view boundaries; see `public/maps/LICENCE.md` |
| `DESIGN.md` | The "Canopy" design system: floating 3D forest stage, opening animation, classes |

## Content rules

No hype. No guaranteed sightings (every trip carries the disclaimer). Never invent a review,
credential, statistic, price or contact. British English.
