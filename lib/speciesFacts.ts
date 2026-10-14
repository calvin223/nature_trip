import data from './speciesFacts.json';
import { overlayEntry } from '@/i18n/content';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import { deepMerge } from '@/i18n/merge';

/* Short notes shown when a field photograph is opened full screen, keyed by photo slug
   (lib/photos.ts). Researched 2026-10-14 against Wikipedia, the IUCN Red List (via GBIF),
   BirdLife and the Reptile Database; sources and confidence per entry are in
   SPECIES_FACTS_REVIEW.md for the naturalists to check. */
export interface SpeciesFacts {
  name: string;
  latin: string | null;
  about: string;
  size?: string | null;
  status?: string | null;
  range?: string | null;
  endemicTo?: string | null;
  /** Habitat photos: one line on what defines the habitat. */
  feature?: string | null;
}

const facts = data as Record<string, SpeciesFacts>;

/** The notes for one photo, in `locale` where translated (content/<locale>/speciesFacts.json). */
export const factsFor = (slug: string, locale: Locale = DEFAULT_LOCALE): SpeciesFacts | undefined => {
  const base = facts[slug];
  return base && deepMerge(base, overlayEntry<SpeciesFacts>(locale, 'speciesFacts', slug));
};
