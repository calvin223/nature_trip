# Wildora "Canopy" design system

Dark, vibrant forest-camouflage world that floats in 3D. A fixed perspective stage
(`components/ForestStage.tsx`) sits behind every page; content blocks drift at their own depth
as you scroll; cards tilt towards the pointer. Pattern adapted from the Martin Richardson site.
All motion stops under `prefers-reduced-motion`.

## Files

| File | Role |
|---|---|
| `app/globals.css` | Tokens, every shared class below, print and reduced-motion rules |
| `components/ForestStage.tsx` | Fixed background: camo tile, sun shafts, swaying leaves, fireflies |
| `components/ForestFX.tsx` | Motion controller: scroll/pointer vars, `.reveal`, floaters, `.card-3d` tilt |
| `components/IntroCurtain.tsx` | Opening animation (canopy doors part); `INTRO_SCRIPT` runs in `<head>` |
| `scripts/gen-camo.mjs` | Regenerates `public/textures/camo.svg` |
| `lib/site.ts` | Contact config: WhatsApp, email, socials, launch date. **Never hard-code contact details.** |

## Page structure (follow it: the float effect keys off it)

```tsx
<>
  <section className="wd-page-head">          {/* first block on inner pages: clears the fixed nav */}
    <div className="wd-wrap">...</div>
  </section>
  <section className="wd-section">              {/* every later block */}
    <div className="wd-wrap">
      <div className="wd-head reveal">            {/* centred section heading */}
        <p className="eyebrow">Small label</p>
        <h2 className="h-section">Heading</h2>
        <p>Optional intro line.</p>
      </div>
      <div className="grid ... float-grid">        {/* children float individually */}
        <article className="glass glass-pad card-3d reveal">...</article>
      </div>
    </div>
  </section>
</>
```

Direct children of `.wd-section > .wd-wrap`, children of `.float-grid`, and `[data-float]`
elements float with scroll. Put `data-no-float` on anything that must stay put (forms, maps,
sticky elements).

## Tokens (Tailwind classes exist for each: `bg-wd-*`, `text-wd-*`, `border-wd-*`)

`wd-night #07140d` page · `wd-deep #0a1c12` · `wd-canopy #0d2618` · `wd-forest #134e2e` ·
`wd-emerald #1f7a45` · `wd-fern #3fa34d` · `wd-lime #9ad14b` (signature) · `wd-leaf #c8e86b` ·
`wd-sun #f2b134` (primary CTA) · `wd-trogon #e2553b` (alerts) · `wd-sand #efe6c8` ·
text: `wd-ink #eaf3e3` body, `wd-muted #b9c9b0` secondary, `wd-faint #8fa587` tertiary.
Never use light page backgrounds (`bg-white`, `bg-gray-50`, `bg-[#f3eedf]`) or `text-gray-*`.

## Classes

- Type: `h-display` (hero), `h-section`, `h-card`, `eyebrow`, `lede`, `accent-text` (lime→gold gradient text), `text-glow` (text over photos). h1–h3 use Fraunces automatically.
- Surfaces: `glass` (+ `glass-strong` for dense text), `glass-pad`, `divider`, `card-3d` (tilt + glare; needs `position:relative`, which `glass` gives), `photo-tile` (+ `photo-tile__caption`, `photo-tile--captioned`).
- Actions: `btn` + `btn-primary` | `btn-lime` | `btn-ghost` | `btn-wa`, `btn-lg`; `link-arrow`; `chip`, `chip-sun`, `chip-trogon`.
- Notes: `wd-note` for disclaimers (the no-guaranteed-sightings footnote).
- Forms: `wd-input`, `wd-label`. FAQ: `<details className="wd-acc"><summary>Q</summary><div>A</div></details>`.
- Motion: `reveal` (fade-up on enter; stagger with `style={{'--d': '120ms'}}`).
- Print: `no-print` hides an element when a trip page is printed as an itinerary.

## Rules

- Images: always `img(path)` from `lib/photos.ts` (adds the `/nature_trip` basePath). Links: `next/link` with trailing slash (`/trips/`).
- WhatsApp: `waLink(message)` from `lib/site.ts`. Email and social links render only when set in `SITE`.
- British English. No hype, no guaranteed sightings, no invented reviews, credentials or numbers.
