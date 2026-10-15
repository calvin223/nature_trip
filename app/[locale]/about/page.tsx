/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import type { Trip } from '@/lib/data';
import { img, photoName, photoOrThrow } from '@/lib/photos';
import { findPlace } from '@/lib/placePhotos';
import { blurStyle } from '@/lib/placeholders';
import IndiaOverviewMap from '@/components/IndiaOverviewMap';
import HeroImage from '@/components/HeroImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/about/') };
}

/* The three regions we run trips in (text: about.regions.items). Text only restates what the
   trips in lib/data.ts cover. */
const REGIONS = [
  { key: 'westernGhats', tripIds: ['western-ghats-endemics', 'monsoon-rainforest-nights'] },
  { key: 'centralIndia', tripIds: ['central-india-big-cats'] },
  { key: 'himalaya', tripIds: ['himalaya-birds-mountain-wildlife'] },
] as const;

/* Habitats along the Western Ghats Endemics Expedition, in route order. Places are only those
   named in that trip's itinerary in lib/data.ts; the day-by-day detail lives on that trip's page.
   Photos show the habitat type, not necessarily the place named. */
const HABITATS = ([
  { key: 'lowland', photo: 'evergreen-forest' },
  { key: 'shola', photo: 'montane-shola-forest' },
  { key: 'rainShadow', photo: 'dry-deciduous-forest' },
  { key: 'fragments', photo: 'indian-gaur' },
  { key: 'nilgiris', photo: 'nilgiri-rhododendron' },
  { key: 'tigerCountry', photo: 'asian-elephant-herd' },
] as const).map((h) => ({ ...h, img: photoOrThrow(h.photo) }));

/* Species found only in the Western Ghats and named as targets on the Endemics route. */
const ENDEMIC_SLUGS = [
  'lion-tailed-macaque',
  'nilgiri-tahr-female',
  'malabar-grey-hornbill',
  'nilgiri-flycatcher',
  'nilgiri-pipit',
  'nilgiri-wood-pigeon',
];

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const { trips } = getContent(locale);
  const trip = (id: string): Trip => {
    const found = trips.find((x) => x.id === id);
    if (!found) throw new Error(`about/page.tsx: trip "${id}" not found in lib/data.ts`);
    return found;
  };
  /* A credited place photo, so the hero differs from the home page's shola photo. */
  const hero = findPlace('pampadum-shola', locale);
  if (!hero) throw new Error('about/page.tsx: place photo "pampadum-shola" not found in lib/placePhotos.ts');
  const endemics = trip('western-ghats-endemics');

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <h1 className="h-display max-w-4xl">{t('hero.title')}</h1>
          <p className="lede mt-6 max-w-2xl">{t('hero.lede')}</p>
          <figure className="mt-8 sm:mt-10">
            <div className="aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-wd-deep" style={blurStyle(hero.src)}>
              <HeroImage src={img(hero.src)} alt={hero.alt} width={hero.w} height={hero.h} decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-wd-muted">
              {t('hero.caption')}{' '}
              <span className="text-wd-faint">{tc('facts.credit', { credit: `${hero.credit.author}, ${hero.credit.licence}` })}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Origin: the field came first */}
      <section className="wd-section">
        <div className="wd-wrap grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 className="h-section">{t('origin.title')}</h2>
          <div className="max-w-[65ch] space-y-5 text-lg leading-relaxed text-wd-muted">
            {(t.raw('origin.paragraphs') as string[]).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              <Link href="/experts/" className="link-arrow">{t('origin.link')}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Where we travel */}
      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:items-center">
          <div>
            <h2 className="h-section">{t('regions.title')}</h2>
            <p className="lede mt-4 max-w-xl">{t('regions.lede')}</p>
            <ul className="mt-8">
              {REGIONS.map((r) => (
                <li key={r.key} className="border-t border-[var(--wd-line-strong)] py-6">
                  <h3 className="h-card">{t(`regions.items.${r.key}.name`)}</h3>
                  <p className="mt-2 leading-relaxed text-wd-muted">{t(`regions.items.${r.key}.note`)}</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {r.tripIds.map(trip).map((tr) => (
                      <li key={tr.id} className="flex flex-wrap gap-x-3">
                        <Link
                          href={`/trips/${tr.id}/`}
                          className="font-semibold text-wd-ink underline decoration-[var(--wd-line-strong)] underline-offset-4 hover:text-wd-lime hover:decoration-current"
                        >
                          {tr.title}
                        </Link>
                        <span className="text-wd-muted">{tr.season}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <IndiaOverviewMap />
        </div>
      </section>

      {/* The Western Ghats route, habitat by habitat */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('habitats.title')}</h2>
            <p>{t('habitats.intro', { trip: endemics.title })}</p>
          </div>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {HABITATS.map((h) => (
              <li key={h.key}>
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-wd-deep" style={blurStyle(h.img.src)}>
                  <img src={img(h.img.thumb)} alt={photoName(h.img, locale)} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <h3 className="h-card mt-4">{t(`habitats.items.${h.key}.title`)}</h3>
                <p className="mt-1 text-sm text-wd-muted">{t(`habitats.items.${h.key}.places`)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/trips/western-ghats-endemics/#itinerary" className="link-arrow">{t('habitats.link')}</Link>
          </p>
        </div>
      </section>

      {/* Endemics */}
      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('endemics.title')}</h2>
            <p>{t('endemics.intro', { trip: endemics.title })}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {ENDEMIC_SLUGS.map((slug) => {
              const p = photoOrThrow(slug);
              const name = photoName(p, locale);
              return (
                <li key={slug}>
                  <figure className="m-0">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-wd-deep" style={blurStyle(p.wide ?? p.src)}>
                      <img src={img(p.wide ?? p.src)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>
                    {/* ponytail: strips only the English "(Male)"/"(Female)" suffix; a translated photo name keeps its own. */}
                    <figcaption className="mt-2.5 text-sm font-medium text-wd-ink">{name.replace(/ \((Male|Female)\)$/, '')}</figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-wd-muted">{tc('wildlifeDisclaimer')}</p>
          <p className="mt-5">
            <Link href="/species/" className="link-arrow">{t('endemics.link')}</Link>
          </p>
        </div>
      </section>

      {/* How we travel */}
      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 className="h-section">{t('howWeTravel.title')}</h2>
          <div className="max-w-[65ch] space-y-5 text-lg leading-relaxed text-wd-muted">
            <p>{t('howWeTravel.body')}</p>
            <p>
              <Link href="/species/" className="link-arrow">{t('howWeTravel.link')}</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
