# 2_Business/Wildora/western-ghats-tours — context

*Updated 2026-10-04. State: READY, NOT DEPLOYED (waiting on Facebook/Instagram URLs)*

## What this is

The Wildora website. Next.js 16 static export to GitHub Pages (`vivian4fb/nature_trip`,
basePath `/nature_trip`). **Child git repo.** No commits are made from Code2 sessions (see the
no-git rule in memory); the owner commits and pushes.

## State

*Measured 2026-10-04.*

- **Redesign done 2026-10-03/04, uncommitted.** It covers the "Canopy" floating-3D forest-camouflage design (copied from the Martin site's stage pattern), the opening canopy-curtain animation, and every point of the owners' brief. `README.md` and `DESIGN.md` describe it.
- Build: **18 pages, `npm run build` passes**. VERIFIED 2026-10-04.
- Headless Edge, 1440 px and 390 px, 16 routes: **0 console errors, 0 failed requests, 0 horizontal overflow**. VERIFIED 2026-10-04.
- Contact runs **WhatsApp only** (+91 94431 61606, owner-supplied). The fake phone `+91 98765 43210` and the placeholder `info@wildoraexpeditions.com` are gone. The enquiry form composes a WhatsApp message, so leads are no longer lost.
- **Removed as fabricated:** six guest reviews, "only N spots left", and unsourced statistics.
- Departure dates are generated at build time (`lib/schedule.ts`); the workflow rebuilds weekly.
- Maps: Natural Earth 5.1.2, India point-of-view boundaries, enforced by `scripts/build-map-data.mjs`.
- People photos: 11 Wikimedia Commons images (CC BY / BY-SA), attribution shown on each tile and on `/credits/`.
- `out/` is 48 MB.
- Next.js 16 static-export prefetch 404s are fixed by `scripts/fix-export-prefetch.mjs`, which is wired into `npm run build`.

## Next

1. Owners send the Facebook/Instagram URLs → set them in `lib/site.ts` → owner commits and pushes to `main`.
2. Owners tick through `POLICY_REVIEW.md`: 12 proposed FAQ policies, plus 5 legal items from the official-rules research (night walks, minimum age, park closures).
