import { getTranslations } from 'next-intl/server';
import { SITE } from '@/lib/site';
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from './locales';
import { routing } from './routing';

/** canonical + hreflang links for one page. `path` is the locale-free path, e.g. '/trips/'.
    Relative to metadataBase (the site root, which already includes the GitHub Pages base path). */
export function alternates(locale: Locale, path: string) {
  const url = (l: Locale) => `${l}${path}`;
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [LOCALE_META[l].hreflang, url(l)])),
      'x-default': url(DEFAULT_LOCALE),
    },
  };
}

/** The site-wide Open Graph fields (sharing previews). A page that sets its own openGraph replaces the
    layout's whole object, so it spreads these in and adds its own title, description and url. */
export async function siteOpenGraph(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'common.meta' });
  return {
    type: 'website' as const,
    locale: LOCALE_META[locale].og,
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => LOCALE_META[l].og),
    siteName: t('siteName'),
    images: [{ url: 'photos/mammals/lion-tailed-macaque-wide.webp', width: 1600, height: 900, alt: t('ogImageAlt') }],
  };
}

/* Search-engine ownership meta tags, once the owner has pasted the codes into lib/site.ts. */
export const searchVerification = {
  ...(SITE.searchVerification.google ? { google: SITE.searchVerification.google } : {}),
  ...(SITE.searchVerification.bing ? { other: { 'msvalidate.01': SITE.searchVerification.bing } } : {}),
};
