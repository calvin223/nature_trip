/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/i18n/metadata';
import { localize } from '@/i18n/content';
import { exampleScenery, placePhotos } from '@/lib/placePhotos';
import { img } from '@/lib/photos';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'credits.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/credits/') };
}

export default async function CreditsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'credits' });
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow">
          <h1 className="h-display mb-4">{t('head.title')}</h1>
          <p className="lede">{t('head.lede')}</p>
        </div>
      </section>

      <section className="wd-section--tight">
        <div className="wd-wrap wd-wrap--narrow space-y-6">
          <div className="glass glass-pad">
            <h2 className="h-card mb-2">{t('wildlife.heading')}</h2>
            <p className="text-wd-muted leading-relaxed">{t('wildlife.body')}</p>
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">{t('landscape.heading')}</h2>
            <p className="text-wd-muted leading-relaxed mb-5">
              {t.rich('landscape.body', {
                link: (chunks) => <Link href="/journey/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>,
              })}
            </p>
            <ul className="divide-y divide-[var(--wd-line)]">
              {localize(locale, 'places', [...placePhotos, ...exampleScenery], (p) => p.slug).map((p) => (
                <li key={p.slug} className="py-4 flex gap-4 items-start">
                  <img src={img(p.thumb)} alt="" loading="lazy" decoding="async" className="w-24 h-16 object-cover rounded-lg flex-shrink-0 border border-[var(--wd-line)]" />
                  <div className="text-sm leading-relaxed">
                    <p className="text-wd-ink">{p.caption}</p>
                    <p className="text-wd-faint">
                      {t.rich('landscape.photo', {
                        author: p.credit.author,
                        source: p.credit.source,
                        licence: p.credit.licence,
                        sourceLink: (chunks) => <a href={p.credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</a>,
                        licenceLink: (chunks) => <a href={p.credit.licenceUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</a>,
                      })}
                    </p>
                    <p className="text-wd-faint text-xs">{t('landscape.changes', { changes: p.credit.changes })}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">{t('maps.heading')}</h2>
            <p className="text-wd-muted leading-relaxed">
              {t.rich('maps.body', {
                naturalEarth: (chunks) => <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-wd-lime">{chunks}</a>,
                osm: (chunks) => <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-wd-lime">{chunks}</a>,
              })}
            </p>
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">{t('typefaces.heading')}</h2>
            <p className="text-wd-muted leading-relaxed">{t('typefaces.body')}</p>
          </div>

          <p className="text-sm text-wd-faint">
            {t.rich('wrongCredit', {
              link: (chunks) => <Link href="/contact/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>,
            })}
          </p>
        </div>
      </section>
    </>
  );
}
