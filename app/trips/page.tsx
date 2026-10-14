import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import IndiaOverviewMap from '@/components/IndiaOverviewMap';
import { services, trips, wildlifeDisclaimer, type Trip } from '@/lib/data';
import { findPhoto, img, tripPhotoSlugs } from '@/lib/photos';
import { formatDate, getDepartures } from '@/lib/schedule';
import { SITE, waLink } from '@/lib/site';

/* Western Ghats home-ground trips first; the rest keep their lib/data.ts order. */
const FIRST = ['western-ghats-endemics', 'monsoon-rainforest-nights'];
for (const id of FIRST) {
  if (!trips.some((t) => t.id === id)) throw new Error(`app/trips: FIRST lists "${id}", which is not a trip in lib/data.ts`);
}
const rank = (t: Trip) => (FIRST.includes(t.id) ? FIRST.indexOf(t.id) : FIRST.length);
const orderedTrips = [...trips].sort((a, b) => rank(a) - rank(b));

/* Private departures and day tours, from the services in lib/data.ts. */
const PRIVATE_SERVICE_IDS = ['private-custom', 'guided-day-tours', 'target-species', 'custom-groups'];
const privateServices = PRIVATE_SERVICE_IDS.map((id) => {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`app/trips: no service "${id}" in lib/data.ts; update PRIVATE_SERVICE_IDS`);
  return service;
});

/** Next departure dates shown on each card. */
const CARD_DEPARTURES = 3;

const DIFFICULTY_CHIP: Record<Trip['difficulty'], string> = {
  Easy: 'chip',
  Moderate: 'chip chip-sun',
  Challenging: 'chip chip-trogon',
};

const tripPhoto = (trip: Trip) => {
  const slug = tripPhotoSlugs[trip.id];
  return slug ? findPhoto(slug) : undefined;
};

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const description =
  `${trips.length} small-group, naturalist-led nature trips in India, from the Western Ghats to the Himalaya: day-by-day itineraries, ` +
  'route maps and upcoming departure dates, plus private departures and guided day tours.';
const ogPhoto = tripPhoto(orderedTrips[0]);

export const metadata: Metadata = {
  title: 'Trips & departure dates',
  description,
  alternates: { canonical: 'trips/' },
  openGraph: {
    title: `Trips & departure dates | ${SITE.name}`,
    description,
    type: 'website',
    locale: 'en_GB',
    siteName: SITE.name,
    url: 'trips/',
    // Relative to metadataBase (the site root under /nature_trip/), so no leading slash.
    ...(ogPhoto ? { images: [{ url: (ogPhoto.wide ?? ogPhoto.src).replace(/^\//, ''), alt: ogPhoto.name }] } : {}),
  },
};

export default function TripsPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl fade-up">
            <p className="eyebrow">Trips &amp; departures</p>
            <h1 className="h-display mb-5">
              Guided trips, <span className="accent-text">honest expectations</span>
            </h1>
            <p className="lede">
              Small-group nature trips led by naturalists. Our home ground is the Western Ghats of South India. Alongside
              the Western Ghats Endemics Expedition we run a monsoon rainforest trip for frogs and reptiles, a Central
              India big-cat safari and a Himalayan birding trip. Each trip page has a day-by-day itinerary, a map and the
              next departure dates.
            </p>
            <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
              <a href="#where" className="chip">Where we go</a>
              <a href="#trips" className="chip chip-sun">Trips &amp; dates</a>
              <a href="#private" className="chip">Private trips &amp; day tours</a>
            </nav>
          </div>
        </div>
      </section>

      {/* Where we go: the overview map stays still (data-no-float on its whole row). */}
      <section id="where" className="wd-section scroll-mt-20">
        <div className="wd-wrap">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12 lg:items-center" data-no-float>
            <div className="reveal">
              <p className="eyebrow">Where we go</p>
              <h2 className="h-section mb-4">Where our trips run</h2>
              <p className="lede mb-5">
                The Western Ghats Endemics route runs from lowland forest at Thattekad in Kerala, over the shola country
                above Munnar and Ooty, to tiger country at Bandipur in Karnataka.
              </p>
              <p className="text-wd-muted">
                For the other trips the shaded areas are approximate: exact parks and bases are confirmed when you book.
                Choose a region on the map, or a trip from the list beneath it.
              </p>
            </div>
            <div className="glass p-3 sm:p-5 reveal" style={delay(120)}>
              <IndiaOverviewMap />
            </div>
          </div>
        </div>
      </section>

      {/* One card per trip, with the next departures. */}
      <section id="trips" className="wd-section scroll-mt-20">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Fixed departures</p>
            <h2 className="h-section">Choose your trip</h2>
            <p>
              Small groups on set dates, or the same routes privately on your own dates. Every date is confirmed when you
              enquire.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 float-grid">
            {orderedTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
          <p className="wd-note reveal mt-8 max-w-3xl mx-auto">
            <InfoIcon /> <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* Private departures and day tours */}
      <section id="private" className="wd-section scroll-mt-20">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Your dates, your pace</p>
            <h2 className="h-section">Private trips &amp; day tours</h2>
            <p>
              Any of these routes can run privately on dates that suit you. Where local logistics allow, we also guide
              half-day and full-day tours for guests already in the area.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 float-grid">
            {privateServices.map((s, i) => (
              <article key={s.id} className="glass glass-pad card-3d reveal flex flex-col" style={delay(i * 80)}>
                <h3 className="h-card">{s.title}</h3>
                <p className="mt-1 text-xs font-semibold text-wd-sun">{s.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-wd-muted">{s.description}</p>
                <p className="mt-auto pt-4 text-xs text-wd-faint">
                  <span className="font-semibold text-wd-muted">Best for:</span> {s.forWho}
                </p>
              </article>
            ))}
          </div>
          <div className="reveal mt-10 flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={waLink("Hello Wildora, I'd like to plan a private trip or a day tour. Our dates, group size and interests are: ")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Plan a private trip
              </a>
              <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
            </div>
            <p className="text-sm text-wd-muted">
              Planning for a school, university or club?{' '}
              <Link href="/schools/" className="link-arrow">Custom groups &amp; schools</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const photo = tripPhoto(trip);
  // Computed at build time in this server component, never in client code.
  const dates = getDepartures(trip, CARD_DEPARTURES);
  const href = `/trips/${trip.id}/`;
  return (
    <article className="glass card-3d reveal overflow-hidden flex flex-col" style={delay((index % 2) * 90)}>
      <Link href={href} className="relative block h-56 sm:h-64 overflow-hidden group" tabIndex={-1} aria-hidden="true">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element -- static export with unoptimised images; img() adds the basePath
          <img
            src={img(photo.wide ?? photo.src)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${photo.wide ? 'object-top' : ''}`}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-wd-night via-transparent to-transparent" />
        {trip.region && <span className="chip absolute bottom-3 left-3 !bg-black/55 backdrop-blur-sm">{trip.region}</span>}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="h-card text-2xl mb-2">
          <Link href={href} className="hover:text-wd-leaf transition-colors">{trip.title}</Link>
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-wd-muted">{trip.description}</p>
        <dl className="mb-5 space-y-1.5 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">Duration</dt>
            <dd className="text-wd-ink">{trip.duration}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">Difficulty</dt>
            <dd><span className={DIFFICULTY_CHIP[trip.difficulty]}>{trip.difficulty}</span></dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-wd-faint">Season</dt>
            <dd className="text-wd-ink">{trip.season}</dd>
          </div>
        </dl>
        <div className="mt-auto">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-wd-faint">Next departures</p>
          <ul className="mb-5 flex flex-wrap gap-2">
            {dates.map((d) => (
              <li key={d}>
                <time dateTime={d} className="chip chip-sun">{formatDate(d)}</time>
              </li>
            ))}
          </ul>
          <Link href={href} className="btn btn-primary w-full">Itinerary, map &amp; dates</Link>
        </div>
      </div>
    </article>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-wd-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
