import type { Metadata, Viewport } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/i18n/locales';
import { alternates, searchVerification, siteOpenGraph } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/* One static copy of the site per enabled locale (i18n/locales.ts). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common.meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s | ${t('siteName')}` },
    description: t('description'),
    alternates: alternates(locale, '/'),
    verification: searchVerification,
    /* Site-wide fields only: a page's own title, description and canonical URL describe it when it
       is shared (pages may still set their own openGraph, as the home and trip pages do). */
    openGraph: await siteOpenGraph(locale),
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* Paint under the notch and home indicator; content pads back out with env(safe-area-inset-*). */
  viewportFit: 'cover',
  /* Android: the keyboard shrinks the layout like on iOS, so focused fields stay in view. */
  interactiveWidget: 'resizes-content',
  themeColor: '#f1f2e9',
  colorScheme: 'light',
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <SiteShell locale={locale}>{children}</SiteShell>;
}
