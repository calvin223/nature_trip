import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALE_META, type Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/i18n/metadata';
import { notFound } from 'next/navigation';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import TripMap from '@/components/TripMap';
import { getContent } from '@/lib/content';
import { CONFIRMED_AT_BOOKING, trips as englishTrips, type Trip } from '@/lib/data';
import { isTripMapId, tripMaps } from '@/lib/mapData';
import { creditText, img, photoName, photoOrThrow, tripPhoto, tripPhotoSlugs, tripSpeciesPhotoSlugs } from '@/lib/photos';
import { blurStyle, blurUrl } from '@/lib/placeholders';
import PhotoStrip, { type StripPhoto } from '@/components/PhotoStrip';
import { routeFor } from '@/lib/routePhotos';
import { describeDepartureRule, formatDepartureRange, getDepartures } from '@/lib/schedule';
import { SITE, SITE_URL, waLink } from '@/lib/site';
import { categorySlug } from '../../faq/faq-utils';
import PrintButton from '../PrintButton';
import RouteStory from '../RouteStory';
import { tripFit } from '../tripFit';
import HeroImage from '@/components/HeroImage';

type PageArgs = { params: Promise<{ locale: Locale; id: string }> };

/* Static export: only the trips in lib/data.ts exist; any other id is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return englishTrips.map((trip) => ({ id: trip.id }));
}

/** Number of upcoming departures listed on each trip page. */
const DEPARTURE_COUNT = 4;

const DIFFICULTY_CHIP: Record<Trip['difficulty'], string> = {
  Easy: 'chip',
  Moderate: 'chip chip-sun',
  Challenging: 'chip chip-trogon',
};

/** The trip in `locale`, for display. */
const findTrip = (id: string, locale: Locale) => getContent(locale).trips.find((t) => t.id === id);

/** "tigers" -> "Tigers" for the species list. */
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: PageArgs): Promise<Metadata> {
  const { locale, id } = await params;
  const trip = findTrip(id, locale);
  if (!trip) {
    const t = await getTranslations({ locale, namespace: 'tripDetail.meta' });
    return { title: t('notFoundTitle') };
  }

  const photo = tripPhoto(trip.id);
  // Relative to metadataBase (the site root under /nature_trip/), so no leading slash.
  const image = photo
    ? {
        url: (photo.wide ?? photo.src).replace(/^\//, ''),
        alt: photoName(photo, locale),
        ...(photo.wide ? {} : { width: photo.w, height: photo.h }),
      }
    : undefined;

  /* Search engines get a title with the words people search for ("birding tour", "tiger safari");
     the page keeps its display name. Falls back to the trip's own title for a trip with no entry. */
  const ts = await getTranslations({ locale, namespace: 'tripDetail' });
  const seo = (field: 'title' | 'description') =>
    ts.has(`seo.${trip.id}.${field}` as never) ? ts(`seo.${trip.id}.${field}` as never) : trip[field];
  return {
    title: seo('title'),
    description: seo('description'),
    alternates: alternates(locale, `/trips/${trip.id}/`),
    openGraph: {
      title: `${trip.title} | ${SITE.name}`,
      description: trip.description,
      type: 'website',
      locale: LOCALE_META[locale].og,
      siteName: SITE.name,
      url: `${locale}/trips/${trip.id}/`,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function TripDetailPage({ params }: PageArgs) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  /* Shown in `locale`; checks that read English (tripFit's evidence, CONFIRMED_AT_BOOKING) use the lib/data.ts entry. */
  const trip = findTrip(id, locale);
  const english = englishTrips.find((t) => t.id === id);
  if (!trip || !english) notFound();
  const t = await getTranslations({ locale, namespace: 'tripDetail' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const { trips, guestResponsibilities } = getContent(locale);

  const photo = tripPhoto(trip.id);
  // Computed here, at build time, never in client code (see lib/schedule.ts).
  const departures = getDepartures(trip, DEPARTURE_COUNT);
  const fit = tripFit(english, locale);
  const mapId = isTripMapId(trip.id) ? trip.id : null;
  const mapKind = mapId ? tripMaps[mapId].kind : null;
  const otherPaces = trips.filter((o) => o.id !== trip.id && o.difficulty !== trip.difficulty);
  const species = trip.targetSpecies ? trip.targetSpecies.split(/,\s*/).map(capitalise) : [];
  /* The strip leaves out the photo already leading the page. */
  const strip: StripPhoto[] = (tripSpeciesPhotoSlugs[trip.id] ?? []).filter((slug) => slug !== tripPhotoSlugs[trip.id]).map((slug) => {
    const p = photoOrThrow(slug);
    const credit = creditText(p);
    return { src: img(p.src), thumb: img(p.thumb), name: photoName(p, locale), blur: blurUrl(p.src), credit: credit && t('itinerary.credit', { credit }) };
  });

  /* TouristTrip structured data: itinerary, audience, photo and the page's place in the site. No offers
     until prices exist, and no Event markup (Google excludes trip packages from events). */
  const pageUrl = `${SITE_URL}${locale}/trips/${trip.id}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description,
    url: pageUrl,
    ...(photo ? { image: `${SITE_URL}${(photo.wide ?? photo.src).replace(/^\//, '')}` } : {}),
    touristType: trip.suitableFor,
    provider: { '@type': 'TravelAgency', name: SITE.name, url: `${SITE_URL}${locale}/` },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: trip.itinerary.length,
      itemListElement: trip.itinerary.map((d) => ({
        '@type': 'ListItem',
        position: d.day,
        name: t.markup('itinerary.dayTitle', { day: d.day, title: d.title, sr: (chunks) => chunks }),
        description: d.description,
      })),
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tc('jsonLd.home'), item: `${SITE_URL}${locale}/` },
      { '@type': 'ListItem', position: 2, name: t('breadcrumb.trips'), item: `${SITE_URL}${locale}/trips/` },
      { '@type': 'ListItem', position: 3, name: trip.title, item: pageUrl },
    ],
  };
  // Escape "<" so no text can ever close the script element early.
  const jsonLdHtml = JSON.stringify([jsonLd, breadcrumb]).replace(/</g, '\\u003c');

  /* One provider for the page's client components (PrintButton, PhotoStrip, the map's
     MapEnhancer), so their messages ship once. */
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="wd-page-head print:pt-0">
        <div className="wd-wrap">
          <nav aria-label={t('breadcrumb.label')} className="mb-6 text-sm no-print">
            <ol className="flex flex-wrap items-center gap-2 text-wd-faint">
              <li>
                <Link href="/trips/" className="hover:text-wd-lime transition-colors">{t('breadcrumb.trips')}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-wd-muted">{trip.title}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <h1 className="h-display text-[clamp(2.2rem,5.2vw,4rem)] mb-5">{trip.title}</h1>
              <p className="lede max-w-2xl">{trip.description}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1" aria-label={t('hero.summaryLabel')}>
                <li className="chip">{trip.duration}</li>
                <li className={DIFFICULTY_CHIP[trip.difficulty]}>{t(`difficulty.${trip.difficulty}`)}</li>
                {trip.region && <li className="chip">{trip.region}</li>}
              </ul>
              <p className="mt-6 text-sm">
                <span className="text-wd-faint">{`${t('hero.nextDeparture')} `}</span>
                <time dateTime={departures[0]} className="font-semibold text-wd-ink">
                  {formatDepartureRange(trip, departures[0], locale)}
                </time>
              </p>
              <div className="mt-7 flex flex-wrap gap-3 no-print">
                <a href="#dates" className="btn btn-primary">{t('hero.seeDates')}</a>
                <PrintButton label={t('hero.print')} />
              </div>
            </div>

            {photo && (
              <div className="no-print">
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-2xl bg-wd-deep" style={blurStyle(photo.wide ?? photo.src)}>
                  <HeroImage
                    src={img(photo.wide ?? photo.src)}
                    alt={photoName(photo, locale)}
                    decoding="async"
                    fetchPriority="high"
                    className={`absolute inset-0 w-full h-full object-cover ${photo.wide ? 'object-top' : ''}`}
                  />
                  <figcaption className="photo-scrim">
                    <span className="photo-label">{photoName(photo, locale)}</span>
                  </figcaption>
                </figure>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── At a glance ──────────────────────────────────────────────────── */}
      <section className="wd-section wd-section--tight" aria-labelledby="glance-title">
        <div className="wd-wrap">
          <div className="glass glass-pad">
            <h2 id="glance-title" className="h-card mb-4">{t('glance.title')}</h2>
            <dl className="mt-2 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Fact label={t('glance.duration')}>{trip.duration}</Fact>
              <Fact label={t('glance.season')}>{trip.season}</Fact>
              <Fact label={t('glance.groupSize')}>{trip.groupSize}</Fact>
              <Fact label={t('glance.price')}>{trip.price}</Fact>
              <Fact label={t('glance.starts')} wide><Place value={trip.startPoint} english={english.startPoint} /></Fact>
              <Fact label={t('glance.ends')} wide><Place value={trip.endPoint} english={english.endPoint} /></Fact>
            </dl>
          </div>
        </div>
      </section>

      {/* ── Wildlife, then the no-guarantee footnote ─────────────────────── */}
      <section id="wildlife" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('wildlife.title')}</h2>
            <p>{t('wildlife.intro')}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <article className="glass glass-pad card-3d">
              <h3 className="h-card">{t('wildlife.highlights')}</h3>
              <ul className="mt-4 space-y-3">
                {trip.highlights.map((h) => (
                  <li key={h} className="flex gap-3 leading-relaxed text-wd-muted">
                    <CheckIcon /> <span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
            <aside className="glass glass-pad card-3d">
              {species.length > 0 && (
                <>
                  <h3 className="h-card">{t('wildlife.species')}</h3>
                  <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-wd-ink">
                    {species.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="divider my-6" />
                </>
              )}
              <h3 className="h-card">{t('wildlife.takeHome')}</h3>
              <ul className="mt-3 space-y-2 text-sm text-wd-muted">
                {trip.learningOutcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-lime" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          {strip.length >= 4 && (
            <div className="mt-10 no-print">
              <h3 className="h-card mb-5">{t('wildlife.mightSee')}</h3>
              <PhotoStrip
                photos={strip}
                label={t('wildlife.stripLabel', { trip: trip.title })}
                prevLabel={t('photoStrip.previous')}
                nextLabel={t('photoStrip.next')}
              />
            </div>
          )}
          <p className="wd-note mt-10">
            <InfoIcon /> <span>{tc('wildlifeDisclaimer')}</span>
          </p>
        </div>
      </section>

      {/* ── Is this trip right for you? ──────────────────────────────────── */}
      <section id="fit" className="wd-section">
        <div className="wd-wrap">
          <div className="glass glass-strong glass-pad grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <h2 className="h-section">{t('fit.title')}</h2>
              <div className="mt-5 flex items-start gap-3">
                <span className={`${DIFFICULTY_CHIP[trip.difficulty]} flex-none`}>{t(`difficulty.${trip.difficulty}`)}</span>
                <p className="text-sm leading-relaxed text-wd-muted">{fit.grade}</p>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <FitRow label={t('fit.pace')}>{fit.pace}</FitRow>
                <FitRow label={t('fit.terrain')}>{fit.terrain}</FitRow>
                <FitRow label={t('fit.rhythm')}>{fit.rhythm}</FitRow>
              </dl>
              <h3 className="h-card mt-7">{t('fit.loveIt')}</h3>
              <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-wd-ink sm:grid-cols-2">
                {trip.suitableFor.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="lg:border-l lg:border-[var(--wd-line)] lg:pl-8">
              <h3 className="h-card">{t('fit.mayNotSuit')}</h3>
              <p className="mt-2 text-sm text-wd-faint">{t('fit.weighUp')}</p>
              <ul className="mt-4 space-y-3">
                {fit.mayNotSuit.map((n) => (
                  <li key={n} className="flex gap-3 text-sm leading-relaxed text-wd-muted">
                    <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-sun" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
              {otherPaces.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-wd-faint">{t('fit.otherPace')}</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {otherPaces.map((o) => (
                      <li key={o.id}>
                        <Link href={`/trips/${o.id}/`} className="text-wd-ink hover:text-wd-lime transition-colors">{o.title}</Link>
                        <span className="text-wd-faint">, {t(`difficulty.${o.difficulty}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex flex-col items-start gap-2">
                <Link href={`/faq/#${categorySlug('Who can join')}`} className="link-arrow text-sm">{t('fit.faqLink')}</Link>
                <Link href="/practical/#difficulty" className="link-arrow text-sm">{t('fit.gradingLink')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Day by day ───────────────────────────────────────────────────── */}
      <section id="itinerary" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('itinerary.title')}</h2>
            <p>{t('itinerary.intro')}</p>
          </div>
          <RouteStory {...routeFor(trip, locale)} />
          <p className="mt-10 text-xs text-wd-faint no-print">
            {t.rich('itinerary.photoNote', {
              link: (chunks) => (
                <Link href="/credits/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>
              ),
            })}
          </p>
        </div>
      </section>

      {/* ── Map (not printed: the dark map does not suit paper) ──────────── */}
      {mapId && (
        <section id="map" className="wd-section no-print">
          <div className="wd-wrap">
            {/* The map's own key and caption explain the markers and, for regions, that the area is approximate. */}
            <div className="wd-head">
              <h2 className="h-section">{t(mapKind === 'route' ? 'map.route' : 'map.region')}</h2>
            </div>
            {/* The map sizes itself to fit the screen height; route maps put the stop list beside it on wide screens. */}
            <TripMap tripId={mapId} />
          </div>
        </section>
      )}

      {/* ── We arrange / You arrange / What to bring ─────────────────────── */}
      <section id="arrange" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('arrange.title')}</h2>
            <p>{t('arrange.intro')}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="glass glass-pad card-3d">
              <h3 className="h-card">{t('arrange.weArrange')}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-wd-muted">
                {trip.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon /> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Titles only until opened, like the FAQ: the details are reference, not reading. */}
            <article className="glass glass-pad card-3d">
              <h3 className="h-card">{t('arrange.youArrange')}</h3>
              <div className="mt-2">
                {guestResponsibilities.map((r) => (
                  <details key={r.title} className="wd-acc wd-acc--sm">
                    <summary>{r.title}</summary>
                    <div>{r.detail}</div>
                  </details>
                ))}
              </div>
            </article>

            <article className="glass glass-pad card-3d">
              <h3 className="h-card">{t('arrange.toBring')}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-wd-muted">
                {trip.toBring.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/practical/#packing" className="link-arrow text-sm mt-5 no-print">{t('arrange.packingLink')}</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ── Health & insurance ───────────────────────────────────────────── */}
      <section id="health" className="wd-section">
        <div className="wd-wrap">
          <div className="glass glass-strong glass-pad border-wd-sun/45">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="h-section">{t('health.title')}</h2>
              </div>
              <Link href="/practical/#health" className="link-arrow no-print">{t('health.detailsLink')}</Link>
            </div>
            {/* The booking conditions stay here, at the point of booking; the full detail lives on /practical/#health. */}
            <p className="wd-alert mt-6">
              {t.rich('health.required', { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 no-print">
              <a
                href={waLink(t('health.whatsappMessage', { trip: trip.title }))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> {t('health.ask')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dates & booking ──────────────────────────────────────────────── */}
      <section id="dates" className="wd-section scroll-mt-24">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('dates.title')}</h2>
            <p>{t('dates.intro', { rule: describeDepartureRule(trip, locale) })}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
            <ul className="border-t border-[var(--wd-line)]" aria-label={t('dates.listLabel')}>
              {departures.map((d, i) => (
                <li key={d} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--wd-line)] py-4">
                  <time dateTime={d} className="text-lg font-semibold text-wd-ink tabular-nums">
                    {formatDepartureRange(trip, d, locale)}
                  </time>
                  <span className="flex items-baseline gap-4">
                    {i === 0 && <span className="text-sm font-medium text-wd-lime">{t('dates.next')}</span>}
                    <Link
                      href={{ pathname: '/contact/', query: { trip: trip.id, date: formatDepartureRange(trip, d, locale) }, hash: 'enquiry' }}
                      className="link-arrow text-sm no-print"
                      aria-label={t('dates.askDateLabel', { date: formatDepartureRange(trip, d, locale) })}
                    >
                      {t('dates.askDate')}
                    </Link>
                  </span>
                </li>
              ))}
            </ul>

            <aside className="glass glass-strong glass-pad">
              <p className="text-sm leading-relaxed text-wd-muted">{t('dates.tellUs')}</p>
              <div className="mt-5 flex flex-col gap-3 no-print">
                <a href={waLink(t('dates.enquireMessage', { trip: trip.title }))} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon /> {t('dates.enquire')}
                </a>
                <a
                  href={waLink(t('dates.privateMessage', { trip: trip.title }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  {t('dates.privateDates')}
                </a>
                <Link href={{ pathname: '/contact/', query: { trip: trip.id }, hash: 'enquiry' }} className="btn btn-ghost">{t('dates.form')}</Link>
              </div>
            </aside>
          </div>

          {trip.seasonNote && (
            <div className="glass glass-pad mt-6 flex items-start gap-3">
              <CalendarIcon />
              <div>
                <h3 className="font-semibold text-wd-ink">{t('dates.whyMonths')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-wd-muted">{trip.seasonNote}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Printed itineraries carry the way back to us (screen readers and screens already have the footer). */}
      <p className="hidden print:block wd-wrap mt-8 text-sm">
        {t('print.contact', { siteName: SITE.name, whatsapp: SITE.whatsapp.display, url: pageUrl })}
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------------------------

function Fact({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="mb-1 text-sm text-wd-faint">{label}</dt>
      <dd className="text-wd-ink">{children}</dd>
    </div>
  );
}

function FitRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-semibold text-wd-lime">{label}</dt>
      <dd className="leading-relaxed text-wd-ink">{children}</dd>
    </div>
  );
}

/** A start or end point; "Confirmed at booking" (read from the English entry) shows as pending, not as a place. */
function Place({ value, english }: { value: string; english: string }) {
  const t = useTranslations('tripDetail.glance');
  return english === CONFIRMED_AT_BOOKING ? (
    <span className="italic text-wd-muted">{t('confirmedAtBooking')}</span>
  ) : (
    <span className="text-wd-ink">{value}</span>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-wd-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-wd-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-wd-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
