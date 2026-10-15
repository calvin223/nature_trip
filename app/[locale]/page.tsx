/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ClientMessages from '@/i18n/ClientMessages';
import type { Locale } from '@/i18n/locales';
import { alternates, siteOpenGraph } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import type { Messages } from '@/messages';
import { getContent } from '@/lib/content';
import type { Trip } from '@/lib/data';
import { creditText, img, photoOrThrow } from '@/lib/photos';
import { blurStyle, blurUrl } from '@/lib/placeholders';
import { factsFor } from '@/lib/speciesFacts';
import { getDepartures, formatDate } from '@/lib/schedule';
import { waLink } from '@/lib/site';
import HomeHero from '@/components/HomeHero';
import SpeciesIndex, { type IndexSpecies, type SpeciesGroup } from '@/components/SpeciesIndex';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import GuestReviews from '@/components/GuestReviews';
import SeasonLegend from '@/components/SeasonLegend';

/* Home: enough to spark curiosity; the detail lives one click deeper.
   Hero → numbers → species index → naturalists → trips → guest reviews → seasons → contact. */

type HomeMessages = Messages['home'];

/* "Endemic" only where the species lives nowhere outside the Western Ghats. Names and "where"
   (which repeats only what the itineraries in lib/data.ts name) are in messages home.species.items. */
const INDEX: { slug: keyof HomeMessages['species']['items']; latin: string; group: SpeciesGroup; endemic: boolean }[] = [
  { slug: 'nilgiri-tahr', latin: 'Nilgiritragus hylocrius', group: 'mammals', endemic: true },
  { slug: 'malabar-trogon', latin: 'Harpactes fasciatus', group: 'birds', endemic: false },
  { slug: 'malabar-pit-viper', latin: 'Craspedocephalus malabaricus', group: 'reptilesFrogs', endemic: true },
  { slug: 'nilgiri-flycatcher', latin: 'Eumyias albicaudatus', group: 'birds', endemic: true },
  { slug: 'indian-giant-squirrel', latin: 'Ratufa indica', group: 'mammals', endemic: false },
  { slug: 'large-scaled-pit-viper', latin: 'Craspedocephalus macrolepis', group: 'reptilesFrogs', endemic: true },
  { slug: 'malabar-parakeet', latin: 'Psittacula columboides', group: 'birds', endemic: true },
  { slug: 'golden-backed-frog', latin: 'Indosylvirana sp.', group: 'reptilesFrogs', endemic: false },
];

/* Owner's figures. "25+ years": Dr. A. Relton's 30+ years (lib/data.ts experts). "500+ species":
   awaiting the source (CLIENT_QUESTIONS.md). "10–12": every trip's groupSize. */
const STATS: [string, 'years' | 'species' | 'groupSize'][] = [
  ['25+', 'years'],
  ['500+', 'species'],
  ['10–12', 'groupSize'],
];

/* Photos from the team's own past field courses (camera originals in ../Past photos, resized by
   scripts/build-images.mjs at high quality). The first leads the mosaic. Text: home.field.photos. */
const FIELD: { name: keyof HomeMessages['field']['photos']; widths: number[] }[] = [
  { name: 'roadside-birding', widths: [800, 1400, 2400] },
  { name: 'forest-notes', widths: [700, 1200] },
  { name: 'mangrove-boat', widths: [700, 1200] },
  { name: 'lake-birding', widths: [700, 1200] },
  { name: 'shared-lunch', widths: [700, 1200] },
];
const fieldSrc = (name: string, w: number) => `/photos/field/${name}-${w}.webp`;

const SEASON_ORDER: (keyof HomeMessages['seasons']['shortTitles'])[] = [
  'western-ghats-endemics',
  'monsoon-rainforest-nights',
  'central-india-big-cats',
  'himalaya-birds-mountain-wildlife',
];

const FEATURED: { id: keyof HomeMessages['trips']['lines']; photo: string }[] = [
  { id: 'western-ghats-endemics', photo: 'grassland-shola-mosaic' },
  { id: 'monsoon-rainforest-nights', photo: 'bronze-frog' },
];

/* The other two trips, smaller: photo beside the facts, with the trip's own description. */
const MORE = [
  { id: 'central-india-big-cats', photo: 'tigress-with-cubs' },
  { id: 'himalaya-birds-mountain-wildlife', photo: 'himalayan-whistling-thrush' },
];

/* Title and description come from the layout (common.meta). */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common.meta' });
  return {
    alternates: alternates(locale, '/'),
    openGraph: { ...(await siteOpenGraph(locale)), title: t('title'), description: t('ogDescription'), url: `${locale}/` },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const { trips, experts, reviews } = getContent(locale);
  const trip = (id: string): Trip => {
    const tr = trips.find((x) => x.id === id);
    if (!tr) throw new Error(`app/page.tsx: trip "${id}" not found in lib/data.ts`);
    return tr;
  };
  const months = t.raw('seasons.months') as string[];
  const monthInitials = t.raw('seasons.monthInitials') as string[];
  const index: IndexSpecies[] = INDEX.map((s) => {
    const p = photoOrThrow(s.slug);
    return {
      ...s,
      name: t(`species.items.${s.slug}.name`),
      where: t(`species.items.${s.slug}.where`),
      src: p.src,
      thumb: p.thumb,
      w: p.w,
      h: p.h,
      blur: blurUrl(p.src),
      facts: factsFor(s.slug, locale),
      credit: creditText(p),
    };
  });

  return (
    <>
      <HomeHero />

      {/* The business in three numbers, each with the sentence that backs it */}
      <section className="wd-wrap" aria-label={t('stats.label')}>
        <dl className="grid sm:grid-cols-3 border-b border-[var(--wd-line)]">
          {STATS.map(([figure, key], i) => (
            <div
              key={key}
              className={`flex flex-col py-6 sm:py-8 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-[var(--wd-line)] sm:pl-8' : ''} ${i < 2 ? 'sm:pr-8' : ''}`}
            >
              <dt className="order-2 mt-2 font-semibold text-wd-ink">{t(`stats.${key}.label`)}</dt>
              <dd className="order-1 font-display text-[clamp(2.75rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.03em] text-wd-ink tabular-nums">
                {figure}
              </dd>
              <dd className="order-3 mt-1 text-sm leading-relaxed text-wd-muted">{t(`stats.${key}.note`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Species index */}
      <section className="wd-section" id="species">
        <div className="wd-wrap">
          <div className="mb-8 max-w-2xl">
            <h2 className="h-section">{t('species.title')}</h2>
            <p className="lede mt-3">{t('species.lede')}</p>
          </div>
          <ClientMessages namespaces={['home']}>
            <SpeciesIndex species={index} groups={['birds', 'mammals', 'reptilesFrogs']} />
          </ClientMessages>
          <p className="mt-10">
            <Link href="/species/" className="link-arrow">{t('species.all')}</Link>
          </p>
        </div>
      </section>

      {/* Naturalists, high on the page: they are the product */}
      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <div className="mb-10 max-w-2xl">
            <h2 className="h-section">{t('guides.title')}</h2>
            <p className="lede mt-3">{t('guides.lede')}</p>
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {experts.map((e) => (
              <li key={e.id}>
                {e.imageUrl && (
                  <img
                    src={img(e.imageUrl.replace('/experts/', '/experts/thumb/'))}
                    srcSet={`${img(e.imageUrl.replace('/experts/', '/experts/thumb/'))} 240w, ${img(e.imageUrl)} 600w`}
                    sizes="112px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={blurStyle(e.imageUrl)}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                )}
                <p className="mt-4 font-display text-lg font-semibold text-wd-ink">{e.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-wd-muted">{e.specialization}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <Link href="/experts/" className="link-arrow">{t('guides.cta')}</Link>
          </p>
        </div>
      </section>

      {/* Past field courses: proof, in their own photos, that the naturalists have done this for years */}
      <section className="wd-section" aria-labelledby="field-title">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 id="field-title" className="h-section">{t('field.title')}</h2>
            <p>{t('field.lede')}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {FIELD.map((f, i) => {
              const largest = fieldSrc(f.name, f.widths[f.widths.length - 1]);
              return (
                <li key={f.name} className={i === 0 ? 'col-span-2 lg:row-span-2' : undefined}>
                  <figure
                    className={`relative m-0 h-full overflow-hidden rounded-xl bg-wd-deep aspect-[4/3] ${i === 0 ? 'lg:aspect-auto' : ''}`}
                    style={blurStyle(largest)}
                  >
                    <img
                      src={img(largest)}
                      srcSet={f.widths.map((w) => `${img(fieldSrc(f.name, w))} ${w}w`).join(', ')}
                      sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                      alt={t(`field.photos.${f.name}.alt`)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <figcaption className="photo-scrim">
                      <span className="photo-label">{t(`field.photos.${f.name}.caption`)}</span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
          <p className="mt-8">
            <Link href="/schools/#academic" className="link-arrow">{t('field.link')}</Link>
          </p>
        </div>
      </section>

      {/* Trips */}
      <section className="wd-section" id="trips">
        <div className="wd-wrap">
          <div className="mb-10 max-w-2xl">
            <h2 className="h-section">{t('trips.title')}</h2>
            <p className="lede mt-3">{t('trips.lede')}</p>
          </div>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            {FEATURED.map((f) => {
              const tr = trip(f.id);
              const p = photoOrThrow(f.photo);
              const dates = getDepartures(tr, 2);
              return (
                <Link key={tr.id} href={`/trips/${tr.id}/`} className="group block">
                  <span className="block aspect-[16/10] overflow-hidden rounded-xl bg-wd-deep" style={blurStyle(p.src)}>
                    <img
                      src={img(p.src)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-wd-muted">
                    <span>{t('trips.days', { count: tr.durationDays })}</span>
                    <span>{t(`trips.difficulty.${tr.difficulty}`)}</span>
                    <span>{tr.season}</span>
                  </span>
                  <span className="mt-2 block font-display text-2xl md:text-3xl font-semibold text-wd-ink group-hover:text-wd-lime transition-colors">
                    {tr.title}
                  </span>
                  <span className="mt-2 block text-wd-muted leading-relaxed">{t(`trips.lines.${f.id}`)}</span>
                  <span className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                    <span className="text-wd-faint">{t('trips.nextDepartures')}</span>
                    {dates.map((d) => (
                      <time key={d} dateTime={d} className="font-medium text-wd-ink tabular-nums">
                        {formatDate(d, locale)}
                      </time>
                    ))}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2">
            {MORE.map((m) => {
              const tr = trip(m.id);
              const p = photoOrThrow(m.photo);
              const dates = getDepartures(tr, 2);
              return (
                <Link key={tr.id} href={`/trips/${tr.id}/`} className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-5">
                  <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-wd-deep" style={blurStyle(p.src)}>
                    <img
                      src={img(p.thumb)}
                      srcSet={`${img(p.thumb)} 480w, ${img(p.src)} ${p.w}w`}
                      sizes="(min-width: 768px) 20vw, 40vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
                    />
                  </span>
                  <span>
                    <span className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-wd-muted">
                      <span>{t('trips.days', { count: tr.durationDays })}</span>
                      <span>{t(`trips.difficulty.${tr.difficulty}`)}</span>
                      <span>{tr.season}</span>
                    </span>
                    <span className="mt-1.5 block font-display text-xl md:text-2xl font-semibold leading-tight text-wd-ink group-hover:text-wd-lime transition-colors">
                      {tr.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-wd-muted">{tr.description}</span>
                    <span className="mt-2 flex flex-wrap items-baseline gap-x-3 text-sm">
                      <span className="text-wd-faint">{t('trips.next')}</span>
                      {dates.map((d) => (
                        <time key={d} dateTime={d} className="font-medium text-wd-ink tabular-nums">{formatDate(d, locale)}</time>
                      ))}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-[var(--wd-line)] pt-6 text-wd-muted">
            <Link href="/trips/western-ghats-endemics/#itinerary" className="link-arrow shrink-0">{t('journeyCta')}</Link>
          </div>
        </div>
      </section>

      <GuestReviews reviews={reviews} />

      {/* When to go */}
      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="mb-8 max-w-2xl">
            <h2 className="h-section">{t('seasons.title')}</h2>
            <p className="lede mt-3">{t('seasons.lede')}</p>
          </div>
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">{t('seasons.caption')}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[38%] sm:w-[26%] text-left font-normal text-wd-faint pb-2"><span className="sr-only">{t('seasons.trip')}</span></th>
                {monthInitials.map((m, i) => (
                  <th key={i} scope="col" className="pb-2 font-normal text-wd-faint">
                    <abbr title={months[i]} className="no-underline">{m}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEASON_ORDER.map((id) => {
                const tr = trip(id);
                return (
                  <tr key={id}>
                    <th scope="row" className="py-1.5 pr-3 text-left font-medium text-wd-ink">
                      <Link href={`/trips/${id}/`} className="hover:text-wd-lime">{t(`seasons.shortTitles.${id}`)}</Link>
                    </th>
                    {months.map((name, i) => {
                      const on = tr.seasonMonths.includes(i + 1);
                      return (
                        <td key={name} className="p-[2px]">
                          <span className={`block h-7 rounded ${on ? 'bg-wd-emerald' : 'bg-wd-canopy'}`}>
                            <span className="sr-only">{on ? t('seasons.runs', { month: name }) : t('seasons.noDepartures', { month: name })}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <SeasonLegend />
            <Link href="/when-to-visit/" className="link-arrow shrink-0">{t('seasons.cta')}</Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h2 className="h-section">{t('contact.title')}</h2>
          <p className="lede mt-4 max-w-xl mx-auto">{t('contact.lede')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact/" className="btn btn-primary btn-lg">{t('contact.plan')}</Link>
            <a href={waLink(t('contact.whatsappMessage'))} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
              <WhatsAppIcon /> {t('contact.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
