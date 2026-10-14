/* Every language the site is planned in. A locale gets pages only once it is in ENABLED_LOCALES,
   which should happen when its messages (messages/<locale>/) are translated; see messages/README.md. */
export const LOCALES = ['en', 'fr', 'de', 'es', 'pt', 'pl'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const ENABLED_LOCALES: Locale[] = ['en'];

export const LOCALE_META: Record<Locale, { name: string; htmlLang: string; hreflang: string; og: string }> = {
  en: { name: 'English', htmlLang: 'en-GB', hreflang: 'en', og: 'en_GB' },
  fr: { name: 'Français', htmlLang: 'fr', hreflang: 'fr', og: 'fr_FR' },
  de: { name: 'Deutsch', htmlLang: 'de', hreflang: 'de', og: 'de_DE' },
  es: { name: 'Español', htmlLang: 'es-ES', hreflang: 'es', og: 'es_ES' },
  /* European Portuguese: the site is aimed at travellers from Europe. */
  pt: { name: 'Português', htmlLang: 'pt-PT', hreflang: 'pt', og: 'pt_PT' },
  pl: { name: 'Polski', htmlLang: 'pl', hreflang: 'pl', og: 'pl_PL' },
};

/** Where a visitor's chosen language is remembered (the root page and the language switcher). */
export const LOCALE_STORAGE_KEY = 'wd-locale';
