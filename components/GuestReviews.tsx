import { useTranslations } from 'next-intl';
import type { Review } from '@/lib/data';

/* Layout preview only, shown in development while lib/data.ts has no real reviews. Never
   shipped: the production build renders nothing until real reviews exist. */
const SAMPLES: Review[] = [
  {
    name: 'Sample guest',
    country: 'Denmark',
    trip: 'Central India Big Cats',
    rating: 5,
    text: 'We wanted more than one park and Wildora built a route that made sense: forests, birds, big mammals, and enough rest between drives.',
  },
  {
    name: 'Sample guest',
    country: 'Italy',
    trip: 'Monsoon Rainforest Nights',
    rating: 5,
    text: 'The monsoon rainforest nights were unforgettable. Safe, expertly led, and the photography guidance was worth the trip on its own.',
  },
  {
    name: 'Sample guest',
    country: 'United Kingdom',
    trip: 'Western Ghats Endemics',
    rating: 5,
    text: 'A rich wildlife experience without heavy lectures. The guide brought habitats, behaviour and conservation stories alive in the field.',
  },
];

function Stars({ n }: { n: number }) {
  const t = useTranslations('home.reviews');
  return (
    <p className="flex gap-0.5 text-wd-ink" aria-label={t('rated', { rating: n })}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i < n ? '' : 'opacity-20'}`} fill="currentColor">
          <path d="M10 1.6l2.5 5.4 5.9.6-4.4 4 1.2 5.8L10 14.5 4.8 17.4 6 11.6 1.6 7.6l5.9-.6z" />
        </svg>
      ))}
    </p>
  );
}

/* "What our guests say": quotes set large, separated by rules rather than boxed in cards.
   Stars are ink, not gold (gold stars read as cheap in travel). */
export default function GuestReviews({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('home.reviews');
  const sample = reviews.length === 0;
  if (sample && process.env.NODE_ENV === 'production') return null;
  const shown = sample ? SAMPLES : reviews;

  return (
    <section className="wd-section" aria-labelledby="reviews-title">
      <div className="wd-wrap">
        <div className="wd-head">
          <h2 id="reviews-title" className="h-section">{t('title')}</h2>
          {sample && (
            <p className="!text-wd-trogon !text-sm font-medium">{t('preview')}</p>
          )}
        </div>
        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((r, i) => (
            <li key={`${r.name}-${i}`} className="border-t border-[var(--wd-line-strong)] pt-6">
              <figure className="m-0 flex h-full flex-col">
                <Stars n={r.rating} />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-wd-ink">
                  {t('quote', { text: r.text })}
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-semibold text-wd-ink">{r.name}</span>
                  <span className="block text-wd-muted">
                    {r.country}, {r.trip}
                    {r.travelled ? `, ${r.travelled}` : ''}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
