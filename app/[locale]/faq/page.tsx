import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import ClientMessages from '@/i18n/ClientMessages';
import { alternates } from '@/i18n/metadata';
import FaqBrowser from './FaqBrowser';
import { groupFaqs } from './faq-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/faq/') };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });
  const groups = groupFaqs(locale);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  /* FAQPage structured data, built from the same entries the page shows. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((it) => ({
        '@type': 'Question',
        name: it.question,
        acceptedAnswer: { '@type': 'Answer', text: it.answer },
      })),
    ),
  };
  // Escape "<" so no answer text can ever close the script element early.
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl">
            <h1 className="h-display mb-5">
              {t.rich('hero.title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
            </h1>
            <p className="lede">{t('hero.lede', { total, topics: groups.length })}</p>
          </div>
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <ClientMessages namespaces={['faq']}>
            <FaqBrowser groups={groups} />
          </ClientMessages>
        </div>
      </section>
    </>
  );
}
