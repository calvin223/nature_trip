import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import TripMap from '@/components/TripMap';
import {
  CONFIRMED_AT_BOOKING,
  guestResponsibilities,
  healthAndSafety,
  trips,
  wildlifeDisclaimer,
  type Trip,
} from '@/lib/data';
import { isTripMapId, tripMaps } from '@/lib/mapData';
import { findPhoto, img, tripPhotoSlugs } from '@/lib/photos';
import { describeDepartureRule, formatDate, formatDepartureRange, getDepartures } from '@/lib/schedule';
import { SITE, tripEnquiryMessage, waLink } from '@/lib/site';
import { categorySlug } from '../../faq/faq-utils';
import PrintButton from '../PrintButton';
import { tripFit } from '../tripFit';

type PageArgs = { params: Promise<{ id: string }> };

/* Static export: only the trips in lib/data.ts exist; any other id is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return trips.map((trip) => ({ id: trip.id }));
}

/** Number of upcoming departures listed on each trip page. */
const DEPARTURE_COUNT = 4;

const DIFFICULTY_CHIP: Record<Trip['difficulty'], string> = {
  Easy: 'chip',
  Moderate: 'chip chip-sun',
  Challenging: 'chip chip-trogon',
};

/* The health items that are conditions of booking (owner brief, points 6-7), matched by title
   as on /practical/, so a rename in lib/data.ts fails the build instead of dropping the badge. */
const REQUIRED_HEALTH = [/insurance/i, /allerg/i, /medical condition/i];
for (const re of REQUIRED_HEALTH) {
  if (!healthAndSafety.some((h) => re.test(h.title))) {
    throw new Error(`app/trips/[id]: no healthAndSafety item title matches ${re}; update REQUIRED_HEALTH to match lib/data.ts`);
  }
}
const isRequiredHealth = (title: string) => REQUIRED_HEALTH.some((re) => re.test(title));

/* The travel item in "You arrange" gets this trip's own start and end points. */
const TRAVEL_ITEM = guestResponsibilities.find((r) => /start/i.test(r.title));
if (!TRAVEL_ITEM) {
  throw new Error('app/trips/[id]: no guestResponsibilities item about getting to the start point; update TRAVEL_ITEM to match lib/data.ts');
}

const findTrip = (id: string) => trips.find((t) => t.id === id);

function heroPhoto(trip: Trip) {
  const slug = tripPhotoSlugs[trip.id];
  return slug ? findPhoto(slug) : undefined;
}

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** "tigers" -> "Tigers" for species chips. */
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: PageArgs): Promise<Metadata> {
  const { id } = await params;
  const trip = findTrip(id);
  if (!trip) return { title: 'Trip not found' };

  const photo = heroPhoto(trip);
  // Relative to metadataBase (the site root under /nature_trip/), so no leading slash.
  const image = photo
    ? {
        url: (photo.wide ?? photo.src).replace(/^\//, ''),
        alt: photo.name,
        ...(photo.wide ? {} : { width: photo.w, height: photo.h }),
      }
    : undefined;

  return {
    title: trip.title,
    description: trip.description,
    alternates: { canonical: `trips/${trip.id}/` },
    openGraph: {
      title: `${trip.title} | ${SITE.name}`,
      description: trip.description,
      type: 'website',
      locale: 'en_GB',
      siteName: SITE.name,
      url: `trips/${trip.id}/`,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function TripDetailPage({ params }: PageArgs) {
  const { id } = await params;
  const trip = findTrip(id);
  if (!trip) notFound();

  const photo = heroPhoto(trip);
  // Computed here, at build time, never in client code (see lib/schedule.ts).
  const departures = getDepartures(trip, DEPARTURE_COUNT);
  const fit = tripFit(trip);
  const mapId = isTripMapId(trip.id) ? trip.id : null;
  const mapKind = mapId ? tripMaps[mapId].kind : null;
  const otherPaces = trips.filter((t) => t.id !== trip.id && t.difficulty !== trip.difficulty);
  const species = trip.targetSpecies ? trip.targetSpecies.split(/,\s*/).map(capitalise) : [];

  /* TouristTrip structured data: itinerary and audience only. No offers or prices. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description,
    touristType: trip.suitableFor,
    provider: { '@type': 'TravelAgency', name: SITE.name },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: trip.itinerary.length,
      itemListElement: trip.itinerary.map((d) => ({
        '@type': 'ListItem',
        position: d.day,
        name: `Day ${d.day}: ${d.title}`,
        description: d.description,
      })),
    },
  };
  // Escape "<" so no text can ever close the script element early.
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="wd-page-head print:pt-0">
        <div className="wd-wrap">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm no-print">
            <ol className="flex flex-wrap items-center gap-2 text-wd-faint">
              <li>
                <Link href="/trips/" className="hover:text-wd-lime transition-colors">Trips</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-wd-muted">{trip.title}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
            <div className="fade-up">
              <p className="eyebrow">Small-group nature trip</p>
              <h1 className="h-display text-[clamp(2.2rem,5.2vw,4rem)] mb-5">{trip.title}</h1>
              <p className="lede max-w-2xl">{trip.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Trip summary">
                <li className="chip">{trip.duration}</li>
                <li className={DIFFICULTY_CHIP[trip.difficulty]}>{trip.difficulty}</li>
                {trip.region && <li className="chip">{trip.region}</li>}
              </ul>
              <p className="mt-6 text-sm">
                <span className="text-wd-faint">Next departure: </span>
                <time dateTime={departures[0]} className="font-semibold text-wd-ink">
                  {formatDepartureRange(trip, departures[0])}
                </time>
              </p>
              <div className="mt-7 flex flex-wrap gap-3 no-print">
                <a href="#dates" className="btn btn-primary">See dates &amp; enquire</a>
                <a href={waLink(tripEnquiryMessage(trip.title))} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon /> WhatsApp us
                </a>
                <PrintButton />
              </div>
            </div>

            {photo && (
              <div className="fade-up no-print [animation-delay:120ms]">
                <figure className="hero3d-window m-0" style={{ height: 'auto', minHeight: 0, aspectRatio: '4 / 3' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export with unoptimised images; img() adds the basePath */}
                  <img
                    src={img(photo.wide ?? photo.src)}
                    alt={photo.name}
                    decoding="async"
                    fetchPriority="high"
                    className={`absolute inset-0 w-full h-full object-cover ${photo.wide ? 'object-top' : ''}`}
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-wd-night/75 via-transparent to-transparent" />
                  <figcaption className="chip absolute bottom-4 left-4 !bg-black/55 backdrop-blur-sm">{photo.name}</figcaption>
                </figure>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── At a glance ──────────────────────────────────────────────────── */}
      <section className="wd-section wd-section--tight" aria-labelledby="glance-title">
        <div className="wd-wrap">
          <div className="glass glass-pad reveal">
            <h2 id="glance-title" className="eyebrow">At a glance</h2>
            <dl className="mt-2 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Fact label="Duration">{trip.duration}</Fact>
              <Fact label="Season">{trip.season}</Fact>
              <Fact label="Group size">{trip.groupSize}</Fact>
              <Fact label="Price">{trip.price}</Fact>
              <Fact label="Starts" wide><Place value={trip.startPoint} /></Fact>
              <Fact label="Ends" wide><Place value={trip.endPoint} /></Fact>
            </dl>
          </div>
        </div>
      </section>

      {/* ── Wildlife, then the no-guarantee footnote ─────────────────────── */}
      <section id="wildlife" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Wildlife</p>
            <h2 className="h-section">What we look for</h2>
            <p>The habitats and species this route is planned around.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] float-grid">
            <article className="glass glass-pad card-3d reveal">
              <h3 className="h-card">Highlights</h3>
              <ul className="mt-4 space-y-3">
                {trip.highlights.map((h) => (
                  <li key={h} className="flex gap-3 leading-relaxed text-wd-muted">
                    <CheckIcon /> <span>{h}</span>
                  </li>
                ))}
              </ul>
            </article>
            <aside className="glass glass-pad card-3d reveal" style={delay(100)}>
              {species.length > 0 && (
                <>
                  <h3 className="h-card">Species we search for</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {species.map((s) => (
                      <li key={s} className="chip">{s}</li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className={`h-card ${species.length > 0 ? 'mt-6' : ''}`}>Focus</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {trip.focus.map((f) => (
                  <li key={f} className="chip chip-sun">{f}</li>
                ))}
              </ul>
              <div className="divider my-6" />
              <h3 className="h-card">What you take home</h3>
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
          <p className="wd-note reveal mt-6">
            <InfoIcon /> <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* ── Beyond the wildlife ──────────────────────────────────────────── */}
      <section id="scenery" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Beyond the wildlife</p>
            <h2 className="h-section">Scenery along the way</h2>
            <p>Landscapes and places named in the itinerary.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 float-grid">
            {trip.sceneryHighlights.map((s, i) => (
              <li key={s} className="glass p-5 card-3d reveal flex items-start gap-3" style={delay((i % 3) * 80)}>
                <MountainIcon />
                <span className="text-wd-ink leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Is this trip right for you? ──────────────────────────────────── */}
      <section id="fit" className="wd-section">
        <div className="wd-wrap">
          <div className="glass glass-strong glass-pad reveal grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow">Honest expectations</p>
              <h2 className="h-section">Is this trip right for you?</h2>
              <div className="mt-5 flex items-start gap-3">
                <span className={`${DIFFICULTY_CHIP[trip.difficulty]} flex-none`}>{trip.difficulty}</span>
                <p className="text-sm leading-relaxed text-wd-muted">{fit.grade}</p>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <FitRow label="Pace">{fit.pace}</FitRow>
                <FitRow label="Terrain">{fit.terrain}</FitRow>
                <FitRow label="Days & weather">{fit.rhythm}</FitRow>
              </dl>
              <h3 className="h-card mt-7">Who will love it</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {trip.suitableFor.map((s) => (
                  <li key={s} className="chip">{s}</li>
                ))}
              </ul>
            </div>
            <div className="lg:border-l lg:border-[var(--wd-line)] lg:pl-8">
              <h3 className="h-card">Who it may not suit</h3>
              <p className="mt-2 text-sm text-wd-faint">Worth weighing up before you book:</p>
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
                  <p className="text-sm text-wd-faint">Looking for a different pace?</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {otherPaces.map((t) => (
                      <li key={t.id}>
                        <Link href={`/trips/${t.id}/`} className="text-wd-ink hover:text-wd-lime transition-colors">{t.title}</Link>
                        <span className="text-wd-faint"> · {t.difficulty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex flex-col items-start gap-2">
                <Link href={`/faq/#${categorySlug('Who can join')}`} className="link-arrow text-sm">Age, fitness and access: FAQ</Link>
                <Link href="/practical/#difficulty" className="link-arrow text-sm">How we grade difficulty</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Day by day ───────────────────────────────────────────────────── */}
      <section id="itinerary" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Day by day</p>
            <h2 className="h-section">The itinerary</h2>
            <p>{trip.duration}. Day 1 is the departure date.</p>
          </div>
          <ol className="relative mx-auto max-w-3xl">
            {trip.itinerary.map((d, i) => (
              <li key={d.day} className="relative pl-12 pb-6 last:pb-0 reveal" style={delay(Math.min(i, 3) * 60)}>
                {i < trip.itinerary.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[calc(0.95rem-1px)] top-[2.9rem] -bottom-3 w-0.5 rounded-full bg-gradient-to-b from-wd-lime/60 to-wd-lime/15"
                  />
                )}
                <span aria-hidden="true" className="wd-badge absolute left-0 top-3">{d.day}</span>
                <article className="glass p-5 sm:p-6 card-3d">
                  <h3 className="h-card">
                    <span className="sr-only">Day {d.day}: </span>
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-wd-muted">{d.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Map (not printed: the dark map does not suit paper) ──────────── */}
      {mapId && (
        <section id="map" className="wd-section no-print">
          <div className="wd-wrap">
            <div className="wd-head reveal">
              <p className="eyebrow">{mapKind === 'route' ? 'Route map' : 'Where it runs'}</p>
              <h2 className="h-section">{mapKind === 'route' ? 'Follow the route' : 'The region'}</h2>
              <p>
                {mapKind === 'route'
                  ? 'Numbers on the map are itinerary days. Each stop links to OpenStreetMap.'
                  : 'The itinerary does not yet fix exact parks or bases, so the shaded area is approximate. We confirm the route when you book.'}
              </p>
            </div>
            {/* Route maps are portrait-shaped (the Ghats run north–south): cap the width so the map fits a desktop screen. */}
            <div className="glass p-3 sm:p-5 reveal max-w-2xl mx-auto" data-no-float>
              <TripMap tripId={mapId} />
            </div>
          </div>
        </section>
      )}

      {/* ── We arrange / You arrange / What to bring ─────────────────────── */}
      <section id="arrange" className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Who arranges what</p>
            <h2 className="h-section">We arrange, you arrange</h2>
            <p>What is included between the start and end points, and what you arrange and bring yourself.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3 float-grid">
            <article className="glass glass-pad card-3d reveal">
              <h3 className="h-card">We arrange</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-wd-muted">
                {trip.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon /> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="glass glass-pad card-3d reveal" style={delay(100)}>
              <h3 className="h-card">You arrange</h3>
              <ul className="mt-4 space-y-4">
                {guestResponsibilities.map((r) => (
                  <li key={r.title}>
                    <p className="text-sm font-semibold text-wd-ink">{r.title}</p>
                    {r === TRAVEL_ITEM && (
                      <dl className="mt-2 space-y-2 rounded-xl border border-[var(--wd-line)] bg-wd-deep/60 p-3 text-sm">
                        <div>
                          <dt className="text-xs uppercase tracking-[0.14em] text-wd-faint">Start point</dt>
                          <dd><Place value={trip.startPoint} /></dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.14em] text-wd-faint">End point</dt>
                          <dd><Place value={trip.endPoint} /></dd>
                        </div>
                      </dl>
                    )}
                    <p className="mt-1.5 text-xs leading-relaxed text-wd-muted">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="glass glass-pad card-3d reveal" style={delay(200)}>
              <h3 className="h-card">What to bring</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-wd-muted">
                {trip.toBring.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/practical/#packing" className="link-arrow text-sm mt-5 no-print">Full packing list</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ── Health & insurance ───────────────────────────────────────────── */}
      <section id="health" className="wd-section">
        <div className="wd-wrap">
          <div className="glass glass-strong glass-pad reveal border-wd-sun/45">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Before you book</p>
                <h2 className="h-section">Health &amp; insurance</h2>
              </div>
              <Link href="/practical/#health" className="link-arrow no-print">Full health &amp; insurance details</Link>
            </div>
            <p className="wd-alert mt-6">
              <strong>Required of every guest, at or before booking:</strong> travel medical insurance for the whole trip,
              details of any allergies, and any medical conditions.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {healthAndSafety.map((h) => {
                const required = isRequiredHealth(h.title);
                return (
                  <li
                    key={h.title}
                    className={`rounded-2xl border p-5 ${required ? 'border-wd-sun/40 bg-wd-sun/5' : 'border-[var(--wd-line)] bg-wd-deep/40'}`}
                  >
                    {required && <span className="chip chip-sun mb-3">Required</span>}
                    <h3 className="font-semibold text-white">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-wd-muted">{h.detail}</p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3 no-print">
              <a
                href={waLink(`Hello Wildora, I have a health question about the ${trip.title}: `)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> Ask a health question
              </a>
              <Link href="/practical/" className="btn btn-ghost">Plan &amp; prepare</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dates & booking ──────────────────────────────────────────────── */}
      <section id="dates" className="wd-section scroll-mt-24">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Dates &amp; booking</p>
            <h2 className="h-section">Upcoming departures</h2>
            <p>
              {describeDepartureRule(trip)}. Dates are confirmed when you enquire, and private departures on dates of
              your choosing are available.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
            <ul className="grid gap-4 sm:grid-cols-2 float-grid" aria-label="Upcoming departure dates">
              {departures.map((d, i) => (
                <li key={d} className="glass p-5 card-3d reveal flex flex-col" style={delay(i * 80)}>
                  <p className="text-xs uppercase tracking-[0.16em] text-wd-faint">
                    {i === 0 ? 'Next departure' : 'Departure'}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold text-white">
                    <time dateTime={d}>{formatDepartureRange(trip, d)}</time>
                  </p>
                  <p className="mt-1 text-sm text-wd-muted">{trip.duration}</p>
                  <a
                    href={waLink(tripEnquiryMessage(trip.title, formatDate(d)))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa mt-5 !py-2.5 text-sm no-print"
                  >
                    <WhatsAppIcon /> Enquire about this date
                  </a>
                </li>
              ))}
            </ul>

            <aside className="glass glass-strong glass-pad reveal" style={delay(120)}>
              <p className="eyebrow">Price</p>
              <p className="font-display text-3xl font-semibold text-white">{trip.price}</p>
              <p className="mt-2 text-sm text-wd-muted">
                {trip.groupSize} · {trip.duration}
              </p>
              <div className="divider my-5" />
              <p className="text-sm leading-relaxed text-wd-muted">
                Tell us the dates you have in mind, your group size and any dietary or medical needs. We will reply with
                availability, a suggested plan and how to confirm your place.
              </p>
              <div className="mt-5 flex flex-col gap-3 no-print">
                <a href={waLink(tripEnquiryMessage(trip.title))} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon /> Enquire on WhatsApp
                </a>
                <a
                  href={waLink(`Hello Wildora, I'd like to ask about a private departure of the ${trip.title} on our own dates.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Ask about private dates
                </a>
                <Link href="/contact/" className="btn btn-ghost">Send an enquiry form</Link>
                <PrintButton />
              </div>
            </aside>
          </div>

          {trip.seasonNote && (
            <div className="glass glass-pad reveal mt-6 flex items-start gap-3">
              <CalendarIcon />
              <div>
                <h3 className="font-semibold text-white">Why these months</h3>
                <p className="mt-1 text-sm leading-relaxed text-wd-muted">{trip.seasonNote}</p>
              </div>
            </div>
          )}

          <p className="wd-note reveal mt-6">
            <InfoIcon /> <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------------------------

function Fact({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="mb-1 text-xs uppercase tracking-[0.16em] text-wd-faint">{label}</dt>
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

/** A start or end point; "Confirmed at booking" reads as pending, not as a place. */
function Place({ value }: { value: string }) {
  return value === CONFIRMED_AT_BOOKING ? (
    <span className="italic text-wd-muted">{value}</span>
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

function MountainIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-wd-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 19l6-9 4 6 2-3 6 6H3z" />
      <circle cx="17" cy="6" r="2" strokeWidth={1.8} />
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
