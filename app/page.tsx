import Link from 'next/link';
import { trips, experts, services, trustSignals, faqs, wildlifeDisclaimer } from '@/lib/data';
import { photos, photoCategories, img, tripPhotoSlugs, findPhoto } from '@/lib/photos';
import { peoplePhotos } from '@/lib/peoplePhotos';
import { getDepartures, formatDate } from '@/lib/schedule';
import { waLink } from '@/lib/site';
import HomeHero, { type OrbitPhoto } from '@/components/HomeHero';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import IndiaOverviewMap from '@/components/IndiaOverviewMap';

/* Featured order: the Western Ghats home-ground trips first. */
const TRIP_ORDER = ['western-ghats-endemics', 'monsoon-rainforest-nights', 'central-india-big-cats', 'himalaya-birds-mountain-wildlife'];
const orderedTrips = [...trips].sort((a, b) => TRIP_ORDER.indexOf(a.id) - TRIP_ORDER.indexOf(b.id));

const SCENE_LABEL: Record<string, string> = {
  'forest-walk': 'Forest trails',
  birdwatching: 'Birding',
  'jeep-safari': 'Jeep safari',
  photography: 'Field photography',
  'group-guide': 'With your naturalist',
  viewpoint: 'Viewpoints',
  'night-walk': 'After dark',
};

/* One photo per scene first, so the collage shows the range of a trip. */
function pickPeople(n: number) {
  const seen = new Set<string>();
  const first = peoplePhotos.filter((p) => (seen.has(p.scene) ? false : (seen.add(p.scene), true)));
  const rest = peoplePhotos.filter((p) => !first.includes(p));
  return [...first, ...rest].slice(0, n);
}

const FAQ_TEASER = [
  'Will we definitely see tigers, or the species listed on a trip page?',
  'I am 75 and walk slowly. Can I join?',
  'I am vegan. Will I get food I can eat?',
  'Apart from wildlife, I want to see beautiful places. Is that included?',
];

export default function Home() {
  const people = pickPeople(7);
  const jeep = people.find((p) => p.scene === 'jeep-safari') ?? people[0];
  const heroOrbit: OrbitPhoto[] | undefined = jeep
    ? [
        { src: img(jeep.thumb), alt: jeep.alt, caption: SCENE_LABEL[jeep.scene], credit: `${jeep.credit.author} · ${jeep.credit.licence}` },
        ...(['malabar-grey-hornbill', 'painted-frog'] as const)
          .map((s) => findPhoto(s))
          .filter((p): p is NonNullable<typeof p> => !!p)
          .map((p) => ({ src: img(p.thumb), alt: p.name, caption: p.name })),
      ]
    : undefined;
  const teaser = FAQ_TEASER.map((q) => faqs.find((f) => f.question === q)).filter((f): f is NonNullable<typeof f> => !!f);

  return (
    <>
      <HomeHero orbit={heroOrbit} />

      {/* Trust band */}
      <section className="py-4 border-y border-[var(--wd-line)] bg-black/30 overflow-hidden" aria-label="Why Wildora">
        <div className="flex w-max marquee-track">
          {[...trustSignals, ...trustSignals].map((s, i) => (
            <span key={i} className="flex items-center gap-3 px-7 text-sm font-medium whitespace-nowrap text-wd-muted" aria-hidden={i >= trustSignals.length}>
              <LeafDot /> {s}
            </span>
          ))}
        </div>
      </section>

      {/* Featured trips with live departure dates */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Upcoming departures</p>
            <h2 className="h-section">Small-group trips, honest expectations</h2>
            <p>Fixed departures for small groups, or the same routes privately on your own dates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 float-grid">
            {orderedTrips.map((trip, i) => {
              const p = findPhoto(tripPhotoSlugs[trip.id]);
              const dates = getDepartures(trip, 2);
              return (
                <article key={trip.id} className="glass card-3d reveal overflow-hidden flex flex-col" style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                  <Link href={`/trips/${trip.id}/`} className="relative block h-52 overflow-hidden group" tabIndex={-1} aria-hidden="true">
                    {p && (
                      <img src={img(p.wide ?? p.src)} alt="" loading="lazy" decoding="async" className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${p.wide ? 'object-top' : ''}`} />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-[#050f09] via-transparent to-transparent" />
                    {trip.region && <span className="chip absolute bottom-3 left-3 !bg-black/55 backdrop-blur-sm">{trip.region}</span>}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="h-card mb-2">
                      <Link href={`/trips/${trip.id}/`} className="hover:text-wd-leaf transition-colors">{trip.title}</Link>
                    </h3>
                    <p className="text-sm text-wd-muted mb-4 leading-relaxed">{trip.description}</p>
                    <dl className="text-sm space-y-1.5 mb-4">
                      <div className="flex gap-2"><dt className="text-wd-faint w-20 shrink-0">Duration</dt><dd className="text-wd-ink">{trip.duration}</dd></div>
                      <div className="flex gap-2"><dt className="text-wd-faint w-20 shrink-0">Pace</dt><dd className="text-wd-ink">{trip.difficulty}</dd></div>
                      <div className="flex gap-2"><dt className="text-wd-faint w-20 shrink-0">Season</dt><dd className="text-wd-ink">{trip.season}</dd></div>
                    </dl>
                    <div className="mt-auto">
                      <p className="text-xs uppercase tracking-[0.16em] text-wd-faint mb-2">Next departures</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {dates.map((d) => <span key={d} className="chip chip-sun">{formatDate(d)}</span>)}
                      </div>
                      <Link href={`/trips/${trip.id}/`} className="btn btn-primary w-full">View itinerary &amp; map</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="wd-note mt-8 max-w-3xl mx-auto reveal">
            <InfoIcon /> <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* Where we go */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-12 items-center">
            <div className="reveal">
              <p className="eyebrow">Where we go</p>
              <h2 className="h-section mb-4">Home ground: the Western Ghats</h2>
              <p className="lede mb-5">
                A UNESCO World Heritage mountain chain running down India&apos;s west coast: lowland rainforest at Thattekad, shola grasslands above Munnar and Ooty, rain-shadow forest at Chinnar and tiger country at Bandipur.
              </p>
              <p className="text-wd-muted mb-6">Further afield, we also run a Central Indian big-cat safari and a Himalayan birding trip.</p>
              <Link href="/trips/" className="link-arrow">Trip routes &amp; maps</Link>
            </div>
            <div className="glass p-3 sm:p-5 reveal" data-no-float style={{ '--d': '120ms' } as React.CSSProperties}>
              <IndiaOverviewMap />
            </div>
          </div>
        </div>
      </section>

      {/* Life on a Wildora trip: people in the field */}
      {people.length > 0 && (
        <section className="wd-section">
          <div className="wd-wrap">
            <div className="wd-head reveal">
              <p className="eyebrow">Life on the trail</p>
              <h2 className="h-section">Walk, watch, ride, listen</h2>
              <p>Early forest walks, binoculars up at a fruiting fig, open jeeps at first light, and viewpoints over tea hills and shola grasslands.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-3 md:gap-4 auto-rows-[10rem] md:auto-rows-[12rem] float-grid">
              {people.map((p, i) => {
                /* 4-col desktop: AAB C / AADD / EFGG; 2-col mobile: AA/AA/BC/DD/EF/GG. No gaps either way. */
                const span = ['col-span-2 row-span-2', '', '', 'col-span-2', '', '', 'col-span-2'][i] ?? '';
                return (
                  <figure key={p.slug} className={`photo-tile photo-tile--captioned card-3d reveal ${span}`} style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
                    <img src={img(i === 0 ? p.src : p.thumb)} alt={p.alt} loading="lazy" decoding="async" />
                    <figcaption className="photo-tile__caption">
                      <span className="block">{SCENE_LABEL[p.scene] ?? p.scene}</span>
                      <span className="block text-[0.62rem] font-normal text-white/70">Photo: {p.credit.author} · {p.credit.licence}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <p className="photo-credit text-center mt-4">
              Illustrative photos used under open licences. <Link href="/credits/">Photographers &amp; licences</Link>
            </p>
          </div>
        </section>
      )}

      {/* Why travel with us */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Why travel with us</p>
            <h2 className="h-section">Guided by scientists, paced for people</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 float-grid">
            {[
              { t: 'Naturalist-led', d: 'Your guides hold doctorates in zoology and environmental science; our lead naturalist has more than 30 years in the field.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { t: 'Small groups', d: 'Ten to twelve guests at most, so everyone gets a turn at the telescope and time for questions.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { t: 'Scenery and rest', d: 'Waterfalls, viewpoints, tea hills and shola grasslands are built into the routes, with downtime between sessions.', icon: 'M3 17l6-6 4 4 8-8M14 7h7v7' },
              { t: 'Ethical by default', d: 'We keep our distance, follow park rules, never bait or handle wildlife, and say plainly that sightings are never guaranteed.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            ].map((c, i) => (
              <div key={c.t} className="glass glass-pad card-3d reveal" style={{ '--d': `${i * 80}ms` } as React.CSSProperties}>
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-4 bg-gradient-to-br from-wd-emerald to-wd-forest border border-[var(--wd-line-strong)] text-wd-leaf lift-z">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={c.icon} />
                  </svg>
                </div>
                <h3 className="h-card mb-2">{c.t}</h3>
                <p className="text-sm text-wd-muted leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field photo film-strip */}
      <section className="wd-section--tight" aria-label="Field photo archive">
        <div className="wd-wrap text-center mb-8 reveal">
          <p className="eyebrow">From the field archive</p>
          <h2 className="h-section">What lives out there</h2>
        </div>
        <div className="space-y-3">
          {[photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)].map((row, r) => (
            <div key={r} className="photo-marquee">
              <div className={`photo-marquee-track${r === 1 ? ' photo-marquee-track--reverse' : ''}`}>
                {[...row, ...row].map((p, i) => (
                  <div key={`${p.slug}-${i}`} className="photo-tile h-32 md:h-40 flex-shrink-0" style={{ aspectRatio: `${p.w} / ${p.h}` }} aria-hidden={i >= row.length}>
                    <img src={img(p.thumb)} alt={i >= row.length ? '' : p.name} loading="lazy" decoding="async" />
                    <span className="photo-tile__caption">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by group */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Explore by group</p>
            <h2 className="h-section">Wildlife we watch &amp; photograph</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 float-grid">
            {[
              ['birds', 'white-throated-kingfisher'],
              ['mammals', 'indian-leopard'],
              ['butterflies', 'common-map'],
              ['moths', 'indian-moon-moth'],
              ['reptiles', 'indian-star-tortoise'],
              ['amphibians', 'painted-frog'],
              ['invertebrates', 'giant-wood-spider'],
              ['plants-habitats', 'montane-shola-forest'],
            ].map(([catId, slug], i) => {
              const cat = photoCategories.find((c) => c.id === catId);
              const p = findPhoto(slug);
              if (!cat || !p) return null;
              return (
                <Link key={catId} href={`/species/#cat-${catId}`} className="photo-tile card-3d reveal block h-44 md:h-56" style={{ '--d': `${i * 50}ms` } as React.CSSProperties}>
                  <img src={img(p.thumb)} alt={`${cat.label}: ${p.name}`} loading="lazy" decoding="async" />
                  <span className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#04100a]/95 to-transparent">
                    <span className="block font-display text-lg font-semibold text-white">{cat.label}</span>
                    <span className="block text-xs text-wd-muted">{cat.count} field photo{cat.count > 1 ? 's' : ''}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">The people who guide you</p>
            <h2 className="h-section">Meet our naturalists</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 float-grid">
            {experts.map((e, i) => (
              <Link key={e.id} href="/experts/" className="glass glass-pad card-3d reveal text-center block" style={{ '--d': `${i * 80}ms` } as React.CSSProperties}>
                {e.imageUrl && (
                  <img src={img(e.imageUrl)} alt={e.name} loading="lazy" decoding="async" className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-2 ring-[var(--wd-line-strong)] ring-offset-4 ring-offset-[#0a1c12] lift-z" />
                )}
                <h3 className="h-card mb-1">{e.name}</h3>
                <p className="text-sm text-wd-lime mb-2">{e.specialization}</p>
                <p className="text-xs text-wd-faint leading-relaxed">{e.experience}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Ways to travel</p>
            <h2 className="h-section">Fixed departures, day tours or your own programme</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 float-grid">
            {services.map((s, i) => (
              <div key={s.id} className="glass p-5 card-3d reveal" style={{ '--d': `${(i % 4) * 60}ms` } as React.CSSProperties}>
                <h3 className="font-display text-lg font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-wd-sun font-semibold mb-2">{s.tagline}</p>
                <p className="text-sm text-wd-muted leading-relaxed mb-3">{s.description}</p>
                <p className="text-xs text-wd-faint"><span className="font-semibold text-wd-muted">Best for:</span> {s.forWho}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before you book */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="glass glass-pad reveal">
              <p className="eyebrow">Before you book</p>
              <h2 className="h-section mb-4">What we arrange, what you bring</h2>
              <ul className="space-y-3 text-wd-muted">
                {[
                  'We arrange: accommodation, meals, your naturalist, transport during the trip, and park entry and permit coordination.',
                  'You arrange: travel to the start point and home, your camera, binoculars and walking gear, chargers and adapters, and personal medication.',
                  'Travel medical insurance is essential, including evacuation cover.',
                  'Tell us about any allergies and medical conditions before you book, so we can plan safely.',
                ].map((t) => (
                  <li key={t} className="flex gap-3"><CheckIcon /> <span>{t}</span></li>
                ))}
              </ul>
              <Link href="/practical/" className="link-arrow mt-6">Plan &amp; prepare in full</Link>
            </div>
            <div className="glass glass-pad reveal" style={{ '--d': '120ms' } as React.CSSProperties}>
              <p className="eyebrow">Common questions</p>
              <h2 className="h-section mb-2">Before you ask</h2>
              <div>
                {teaser.map((f) => (
                  <details key={f.question} className="wd-acc">
                    <summary>{f.question}</summary>
                    <div>{f.answer}</div>
                  </details>
                ))}
              </div>
              <Link href="/faq/" className="link-arrow mt-6">All questions answered</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="glass relative overflow-hidden text-center px-6 py-14 md:py-20 reveal">
            <div className="absolute inset-0 hero-canopy opacity-80" aria-hidden="true" />
            <div className="absolute inset-0 leaf-texture" aria-hidden="true" />
            <div className="relative max-w-2xl mx-auto">
              <p className="eyebrow">Your trip, your pace</p>
              <h2 className="h-section mb-4">Ready to step into the forest?</h2>
              <p className="lede mb-8">Tell us your dates, who is travelling and what you would love to see. We will suggest a route that fits.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={waLink("Hello Wildora! We'd like help planning a nature trip.")} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> Plan on WhatsApp
                </a>
                <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function LeafDot() {
  return (
    <svg className="w-3 h-3 text-wd-lime" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M1 11C1 5 5 1 11 1c0 6-4 10-10 10z" />
    </svg>
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
