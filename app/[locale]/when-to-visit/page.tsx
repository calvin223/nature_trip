import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import SeasonLegend from '@/components/SeasonLegend';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import type { Trip } from '@/lib/data';
import { describeDepartureRule } from '@/lib/schedule';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

/* Everything seasonal on this page is computed from each trip's `seasonMonths`, `season` and
   `seasonNote` in lib/data.ts, so it cannot drift from the trip pages and departure dates. */

/** Our home ground leads; the rest keep their lib/data.ts order. */
const HOME_TRIP_ID = 'western-ghats-endemics';
function orderedTrips(locale: Locale): Trip[] {
  const { trips } = getContent(locale);
  return [...trips.filter((t) => t.id === HOME_TRIP_ID), ...trips.filter((t) => t.id !== HOME_TRIP_ID)];
}


export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'whenToVisit.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/when-to-visit/') };
}

function MonthStrip({ months }: { months: number[] }) {
  const names = useTranslations('whenToVisit').raw('monthStrip.months') as string[];
  const on = new Set(months);
  return (
    <ol className="grid grid-cols-12 gap-1" aria-hidden="true">
      {names.map((m, i) => {
        const inSeason = on.has(i + 1);
        return (
          <li
            key={m}
            className={`rounded py-2 text-center text-[0.62rem] sm:text-[0.7rem] font-semibold ${
              inSeason ? 'bg-wd-emerald text-white' : 'bg-wd-canopy text-wd-muted'
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

export default async function WhenToVisitPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'whenToVisit' });
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <h1 className="h-display mb-5 max-w-4xl">{t('hero.title')}</h1>
          <p className="lede max-w-2xl">{t('hero.lede')}</p>
        </div>
      </section>

      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <SeasonLegend className="mb-6" />
          <div className="border-b border-[var(--wd-line)]">
            {orderedTrips(locale).map((tr) => (
              <article
                key={tr.id}
                className="grid gap-5 border-t border-[var(--wd-line)] py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-10"
                aria-labelledby={`season-${tr.id}`}
              >
                <div>
                  {tr.region && <p className="text-sm font-medium text-wd-lime">{tr.region}</p>}
                  <h2 id={`season-${tr.id}`} className="h-card mt-1">
                    <Link href={`/trips/${tr.id}/`} className="underline decoration-[var(--wd-line-strong)] underline-offset-4 hover:text-wd-lime hover:decoration-current">
                      {tr.title}
                    </Link>
                  </h2>
                  {tr.id === HOME_TRIP_ID && <p className="chip chip-sun mt-2">{t('homeGround')}</p>}
                </div>
                <div className="flex flex-col gap-3">
                  <MonthStrip months={tr.seasonMonths} />
                  <p className="text-sm text-wd-ink">{describeDepartureRule(tr, locale)}.</p>
                  {tr.seasonNote && <p className="text-sm leading-relaxed text-wd-muted">{tr.seasonNote}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h2 className="h-section">{t('cta.title')}</h2>
          <p className="lede mt-4 max-w-2xl mx-auto">{t('cta.lede')}</p>
          <div className="mt-8 flex justify-center">
            <a
              href={waLink(t('cta.whatsappMessage'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa btn-lg"
            >
              <WhatsAppIcon /> {t('cta.askWhatsApp')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
