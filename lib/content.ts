import type { Locale } from '@/i18n/locales';
import { localize } from '@/i18n/content';
import * as data from './data';

/* The site's long-form content in one language. Pages read content through this rather than
   importing the English arrays from lib/data.ts, so a translation (an overlay in content/<locale>/)
   reaches every page without touching it. Types and logic still come from lib/data.ts. */
export function getContent(locale: Locale) {
  return {
    trips: localize(locale, 'trips', data.trips, (t) => t.id),
    experts: localize(locale, 'experts', data.experts, (e) => e.id),
    species: localize(locale, 'species', data.species, (s) => s.id),
    services: localize(locale, 'services', data.services, (s) => s.id),
    /* FAQs and info items have no id: keyed by their English question or title. */
    faqs: localize(locale, 'faqs', data.faqs, (f) => f.question),
    guestResponsibilities: localize(locale, 'guestResponsibilities', data.guestResponsibilities, (i) => i.title),
    healthAndSafety: localize(locale, 'healthAndSafety', data.healthAndSafety, (i) => i.title),
    faqCategories: data.faqCategories,
    reviews: data.reviews,
  };
}
