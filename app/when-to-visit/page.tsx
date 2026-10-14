import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { CONFIRMED_AT_BOOKING, trips, wildlifeDisclaimer, type Trip } from '@/lib/data';
import { describeDepartureRule } from '@/lib/schedule';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

/* Everything seasonal on this page is computed from each trip's `seasonMonths`, `season` and
   `seasonNote` in lib/data.ts, so it cannot drift from the trip pages and departure dates. */

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Our home ground leads; the rest keep their lib/data.ts order. */
const HOME_TRIP_ID = 'western-ghats-endemics';
const ordered: Trip[] = [
  ...trips.filter((t) => t.id === HOME_TRIP_ID),
  ...trips.filter((t) => t.id !== HOME_TRIP_ID),
];

/* Why-notes for trips that carry no `seasonNote`, taken from the FAQ answer
   "When is the best time to go?" in lib/data.ts. */
const EXTRA_NOTE: Record<string, string> = {
  'monsoon-rainforest-nights':
    'It runs in the south-west monsoon, when frogs and reptiles are most active and the forest is at its greenest.',
};

const seasonLabel = (t: Trip) => t.season.replace(/\s*\(.*\)\s*$/, '');

export const metadata: Metadata = {
  title: 'When to Visit',
  description:
    'When each Wildora trip runs, month by month, and why. ' +
    ordered.map((t) => `${t.title}: ${seasonLabel(t)}`).join('; ') +
    '.',
};

function MonthStrip({ months }: { months: number[] }) {
  const on = new Set(months);
  return (
    <ol className="grid grid-cols-12 gap-1" aria-hidden="true">
      {MONTH_SHORT.map((m, i) => {
        const inSeason = on.has(i + 1);
        return (
          <li
            key={m}
            className={`rounded-md py-2 text-center text-[0.62rem] sm:text-[0.7rem] font-semibold tracking-wide transition-colors ${
              inSeason
                ? 'bg-wd-lime text-wd-night shadow-[0_0_16px_-2px_rgba(154,209,75,0.55)]'
                : 'bg-wd-ink/[0.04] text-wd-faint border border-wd-ink/5'
            }`}
          >
            <span className="sm:hidden">{m[0]}</span>
            <span className="hidden sm:inline">{m}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function WhenToVisitPage() {
  const home = ordered.find((t) => t.id === HOME_TRIP_ID);
  if (!home) throw new Error(`when-to-visit/page.tsx: trip "${HOME_TRIP_ID}" not found in lib/data.ts`);
  const confirmedLater = ordered.filter(
    (t) => t.startPoint === CONFIRMED_AT_BOOKING || t.endPoint === CONFIRMED_AT_BOOKING,
  );

  const byMonth = MONTH_LONG.map((name, i) => ({
    name,
    running: ordered.filter((t) => t.seasonMonths.includes(i + 1)),
  }));

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <p className="eyebrow">When to visit</p>
          <h1 className="h-display mb-5">
            The right trip for <span className="accent-text">the month you can travel</span>
          </h1>
          <p className="lede">
            Each of our trips runs only in the months that suit its wildlife, its weather and the parks&apos; rules. Here
            is when each one departs, and why.
          </p>
        </div>
      </section>

      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">At a glance</p>
            <h2 className="h-section">Trip seasons</h2>
            <p>Highlighted months are the months each trip runs. Every departure starts and finishes inside them.</p>
          </div>

          <div className="grid gap-5 float-grid">
            {ordered.map((t, i) => {
              const note = t.seasonNote ?? EXTRA_NOTE[t.id];
              return (
                <article
                  key={t.id}
                  className="glass card-3d reveal glass-pad grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:items-center"
                  style={{ '--d': `${i * 90}ms` } as CSSProperties}
                  aria-labelledby={`season-${t.id}`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {t.id === HOME_TRIP_ID && <span className="chip chip-sun">Our home ground</span>}
                      {t.region && <span className="text-xs font-semibold uppercase tracking-[0.18em] text-wd-lime">{t.region}</span>}
                    </div>
                    <h3 id={`season-${t.id}`} className="h-card mb-3">
                      <Link href={`/trips/${t.id}/`} className="hover:text-wd-leaf transition-colors">
                        {t.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip">{t.season}</span>
                      <span className="chip">{t.duration}</span>
                      <span className="chip">{t.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <MonthStrip months={t.seasonMonths} />
                    <p className="text-sm text-wd-ink">{describeDepartureRule(t)}.</p>
                    {note && <p className="text-sm text-wd-muted leading-relaxed">{note}</p>}
                    <Link href={`/trips/${t.id}/`} className="link-arrow text-sm self-start">
                      Trip details &amp; next dates
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Month by month</p>
            <h2 className="h-section">What runs when</h2>
            <p>Pick the month you can travel.</p>
          </div>
          <div className="grid gap-4 grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 float-grid">
            {byMonth.map((m, i) => (
              <article
                key={m.name}
                className="glass glass-pad card-3d reveal flex flex-col gap-3"
                style={{ '--d': `${(i % 4) * 70}ms` } as CSSProperties}
              >
                <h3 className="font-display text-xl font-semibold text-white flex items-center justify-between gap-2">
                  {m.name}
                  <span className="text-xs font-sans font-semibold text-wd-faint tabular-nums">
                    {m.running.length} trip{m.running.length === 1 ? '' : 's'}
                  </span>
                </h3>
                {m.running.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {m.running.map((t) => (
                      <li key={t.id} className="flex gap-2.5">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full flex-none ${t.id === HOME_TRIP_ID ? 'bg-wd-sun' : 'bg-wd-lime'}`}
                          aria-hidden="true"
                        />
                        <Link href={`/trips/${t.id}/`} className="text-wd-muted hover:text-white transition-colors">
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-wd-faint">No fixed departures. Ask us about a private trip.</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad reveal">
            <p className="eyebrow">Before you book</p>
            <h2 className="h-section mb-6">Planning your dates</h2>
            <ul className="space-y-4 text-wd-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                <span>
                  <span className="text-wd-ink font-semibold">{home.title}.</span> Starts at {home.startPoint} Ends at{' '}
                  {home.endPoint}
                </span>
              </li>
              {confirmedLater.length > 0 && (
                <li className="flex gap-3">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                  <span>
                    For the {confirmedLater.map((t) => t.title).join(', ').replace(/, ([^,]*)$/, ' and $1')}, we confirm the
                    start and end points when you book.
                  </span>
                </li>
              )}
              <li className="flex gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                <span>
                  You arrange your own travel to the start and home from the end, including flights, trains and your
                  visa.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-wd-lime flex-none" aria-hidden="true" />
                <span>
                  Be ready for the weather: late-May days in central India can pass 40&nbsp;°C, monsoon trips are wet,
                  and early mornings at altitude are cold.
                </span>
              </li>
            </ul>
            <Link href="/practical/" className="link-arrow mt-6">
              Plan &amp; prepare
            </Link>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad text-center reveal">
            <h2 className="h-section mb-4">Not sure which month suits you?</h2>
            <p className="lede mb-6 max-w-2xl mx-auto">
              Send us your dates and the wildlife you hope to see. We will tell you which trip fits, or whether a private
              trip would suit better.
            </p>
            <p className="wd-note text-left max-w-2xl mx-auto mb-8">{wildlifeDisclaimer}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink("Hello Wildora, could you help me choose the right month for a trip?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <Link href="/trips/" className="btn btn-primary btn-lg">
                See trips &amp; dates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
