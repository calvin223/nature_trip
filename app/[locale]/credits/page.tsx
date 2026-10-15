/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/i18n/metadata';
import { localize } from '@/i18n/content';
import { exampleScenery, placePhotos, type PlacePhoto } from '@/lib/placePhotos';
import { img, photoName, photos } from '@/lib/photos';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'credits.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/credits/') };
}

export default async function CreditsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'credits' });
  const credited = photos.filter((p) => p.credit);
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
            {credited.length > 0 && (
              <>
                <p className="text-wd-muted leading-relaxed mt-3 mb-5">{t('wildlife.commons')}</p>
                <ul className="divide-y divide-[var(--wd-line)]">
                  {credited.map((p) => (
                    <CreditRow key={p.slug} thumb={p.thumb} caption={photoName(p, locale)} credit={p.credit!} />
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">{t('landscape.heading')}</h2>
            <p className="text-wd-muted leading-relaxed mb-5">
              {t.rich('landscape.body', {
                link: (chunks) => <Link href="/trips/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>,
              })}
            </p>
            <ul className="divide-y divide-[var(--wd-line)]">
              {localize(locale, 'places', [...placePhotos, ...exampleScenery], (p) => p.slug).map((p) => (
                <CreditRow key={p.slug} thumb={p.thumb} caption={p.caption} credit={p.credit} />
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

/** One credited photo: thumbnail, caption, author, source and licence links, and what was changed. */
function CreditRow({ thumb, caption, credit }: { thumb: string; caption: string; credit: PlacePhoto['credit'] }) {
  const t = useTranslations('credits');
  return (
    <li className="py-4 flex gap-4 items-start">
      <img src={img(thumb)} alt="" loading="lazy" decoding="async" className="w-24 h-16 object-cover rounded-lg flex-shrink-0 border border-[var(--wd-line)]" />
      <div className="text-sm leading-relaxed">
        <p className="text-wd-ink">{caption}</p>
        <p className="text-wd-faint">
          {t.rich('landscape.photo', {
            author: credit.author,
            source: credit.source,
            licence: credit.licence,
            sourceLink: (chunks) => <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</a>,
            licenceLink: (chunks) => <a href={credit.licenceUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</a>,
          })}
        </p>
        <p className="text-wd-faint text-xs">{t('landscape.changes', { changes: credit.changes })}</p>
      </div>
    </li>
  );
}
