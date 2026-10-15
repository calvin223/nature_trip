import { useLocale, useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALE_META, type Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/i18n/metadata';
import PageNav from '@/components/PageNav';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import IndiaOverviewMap from '@/components/IndiaOverviewMap';
import { getContent } from '@/lib/content';
import type { Trip } from '@/lib/data';
import { img, photoName, tripPhoto } from '@/lib/photos';
import { formatDate, getDepartures } from '@/lib/schedule';
import { SITE, waLink } from '@/lib/site';

/* Western Ghats home-ground trips first; the rest keep their lib/data.ts order. */
const FIRST = ['western-ghats-endemics', 'monsoon-rainforest-nights'];
const rank = (t: Trip) => (FIRST.includes(t.id) ? FIRST.indexOf(t.id) : FIRST.length);
function orderedTrips(locale: Locale): Trip[] {
  const { trips } = getContent(locale);
  for (const id of FIRST) {
    if (!trips.some((t) => t.id === id)) throw new Error(`app/trips: FIRST lists "${id}", which is not a trip in lib/data.ts`);
  }
  return [...trips].sort((a, b) => rank(a) - rank(b));
}

/* Private departures and day tours, from the services in lib/data.ts. */
const PRIVATE_SERVICE_IDS = ['private-custom', 'guided-day-tours', 'target-species', 'custom-groups'];
function privateServices(locale: Locale) {
  const { services } = getContent(locale);
  return PRIVATE_SERVICE_IDS.map((id) => {
    const service = services.find((s) => s.id === id);
    if (!service) throw new Error(`app/trips: no service "${id}" in lib/data.ts; update PRIVATE_SERVICE_IDS`);
    return service;
  });
}

/** Next departure dates shown on each card. */
const CARD_DEPARTURES = 3;

const DIFFICULTY_CHIP: Record<Trip['difficulty'], string> = {
  Easy: 'chip',
  Moderate: 'chip chip-sun',
  Challenging: 'chip chip-trogon',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'trips.meta' });
  const trips = orderedTrips(locale);
  const description = t('description', { count: trips.length });
  const ogPhoto = tripPhoto(trips[0].id);
  return {
    title: t('title'),
    description,
    alternates: alternates(locale, '/trips/'),
    openGraph: {
      title: `${t('title')} | ${SITE.name}`,
      description,
      type: 'website',
      locale: LOCALE_META[locale].og,
      siteName: SITE.name,
      url: `${locale}/trips/`,
      // Relative to metadataBase (the site root under /nature_trip/), so no leading slash.
      ...(ogPhoto ? { images: [{ url: (ogPhoto.wide ?? ogPhoto.src).replace(/^\//, ''), alt: photoName(ogPhoto, locale) }] } : {}),
    },
  };
}

export default async function TripsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'trips' });
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl">
            <h1 className="h-display mb-5">
              {t.rich('head.title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
            </h1>
            <p className="lede">{t('head.lede')}</p>
          </div>
        </div>
      </section>

      <PageNav
        title={t('nav.title')}
        links={[
          { href: '#where', label: t('nav.where') },
          { href: '#trips', label: t('nav.trips') },
          { href: '#private', label: t('nav.private') },
        ]}
      />

      {/* Where we go */}
      <section id="where" className="wd-section">
        <div className="wd-wrap">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12 lg:items-center">
            <div>
              <h2 className="h-section mb-4">{t('where.title')}</h2>
              <p className="lede">{t('where.body')}</p>
            </div>
            <div className="glass p-3 sm:p-5">
              <IndiaOverviewMap />
            </div>
          </div>
        </div>
      </section>

      {/* One card per trip, with the next departures. */}
      <section id="trips" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('list.title')}</h2>
            <p>{t('list.intro')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {orderedTrips(locale).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Private departures and day tours */}
      <section id="private" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('private.title')}</h2>
            <p>{t('private.intro')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {privateServices(locale).map((s) => (
              <article key={s.id} className="glass glass-pad card-3d flex flex-col">
                <h3 className="h-card">{s.title}</h3>
                <p className="mt-1 text-xs font-semibold text-wd-sun">{s.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-wd-muted">{s.description}</p>
                <p className="mt-auto pt-4 text-xs text-wd-faint">
                  <span className="font-semibold text-wd-muted">{t('private.bestFor')}</span> {s.forWho}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={waLink(t('private.whatsappMessage'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> {t('private.plan')}
              </a>
              <Link href="/contact/" className="btn btn-ghost btn-lg">{t('private.enquiry')}</Link>
            </div>
            <p className="text-sm text-wd-muted">
              {t('private.groups')}{' '}
              <Link href="/schools/" className="link-arrow">{t('private.groupsLink')}</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const t = useTranslations('trips.card');
  const difficulty = useTranslations('tripDetail.difficulty');
  const locale = useLocale();
  const photo = tripPhoto(trip.id);
  // Computed at build time in this server component, never in client code.
  const dates = getDepartures(trip, CARD_DEPARTURES);
  const href = `/trips/${trip.id}/`;
  return (
    <article className="glass card-3d overflow-hidden flex flex-col">
      <Link href={href} className="relative block h-56 sm:h-64 overflow-hidden group" tabIndex={-1} aria-hidden="true">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element -- static export with unoptimised images; img() adds the basePath
          <img
            src={img(photo.wide ?? photo.src)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02] ${photo.wide ? 'object-top' : ''}`}
          />
        )}
        {trip.region && (
          <span className="photo-scrim">
            <span className="photo-label">{trip.region}</span>
          </span>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="h-card text-2xl mb-2">
          <Link href={href} className="hover:text-wd-leaf transition-colors">{trip.title}</Link>
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-wd-muted">{trip.description}</p>
        <dl className="mb-5 space-y-1.5 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">{t('duration')}</dt>
            <dd className="text-wd-ink">{trip.duration}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">{t('difficulty')}</dt>
            <dd><span className={DIFFICULTY_CHIP[trip.difficulty]}>{difficulty(trip.difficulty)}</span></dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">{t('season')}</dt>
            <dd className="text-wd-ink">{trip.season}</dd>
          </div>
        </dl>
        <div className="mt-auto">
          <p className="mb-2 text-sm text-wd-faint">{t('nextDepartures')}</p>
          <ul className="mb-5 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-wd-ink tabular-nums">
            {dates.map((d) => (
              <li key={d}>
                <time dateTime={d}>{formatDate(d, locale)}</time>
              </li>
            ))}
          </ul>
          <Link href={href} className="btn btn-primary w-full">{t('cta')}</Link>
        </div>
      </div>
    </article>
  );
}
