import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import {
  CONFIRMED_AT_BOOKING,
  faqs,
  guestResponsibilities,
  healthAndSafety,
  trips,
  wildlifeDisclaimer,
  type Trip,
} from '@/lib/data';
import { waLink } from '@/lib/site';
import { groupFaqs } from '../faq/faq-utils';

export const metadata: Metadata = {
  title: 'Plan & Prepare',
  description:
    'What you arrange and bring yourself, the travel medical insurance, allergy and medical information we need before you book, difficulty grades, packing lists and what each trip includes.',
};

/* The three health items that are conditions of booking (owner brief, points 6-7).
   Matched by title, so a reorder in lib/data.ts cannot move the "Required" badge onto
   the wrong item, and a rename fails the build instead of silently losing the emphasis. */
const REQUIRED_MATCHERS = [/insurance/i, /allerg/i, /medical condition/i];
const requiredHealth = REQUIRED_MATCHERS.map((re) => {
  const item = healthAndSafety.find((h) => re.test(h.title));
  if (!item) {
    throw new Error(`app/practical: no healthAndSafety item title matches ${re}; update REQUIRED_MATCHERS to match lib/data.ts`);
  }
  return item;
});
const otherHealth = healthAndSafety.filter((h) => !requiredHealth.includes(h));

const GRADES: { level: Trip['difficulty']; chip: string; body: string }[] = [
  {
    level: 'Easy',
    chip: 'chip',
    body: 'Mostly vehicle-based safaris, walks in lodge grounds and gentle trails. Suits most fitness levels, including families.',
  },
  {
    level: 'Moderate',
    chip: 'chip chip-sun',
    body: 'More walking on uneven forest trails, some climbs, early starts and more exposure to rain, heat or cold. Needs basic fitness and comfort outdoors.',
  },
  {
    level: 'Challenging',
    chip: 'chip chip-trogon',
    body: 'Longer walks, higher altitude, steep trails, remote habitat or long field hours. Needs good fitness and stamina.',
  },
];

const ESSENTIAL_GEAR = [
  'Sturdy, broken-in walking shoes or boots with good grip',
  'A rain jacket that is waterproof, not just water-resistant',
  'Long trousers and full-sleeve shirts in neutral colours',
  'A warm layer for early mornings and high ground',
  'Hat, sunglasses and sunscreen',
  'Insect repellent',
  'A reusable water bottle',
  'Headlamp or torch, with spare batteries',
  'Personal medication, with copies of your prescriptions',
];

const USEFUL_EXTRAS = [
  'Binoculars (8× or 10×)',
  'Camera with a telephoto or macro lens, spare batteries and memory cards',
  'A field notebook and pen',
  'Your own field guide (we carry shared references)',
  'Dry bags for electronics',
  'A small day pack',
  'Power bank and a universal plug adapter',
  'Bags for wet clothes',
  'Tissues, hand sanitiser and wet wipes for the road',
];

const faqGroups = groupFaqs();
const faqTotal = faqGroups.reduce((n, g) => n + g.items.length, 0);
// Three practical questions for the teaser. The first Practicalities answer is skipped
// because it repeats the "What you are responsible for" section on this page.
const faqTeaser = faqs.filter((f) => f.category === 'Practicalities').slice(1, 4);

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 flex-none mt-px" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.01" strokeLinecap="round" />
    </svg>
  );
}

export default function PracticalPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
          <div className="fade-up">
            <p className="eyebrow">Plan &amp; prepare</p>
            <h1 className="h-display mb-5">
              Before you <span className="accent-text">travel</span>
            </h1>
            <p className="lede max-w-2xl">
              What each trip includes, what you arrange and bring yourself, and the health and insurance details we
              need from every guest before booking.
            </p>
            <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
              <a href="#responsibilities" className="chip">Your responsibilities</a>
              <a href="#health" className="chip chip-sun">Health &amp; insurance</a>
              <a href="#difficulty" className="chip">Difficulty grades</a>
              <a href="#packing" className="chip">Packing</a>
              <a href="#included" className="chip">What is included</a>
              <a href="#faq" className="chip">FAQ</a>
            </nav>
          </div>

          <aside className="glass glass-strong glass-pad fade-up" aria-labelledby="essentials-title">
            <p className="eyebrow">Before you book</p>
            <h2 id="essentials-title" className="h-card">Three things we need from every guest</h2>
            <ol className="mt-5 space-y-3">
              {requiredHealth.map((item, i) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex-none grid place-items-center w-7 h-7 rounded-full bg-wd-sun text-wd-night text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-wd-ink font-medium">{item.title}</span>
                </li>
              ))}
            </ol>
            <a href="#health" className="link-arrow text-sm mt-5">Read the details</a>
          </aside>
        </div>
      </section>

      {/* (a) What you are responsible for */}
      <section id="responsibilities" className="wd-section scroll-mt-6">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Your side of the trip</p>
            <h2 className="h-section">What you are responsible for</h2>
            <p>
              Each trip page lists what is included between its start and end points. These you arrange and bring
              yourself.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 float-grid">
            {guestResponsibilities.map((item, i) => (
              <article key={item.title} className="glass glass-pad card-3d reveal" style={delay((i % 3) * 100)}>
                <span className="font-display text-3xl font-semibold accent-text">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h-card mt-3">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* (b) Health, insurance & medical information */}
      <section id="health" className="wd-section scroll-mt-6">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Before you book</p>
            <h2 className="h-section">Health, insurance &amp; medical information</h2>
            <p>
              Many of our routes are remote, and the nearest hospital can be hours away. These three are required of every
              guest, at or before booking, so that we can plan the right pace and respond properly in an emergency.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 float-grid">
            {requiredHealth.map((item, i) => (
              <article
                key={item.title}
                className="glass glass-strong glass-pad card-3d reveal !border-[rgba(242,177,52,0.45)]"
                style={delay(i * 100)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="chip chip-sun">Required</span>
                  <span className="font-display text-2xl font-semibold text-wd-sun">{i + 1}</span>
                </div>
                <h3 className="h-card mt-4">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-wd-ink/90">{item.detail}</p>
              </article>
            ))}
          </div>

          {otherHealth.length > 0 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2 float-grid">
              {otherHealth.map((item, i) => (
                <article key={item.title} className="glass glass-pad card-3d reveal" style={delay(i * 100)}>
                  <h3 className="h-card">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-wd-muted">{item.detail}</p>
                </article>
              ))}
            </div>
          )}

          <div className="reveal mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-wd-muted max-w-2xl">
              Not sure whether a trip suits a health condition, an allergy or your mobility? Ask us before you book.
            </p>
            <a
              href={waLink('Hello Wildora, I have a health question before booking: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon /> Ask a health question
            </a>
          </div>
        </div>
      </section>

      {/* (c) Difficulty grades */}
      <section id="difficulty" className="wd-section scroll-mt-6">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">How hard is it?</p>
            <h2 className="h-section">Difficulty grades</h2>
            <p>Every trip page shows its grade. On a private departure we can set the pace around your group.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3 float-grid">
            {GRADES.map((g, i) => {
              const graded = trips.filter((t) => t.difficulty === g.level);
              return (
                <article key={g.level} className="glass glass-pad card-3d reveal flex flex-col" style={delay(i * 100)}>
                  <span className={`${g.chip} self-start`}>{g.level}</span>
                  <p className="mt-4 text-sm leading-relaxed text-wd-muted">{g.body}</p>
                  <div className="divider my-5" />
                  {graded.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {graded.map((t) => (
                        <li key={t.id}>
                          <Link href={`/trips/${t.id}/`} className="text-wd-ink hover:text-wd-lime transition-colors">
                            {t.title}
                          </Link>
                          <span className="text-wd-faint"> · {t.duration}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-wd-faint">
                      No current fixed departure is graded {g.level}. A private route can be, on request.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* (c) Packing */}
      <section id="packing" className="wd-section scroll-mt-6">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Packing</p>
            <h2 className="h-section">What to pack</h2>
            <p>
              A general list for all our routes. Each <Link href="/trips/" className="link-arrow">trip page</Link> adds
              its own “What to bring” list for its season and terrain.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 float-grid">
            {[
              { title: 'Essential gear', items: ESSENTIAL_GEAR },
              { title: 'Useful extras', items: USEFUL_EXTRAS },
            ].map((list, i) => (
              <article key={list.title} className="glass glass-pad card-3d reveal" style={delay(i * 100)}>
                <h3 className="h-card">{list.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {list.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-wd-muted">
                      <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-lime" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* (c) What is included, and (d) the wildlife disclaimer */}
      <section id="included" className="wd-section scroll-mt-6">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">At a glance</p>
            <h2 className="h-section">What each trip includes</h2>
            <p>
              We use wildlife lodges, guesthouses and nature stays chosen for comfort and for being close to the
              field. Meals are included on every trip; tell us about any allergy or dietary need when you book.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 float-grid">
            {trips.map((t, i) => (
              <article key={t.id} className="glass glass-pad card-3d reveal flex flex-col" style={delay((i % 4) * 100)}>
                <h3 className="h-card">
                  <Link href={`/trips/${t.id}/`} className="hover:text-wd-lime transition-colors">{t.title}</Link>
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip">{t.duration}</span>
                  <span className="chip chip-sun">{t.difficulty}</span>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-wd-faint">Season</dt>
                    <dd className="text-wd-ink">{t.season}</dd>
                  </div>
                  <div>
                    <dt className="text-wd-faint">Group size</dt>
                    <dd className="text-wd-ink">{t.groupSize}</dd>
                  </div>
                  <div>
                    <dt className="text-wd-faint">Starts</dt>
                    <dd className={t.startPoint === CONFIRMED_AT_BOOKING ? 'text-wd-muted italic' : 'text-wd-ink'}>
                      {t.startPoint}
                    </dd>
                  </div>
                </dl>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wd-lime">Included</p>
                <ul className="mt-2 space-y-1.5 text-sm text-wd-muted">
                  {t.included.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-wd-lime">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="reveal mt-5 glass glass-pad">
            <h3 className="h-card">Not included on any trip</h3>
            <p className="mt-2 text-sm text-wd-muted">
              Travel medical insurance, and everything under{' '}
              <a href="#responsibilities" className="link-arrow">What you are responsible for</a>:
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {guestResponsibilities.map((item) => (
                <li key={item.title} className="chip">{item.title}</li>
              ))}
            </ul>
          </div>

          <p className="wd-note reveal mt-8">
            <InfoIcon />
            <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* (e) FAQ teaser: the full list lives on /faq/ */}
      <section id="faq" className="wd-section scroll-mt-6">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="wd-head reveal">
            <p className="eyebrow">Questions</p>
            <h2 className="h-section">Common practical questions</h2>
            <p>
              {faqTotal} answers in {faqGroups.length} topics are on the FAQ page.
            </p>
          </div>

          <div className="glass glass-pad card-3d reveal">
            {faqTeaser.map((f) => (
              <details key={f.question} className="wd-acc">
                <summary>{f.question}</summary>
                <div>{f.answer}</div>
              </details>
            ))}
            <div className="mt-6 flex flex-wrap gap-2">
              {faqGroups.map((g) => (
                <Link key={g.slug} href={`/faq/#${g.slug}`} className="chip">
                  {g.category} <span className="text-wd-faint">{g.items.length}</span>
                </Link>
              ))}
            </div>
            <Link href="/faq/" className="link-arrow mt-6">See all {faqTotal} questions</Link>
          </div>

          <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={waLink('Hello Wildora, I have a question before booking: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa btn-lg"
            >
              <WhatsAppIcon /> Ask on WhatsApp
            </a>
            <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
