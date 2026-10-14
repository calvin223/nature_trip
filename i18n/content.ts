import { deepMerge } from './merge';
import type { Locale } from './locales';

/* Long-form content (trips, FAQ, species notes...) stays in its English source modules in lib/.
   A translation is an overlay: content/<locale>/<set>.json maps each item's key to the fields that
   differ, and anything left out stays English. Register a locale's files here when they exist:

     import deTrips from '@/content/de/trips.json';
     const OVERLAYS = { de: { trips: deTrips } };

   See messages/README.md for which key each set uses. */
export type ContentSet =
  | 'trips'
  | 'experts'
  | 'species'
  | 'services'
  | 'faqs'
  | 'guestResponsibilities'
  | 'healthAndSafety'
  | 'speciesFacts'
  | 'photos'
  | 'places';

type Overlay = Record<string, unknown>;
const OVERLAYS: Partial<Record<Locale, Partial<Record<ContentSet, Overlay>>>> = {};

/** `items` in `locale`: each item merged with its overlay entry (found by `key`), if any. */
export function localize<T>(locale: Locale, set: ContentSet, items: readonly T[], key: (item: T) => string): T[] {
  const overlay = OVERLAYS[locale]?.[set];
  if (!overlay) return items as T[];
  return items.map((item) => deepMerge(item, overlay[key(item)] as never));
}

/** One item's overlay (the fields translated for `key`), for content read a field at a time,
    e.g. a photo's name: `overlayEntry(locale, 'photos', p.slug)?.name ?? p.name`. */
export function overlayEntry<T = Record<string, unknown>>(locale: Locale, set: ContentSet, key: string): Partial<T> | undefined {
  return OVERLAYS[locale]?.[set]?.[key] as Partial<T> | undefined;
}
