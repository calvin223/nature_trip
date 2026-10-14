import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import ClientMessages from '@/i18n/ClientMessages';
import { alternates } from '@/i18n/metadata';
import { getContent } from '@/lib/content';
import { LOCALE_META } from '@/i18n/locales';
import { findPhoto, photoName, photos, photosForTab, speciesTabs, tripSpeciesPhotoSlugs } from '@/lib/photos';
import { factsFor, type SpeciesFacts } from '@/lib/speciesFacts';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import SpeciesExplorer, { type FocusSpecies } from './SpeciesExplorer';

/* species-card id -> field photo slug, where our archive has a matching shot */
const speciesPhotoSlugs: Record<string, string> = {
  'bengal-tiger': 'bengal-tiger',
  'great-hornbill': 'great-indian-hornbill',
  'southern-birdwing': 'southern-birdwing',
  'rhododendron': 'nilgiri-rhododendron',
};

/* Focus species are "species we plan routes around", each shown with its field photo. Resolved here
   on the server: getContent() holds every content set, which must not reach the client bundle. */
function focusSpeciesFor(locale: Locale): FocusSpecies[] {
  return getContent(locale).species.map((sp) => {
    const photo = findPhoto(speciesPhotoSlugs[sp.id]);
    if (!photo) throw new Error(`species/page.tsx: no field photo for focus species "${sp.id}" in speciesPhotoSlugs`);
    return { ...sp, photo };
  });
}

/* Photo slug -> the trips whose itinerary names that species, for the full-screen notes. */
function seenOnFor(locale: Locale): Record<string, string> {
  const { trips } = getContent(locale);
  const seenOn: Record<string, string> = {};
  for (const [tripId, slugs] of Object.entries(tripSpeciesPhotoSlugs)) {
    const title = trips.find((t) => t.id === tripId)?.title;
    if (!title) throw new Error(`species/page.tsx: trip "${tripId}" in tripSpeciesPhotoSlugs not found in lib/data.ts`);
    for (const slug of slugs) seenOn[slug] = seenOn[slug] ? `${seenOn[slug]}; ${title}` : title;
  }
  return seenOn;
}

/* Every photographed species and habitat with its notes, as plain text grouped like the gallery's tabs.
   The lightbox shows these notes only on click, so without this list search engines and AI tools never
   see them. Collapsed by default so the page stays short. */
function speciesIndexFor(locale: Locale) {
  const tripsBySlug: Record<string, string[]> = {};
  for (const [tripId, slugs] of Object.entries(tripSpeciesPhotoSlugs)) {
    for (const slug of slugs) (tripsBySlug[slug] ??= []).push(tripId);
  }
  return speciesTabs
    .filter((tab) => tab !== 'All')
    .map((tab) => ({
      tab,
      rows: photosForTab(tab).map((photo) => ({ photo, facts: factsFor(photo.slug, locale), tripIds: tripsBySlug[photo.slug] ?? [] })),
    }))
    .filter((group) => group.rows.length > 0);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'species.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/species/') };
}

export default async function SpeciesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'species' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h1 className="h-display mb-5">
            {t.rich('hero.title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
          </h1>
          <p className="lede">{t('hero.lede', { count: photos.length })}</p>
        </div>
      </section>

      <section className="wd-section !pt-0" id="gallery">
        <div className="wd-wrap">
          <ClientMessages namespaces={['species']}>
            <SpeciesExplorer seenOn={seenOnFor(locale)} focusSpecies={focusSpeciesFor(locale)} />
          </ClientMessages>
          <SpeciesIndexList locale={locale} />
          <p className="mt-8 text-sm text-wd-faint">
            {t.rich('credits', {
              link: (chunks) => (
                <Link href="/credits/" className="underline underline-offset-2 hover:text-wd-ink">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </section>

      {/* Two editorial rows on the full width: heading left, the substance right. */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="grid gap-x-12 gap-y-5 border-t border-[var(--wd-line-strong)] pt-8 lg:grid-cols-12">
            <h2 className="h-section lg:col-span-5">{t('why.title')}</h2>
            <div className="lg:col-span-7 space-y-4 text-wd-muted leading-relaxed md:text-[1.05rem]">
              {(t.raw('why.paragraphs') as string[]).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-5 border-t border-[var(--wd-line-strong)] pt-8 lg:grid-cols-12">
            <h2 className="h-section lg:col-span-5">{t('ethics.title')}</h2>
            <div className="lg:col-span-7 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              <article>
                <h3 className="h-card mb-4">{t('ethics.doTitle')}</h3>
                <ul className="space-y-2.5 text-wd-muted">
                  {(t.raw('ethics.do') as string[]).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className="h-card mb-4">{t('ethics.dontTitle')}</h3>
                <ul className="space-y-2.5 text-wd-muted">
                  {(t.raw('ethics.dont') as string[]).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-trogon flex-none" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad text-center">
            <h2 className="h-section mb-4">{t('cta.title')}</h2>
            <p className="lede mb-6 max-w-2xl mx-auto">{t('cta.lede')}</p>
            <p className="wd-note text-left max-w-2xl mx-auto mb-8">{tc('wildlifeDisclaimer')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/trips/" className="btn btn-primary btn-lg">
                {t('cta.browseTrips')}
              </Link>
              <a
                href={waLink(t('cta.whatsappMessage'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> {t('cta.askWhatsApp')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function SpeciesIndexList({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'species' });
  const tf = await getTranslations({ locale, namespace: 'common.facts' });
  const { trips } = getContent(locale);
  const list = new Intl.ListFormat(LOCALE_META[locale].htmlLang, { type: 'conjunction' });
  const groups = speciesIndexFor(locale);
  const facts = (f: SpeciesFacts | undefined): [string, string][] =>
    (
      [
        [tf('status'), f?.status],
        [tf('range'), f?.range],
        [tf('endemicTo'), f?.endemicTo],
        [tf('habitat'), f?.feature],
      ] as [string, string | null | undefined][]
    ).filter((r): r is [string, string] => Boolean(r[1]));

  /* Trip titles joined the locale's way ("A, B and C"), each one a link. */
  const tripLinks = (ids: string[]) => {
    let n = 0;
    return list.formatToParts(ids.map((id) => trips.find((tr) => tr.id === id)?.title ?? id)).map((part, i) =>
      part.type === 'element' ? (
        <Link key={i} href={`/trips/${ids[n++]}/`} className="underline underline-offset-2 hover:text-wd-ink">
          {part.value}
        </Link>
      ) : (
        <span key={i}>{part.value}</span>
      ),
    );
  };

  return (
    <details className="wd-acc species-index mt-10">
      <summary>{t('index.summary', { count: photos.length })}</summary>
      <div>
        <p className="text-sm text-wd-muted">{t('index.intro')}</p>
        {groups.map(({ tab, rows }) => (
          <section key={tab} className="mt-6">
            <h3 className="h-card mb-2">{t(`tabs.${tab}` as never)}</h3>
            <ul>
              {rows.map(({ photo, facts: f, tripIds }) => (
                <li key={photo.slug} className="species-index__row">
                  <p>
                    <span className="font-semibold text-wd-ink">{photoName(photo, locale)}</span>
                    {f?.latin && <i className="ml-2 text-wd-faint">{f.latin}</i>}
                  </p>
                  <dl className="species-index__facts">
                    {facts(f).map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                    {tripIds.length > 0 && (
                      <div>
                        <dt>{tf('whereWeLook')}</dt>
                        <dd>{tripLinks(tripIds)}</dd>
                      </div>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}
