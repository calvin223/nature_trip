import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALE_META, type Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import { alternates } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import { getContent } from '@/lib/content';
import { img } from '@/lib/photos';
import { findPlace } from '@/lib/placePhotos';
import { blurUrl } from '@/lib/placeholders';
import { getDepartures, formatDate } from '@/lib/schedule';
import TripMap from '@/components/TripMap';
import RouteStory, { type RouteStop } from './RouteStory';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'journey' });
  return { title: t('meta.title'), description: t('meta.description'), alternates: alternates(locale, '/journey/') };
}

const TRIP_ID = 'western-ghats-endemics';

/* Stops group itinerary days; every title and description comes from lib/data.ts, so this page
   cannot drift from the trip page. Each stop shows a photograph of that place (lib/placePhotos.ts). */
const STOPS: { days: number[]; place: string }[] = [
  { days: [1, 2], place: 'thattekad' },
  { days: [3], place: 'pampadum-shola' },
  { days: [4], place: 'eravikulam' },
  { days: [5], place: 'chinnar' },
  { days: [6, 7], place: 'valparai' },
  { days: [8], place: 'ooty' },
  { days: [9], place: 'mukurthi' },
  { days: [10], place: 'bandipur' },
];

export default async function JourneyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'journey' });
  const difficulty = await getTranslations({ locale, namespace: 'tripDetail.difficulty' });
  const trip = getContent(locale).trips.find((x) => x.id === TRIP_ID);
  if (!trip) throw new Error(`journey/page.tsx: trip "${TRIP_ID}" not found in lib/data.ts`);
  const dayOf = (n: number) => {
    const d = trip.itinerary.find((x) => x.day === n);
    if (!d) throw new Error(`journey/page.tsx: ${TRIP_ID} has no day ${n}`);
    return d;
  };

  /* All text is resolved here, so the client RouteStory needs no messages of its own. */
  const stops: RouteStop[] = STOPS.map(({ days, place }) => {
    const p = findPlace(place, locale);
    if (!p) throw new Error(`journey/page.tsx: place photo "${place}" not found in lib/placePhotos.ts`);
    const first = dayOf(days[0]);
    return {
      label: days.length > 1 ? t('story.days', { first: days[0], last: days[days.length - 1] }) : t('story.day', { day: days[0] }),
      title: first.title,
      body: days.map((n) => dayOf(n).description).join(' '),
      src: img(p.src),
      thumb: img(p.thumb),
      alt: p.alt,
      caption: p.caption,
      credit: t('story.photoCredit', { author: p.credit.author, licence: p.credit.licence }),
      blur: blurUrl(p.src),
    };
  });
  const next = getDepartures(trip, 2);
  const dates = new Intl.ListFormat(LOCALE_META[locale].htmlLang, { type: 'conjunction' }).format(next.map((d) => formatDate(d, locale)));

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl">
            <h1 className="h-display mb-5">{t('head.title')}</h1>
            <p className="lede">{t('head.lede', { trip: trip.title })}</p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-wd-muted">
              <span>{trip.duration}</span>
              <span>{difficulty(trip.difficulty)}</span>
              <span>{trip.groupSize}</span>
              <span>{trip.season}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="wd-wrap">
          <RouteStory stops={stops} />
          <p className="mt-10 text-xs text-wd-faint">
            {t.rich('story.photoNote', {
              link: (chunks) => (
                <Link href="/credits/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>
              ),
            })}
          </p>
        </div>
      </section>

      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('map.title')}</h2>
          </div>
          <TripMap tripId={TRIP_ID} />
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h2 className="h-section">{t('cta.title')}</h2>
          <p className="lede mt-4">{t('cta.nextDepartures', { dates })}</p>
          <div className="mt-8 flex justify-center">
            <Link href={`/trips/${TRIP_ID}/#dates`} className="btn btn-primary btn-lg">{t('cta.button')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
