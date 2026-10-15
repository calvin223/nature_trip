import { Hanken_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { LOCALE_META, type Locale } from '@/i18n/locales';
import { SITE, SITE_URL } from '@/lib/site';

/* One family for everything (variable weight, with italics for Latin names): headings are set
   large, bold and tight; the photographs carry the character. */
/* `subsets` only chooses what is preloaded: Latin covers English. Accented letters (latin-ext, for the
   planned languages) still load on demand through the font's unicode ranges. */
const hanken = Hanken_Grotesk({ variable: '--font-hanken', subsets: ['latin'], style: ['normal', 'italic'] });

/* The document around every page in one language: <html lang>, the header, footer and floating
   WhatsApp button, and the business's structured data. Used by the [locale] layout and by the
   root 404 page (which sits outside any locale). */
export default async function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = await getMessages({ locale });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE.name,
    url: `${SITE_URL}${locale}/`,
    telephone: `+${SITE.whatsapp.e164}`,
    areaServed: t('jsonLd.areaServed'),
    description: t('jsonLd.description'),
    ...(SITE.email ? { email: SITE.email } : {}),
    sameAs: [SITE.social.facebook, SITE.social.instagram].filter(Boolean),
  };

  return (
    <html lang={LOCALE_META[locale].htmlLang} suppressHydrationWarning>
      <body className={`${hanken.variable} antialiased`}>
        {/* Structured data is valid anywhere in the document; here it needs no hand-written <head>. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* The browser gets only the shared 'common' strings here; pages add their own with ClientMessages. */}
        <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
          <a className="skip-link" href="#main">{t('skipToContent')}</a>
          <Navigation />
          <main id="main">{children}</main>
          <FloatingCTA />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
