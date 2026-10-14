# Languages on the Wildora site

The site is built to be published in English, French, German, Spanish, Portuguese (Portugal) and
Polish. Today only English is published; the others are switched on one at a time once translated.

## Where the text lives

| What | Where | Translated how |
| --- | --- | --- |
| Page and interface wording (headings, paragraphs, buttons, menus, page titles) | `messages/en/*.json`, one file per page or area; `common.json` holds the header, footer and shared UI | Copy `messages/en/` to `messages/<locale>/` and translate the values |
| Trips, itineraries, naturalists, species cards, FAQ answers, services | `lib/data.ts` (English source) | Overlay files in `content/<locale>/` (see below) |
| Field-photo notes, photo names | `lib/speciesFacts.json`, `lib/photos.ts` | Overlay files `content/<locale>/speciesFacts.json`, `photos.json` |
| Legal documents (booking conditions, privacy...) | `content/legal/en/*.tsx`, one whole document per file | A translated copy per language, `content/legal/<locale>/`, reviewed by a lawyer; until then English is shown with a notice |

Dates are formatted per language automatically (`lib/schedule.ts`).

## Publishing a new language (e.g. German)

1. **Messages:** copy `messages/en/` to `messages/de/`, translate every value (keep the keys), then
   register it in `messages/index.ts` (`import de from './de'` and add it to `TRANSLATIONS`).
   Anything not yet translated falls back to English, string by string.
2. **Content:** create `content/de/trips.json` etc. and register them in `i18n/content.ts`.
   Each file maps an item's key to only the fields that change, for example:
   ```json
   { "western-ghats-endemics": { "title": "Endemiten der Westghats", "itinerary": [{ "title": "Ankunft in Thattekad" }] } }
   ```
   Keys: trips, experts, species, services by `id`; FAQs by the English `question`;
   guest responsibilities and health & safety items by the English `title`; species facts and
   photos by photo `slug`. `places.json` covers map and landscape text: place photos (caption,
   alt) by photo slug, map stops and gateways (name, label, stay) by stop id, reference-city labels
   (name) by `city:<English name>` (e.g. `"city:Kochi"`), and, by trip id, a trip map's
   `regionLabel` and the India overview map's `label` (both two-line labels: an array of two strings); where a
   photo slug and a stop id are the same, one entry holds both.
   Map label positions are measured from the English text by `npm run build:maps`, so check long
   translations on the maps.
3. **Legal:** add translated documents under `content/legal/de/` and register them in
   `content/legal/index.ts`.
4. **Switch it on:** add `'de'` to `ENABLED_LOCALES` in `i18n/locales.ts` and rebuild. Pages appear
   under `/de/`, the language switcher appears in the footer and menu, and search engines get
   `hreflang` links between the language versions.

## Rules for code (for developers)

- **Links:** import `Link`, `usePathname` and `useRouter` from `@/i18n/navigation`, never from
  `next/link` / `next/navigation`. `href="/trips/"` renders as `/en/trips/`.
- **Pages** are `async`, take `params: Promise<{ locale: Locale }>`, call `setRequestLocale(locale)`
  first, and read text with `const t = await getTranslations({ locale, namespace: 'trips' })`.
  Metadata comes from `generateMetadata` with the same `getTranslations` and
  `alternates: alternates(locale, '/trips/')` from `@/i18n/metadata`.
- **Synchronous server components** use `useTranslations('namespace')`.
- **Client components** (`'use client'`) use `useTranslations` too, but only `common` reaches the
  browser by default: a page wraps its client components in
  `<ClientMessages namespaces={['contact']}>` (`@/i18n/ClientMessages`).
- **Plain functions** (outside React) use `createTranslator({ locale, messages: loadMessages(locale), namespace })`
  from `next-intl`, as `describeDepartureRule()` in `lib/schedule.ts` does.
- **Content** comes from `getContent(locale)` (`@/lib/content`), not from the arrays in `lib/data.ts`;
  photo names from `photoName(photo, locale)`, species notes from `factsFor(slug, locale)`.
- **Inline markup** in a sentence (a link, bold, a highlighted word) uses tags in the message and
  `t.rich`: `"Read the <link>booking conditions</link>."` with
  `t.rich('key', { link: (chunks) => <Link href="/terms/">{chunks}</Link> })`.
- **Message syntax** is ICU: `{name}` inserts a value, `{count, plural, one {# photo} other {# photos}}`
  handles plurals (Polish needs `few` and `many` too). A literal `{`, `}` or `<` must be quoted
  (`'{'`), and an apostrophe directly before `{` starts a quote, so write `’` there.
- **Search titles** for trips live in `tripDetail.seo.<trip id>` (`title`, `description` under 155
  characters); a trip without an entry falls back to its own title. Translate them like any other
  message: they are what search results show.
- Every key is type-checked against `messages/en/`: a missing or misspelt key fails `npx tsc`.

## Notes for translators

- `{trip}` is filled with a full trip title, and the titles differ in gender and number
  ("Western Ghats Endemics Expedition", "Himalaya Birds & Mountain Wildlife"). Don't put an article
  or case ending straight before it; use an apposition: « le voyage « {trip} » », „die Reise
  „{trip}““, „wyprawa „{trip}”“.
- The brand name "Wildora Expeditions" (and "Wildora") is never translated.
