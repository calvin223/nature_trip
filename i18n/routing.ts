import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, ENABLED_LOCALES } from './locales';

/* Every URL carries its locale (/en/trips/): GitHub Pages serves static files and cannot rewrite
   an unprefixed path to the default language. On a host with middleware, switch to
   localePrefix: 'as-needed' and add middleware.ts to serve English without the prefix.
   No locale cookie: the chosen language is remembered in localStorage (LanguageSwitcher), which is
   what the cookies and privacy pages describe; turn it on only with those pages updated. */
export const routing = defineRouting({
  locales: ENABLED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeCookie: false,
});
