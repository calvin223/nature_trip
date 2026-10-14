/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { trips, wildlifeDisclaimer } from '@/lib/data';
import { findPhoto, img, tripPhotoSlugs, type Photo } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

export const metadata: Metadata = {
  title: 'About the Western Ghats',
  description:
    'Our home ground: the Western Ghats of South India, across Kerala, Tamil Nadu and Karnataka. Lowland rainforest, shola grassland, rain-shadow forest and tiger country, and the endemic wildlife our naturalists look for.',
};

/** Look up a photo by slug, failing the build if it has gone missing from lib/photos.ts. */
function photo(slug: string): Photo {
  const p = findPhoto(slug);
  if (!p) throw new Error(`about/page.tsx: photo "${slug}" not found in lib/photos.ts`);
  return p;
}

const ENDEMICS_TRIP_ID = 'western-ghats-endemics';

/* Habitats along the Western Ghats Endemics Expedition. Places and species are only those
   named in that trip's itinerary in lib/data.ts. Photos illustrate the habitat type; they are
   not captioned with a place because we do not know where each was taken. */
const HABITATS = [
  {
    days: 'Days 1–2',
    title: 'Lowland forest',
    places: 'Thattekad Bird Sanctuary and the Periyar River, Kerala',
    look: 'Malabar grey hornbill, Sri Lanka frogmouth, Malabar trogon and white-bellied treepie.',
    photo: 'evergreen-forest',
  },
  {
    days: 'Days 3, 4 & 9',
    title: 'Shola forest and grassland',
    places: 'Pampadum Shola, Eravikulam (Rajamalai) and Mukurthi',
    look: 'Nilgiri tahr, Nilgiri pipit, Nilgiri wood pigeon, endemic orchids and, rarely, the Nilgiri marten.',
    photo: 'montane-shola-forest',
  },
  {
    days: 'Day 5',
    title: 'Rain-shadow forest',
    places: 'Chinnar Wildlife Sanctuary, on the dry eastern slopes',
    look: 'Grizzled giant squirrel, Indian star tortoise, mugger crocodile and Indian giant flying squirrel.',
    photo: 'dry-deciduous-forest',
  },
  {
    days: 'Days 6–7',
    title: 'Rainforest fragments and tea estates',
    places: 'Anamalai Tiger Reserve, Valparai, Nallamudi and Sholayar',
    look: 'Lion-tailed macaque, Nilgiri langur, Malabar giant squirrel and great hornbill, alongside elephant and gaur.',
    photo: 'indian-giant-squirrel',
  },
  {
    days: 'Day 8',
    title: 'Nilgiri hills',
    places: 'Doddabetta, Wenlock Downs and the Government Botanical Garden, Ooty',
    look: 'Nilgiri laughingthrush, Nilgiri flycatcher and classic shola vegetation.',
    photo: 'nilgiri-rhododendron',
  },
  {
    days: 'Day 10',
    title: 'Tiger country',
    places: 'Bandipur Tiger Reserve, Karnataka',
    look: 'A chance of tiger, Asian elephant, leopard, dhole, gaur and crested hawk-eagle.',
    photo: 'asian-elephant-herd',
  },
].map((h) => ({ ...h, img: photo(h.photo) }));

/* Species found only in the Western Ghats and named as targets on the Endemics route. */
const ENDEMIC_SLUGS = [
  'lion-tailed-macaque',
  'nilgiri-tahr-male',
  'malabar-grey-hornbill',
  'nilgiri-flycatcher',
  'nilgiri-pipit',
  'nilgiri-wood-pigeon',
];

export default function AboutPage() {
  const hero = photo('grassland-shola-mosaic');
  const endemicsTrip = trips.find((t) => t.id === ENDEMICS_TRIP_ID);
  if (!endemicsTrip) throw new Error(`about/page.tsx: trip "${ENDEMICS_TRIP_ID}" not found in lib/data.ts`);
  const otherTrips = trips.filter((t) => t.id !== ENDEMICS_TRIP_ID);

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="h-display mb-5">
              About the <span className="accent-text">Western Ghats</span>
            </h1>
            <p className="lede mb-6">
              Our home ground: the hills and mountains that run parallel to India&apos;s west coast. We work their
              southern stretch, across Kerala, Tamil Nadu and Karnataka, where our naturalists have done much of their
              field research.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="chip">UNESCO World Heritage Site</span>
              <span className="chip">Kerala · Tamil Nadu · Karnataka</span>
              <span className="chip chip-sun">Endemic wildlife</span>
            </div>
          </div>
          <figure className="photo-tile photo-tile--captioned card-3d aspect-[4/3]" data-float>
            <img src={img(hero.src)} alt={hero.name} width={hero.w} height={hero.h} loading="eager" decoding="async" />
            <figcaption className="photo-tile__caption">{hero.name}</figcaption>
          </figure>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad reveal">
            <h2 className="h-section mb-5">Many forests on one route</h2>
            <div className="space-y-4 text-wd-muted leading-relaxed">
              <p>
                The Western Ghats are a UNESCO World Heritage Site. From one day to the next on our route the forest
                changes completely: lowland rainforest, high shola forest and grassland, rain-shadow forest on the dry
                eastern slopes, and the deciduous forests of the tiger reserves. Each holds its own wildlife, and several
                species live nowhere else on Earth.
              </p>
              <p>
                We plan each trip around the wildlife, the season, your comfort level and the way you like to travel.
                Our {endemicsTrip.durationDays}-day {endemicsTrip.title} crosses all of these habitats.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Link href={`/trips/${endemicsTrip.id}/`} className="link-arrow">
                See the {endemicsTrip.title}
              </Link>
              <Link href="/when-to-visit/" className="link-arrow">
                When each trip runs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">One route, many habitats</p>
            <h2 className="h-section">From lowland forest to high grassland</h2>
            <p>The habitats the {endemicsTrip.title} passes through, in the order you meet them.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 float-grid">
            {HABITATS.map((h, i) => (
              <article
                key={h.title}
                className="glass card-3d reveal overflow-hidden flex flex-col"
                style={{ '--d': `${(i % 3) * 100}ms` } as CSSProperties}
              >
                <div className="h-44 overflow-hidden bg-wd-deep">
                  <img
                    src={img(h.img.thumb)}
                    alt={h.img.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="glass-pad flex flex-col gap-2">
                  <span className="chip self-start">{h.days}</span>
                  <h3 className="h-card">{h.title}</h3>
                  <p className="text-sm text-wd-faint">{h.places}</p>
                  <p className="text-sm text-wd-muted leading-relaxed">
                    <span className="text-wd-ink font-semibold">Look for: </span>
                    {h.look}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Found nowhere else</p>
            <h2 className="h-section">Endemics on the route</h2>
            <p>
              The lion-tailed macaque, the Nilgiri tahr and these birds live only in the Western Ghats. All six are
              target species on the {endemicsTrip.title}.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 float-grid">
            {ENDEMIC_SLUGS.map((slug) => {
              const p = photo(slug);
              return (
                <figure key={slug} className="photo-tile photo-tile--captioned aspect-[4/3] reveal">
                  <img src={img(p.wide ?? p.src)} alt={p.name} loading="lazy" decoding="async" />
                  <figcaption className="photo-tile__caption">{p.name}</figcaption>
                </figure>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col items-center gap-5">
            <p className="wd-note max-w-3xl">{wildlifeDisclaimer}</p>
            <Link href="/species/" className="link-arrow">
              Browse the field gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Our other trips</p>
            <h2 className="h-section">Each in its own season</h2>
            <p>Alongside the {endemicsTrip.title}, we run these trips.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 float-grid">
            {otherTrips.map((t, i) => {
              const slug = tripPhotoSlugs[t.id];
              const p = slug ? findPhoto(slug) : undefined;
              return (
                <Link
                  key={t.id}
                  href={`/trips/${t.id}/`}
                  className="glass card-3d reveal overflow-hidden flex flex-col group"
                  style={{ '--d': `${i * 100}ms` } as CSSProperties}
                >
                  {p && (
                    <div className="h-40 overflow-hidden bg-wd-deep">
                      <img
                        src={img(p.thumb)}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="glass-pad flex flex-col gap-2 flex-1">
                    {t.region && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wd-lime">{t.region}</p>}
                    <h3 className="h-card">{t.title}</h3>
                    <p className="text-sm text-wd-muted leading-relaxed flex-1">{t.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="chip chip-sun">{t.season}</span>
                      <span className="chip">{t.duration}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad reveal">
            <p className="eyebrow">How we travel</p>
            <h2 className="h-section mb-5">Ethical wildlife travel</h2>
            <div className="space-y-4 text-wd-muted leading-relaxed">
              <p>
                Wildlife tourism only works when it respects park rules, local communities, animal behaviour and the
                limits of each habitat. We avoid baiting, risky handling, crowding animals and unrealistic sighting
                promises.
              </p>
              <p>
                Our role is to plan good routes, set honest expectations, work with local expertise and help you
                experience the forest without treating animals as props.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad text-center reveal">
            <h2 className="h-section mb-4">Come and see it for yourself</h2>
            <p className="lede mb-8 max-w-2xl mx-auto">
              Tell us when you can travel and what you most hope to see. We will suggest the trip and season that fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/trips/" className="btn btn-primary btn-lg">
                See trips &amp; dates
              </Link>
              <a
                href={waLink("Hello Wildora, I'd like to know more about your Western Ghats trips.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
