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

/* One quote: a large green opening mark, the guest's own paragraphs, then who said it.
   In the featured quote the first paragraph is set large as the lead. */
function Quote({ r, featured }: { r: Review; featured?: boolean }) {
  const [lead, ...rest] = r.text.split('\n\n');
  return (
    <figure className="m-0">
      {/* Serif mark: the display face draws “ as two straight slashes. */}
      <span aria-hidden="true" className="block h-8 font-serif text-7xl leading-none text-wd-lime select-none">“</span>
      {r.rating != null && <div className="mt-4"><Stars n={r.rating} /></div>}
      <blockquote className="mt-4 text-wd-ink">
        <p className={featured ? 'font-display text-2xl md:text-[1.75rem] font-semibold leading-snug tracking-[-0.015em]' : 'text-lg leading-relaxed'}>
          {lead}
        </p>
        {rest.map((p, i) => (
          <p key={i} className="mt-4 text-lg leading-relaxed">{p}</p>
        ))}
      </blockquote>
      <figcaption className="mt-6 flex items-start gap-3 text-sm">
        <span aria-hidden="true" className="mt-[0.6rem] h-px w-8 shrink-0 bg-wd-lime" />
        <span>
          <span className="block font-semibold text-wd-ink">{r.name}</span>
          <span className="block text-wd-muted">
            {/* With a role, the section lede already names the trip. */}
            {(r.role ? [r.role, r.travelled] : [r.country, r.trip, r.travelled]).filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* "What our guests say": the first review featured in a wide column, the rest stacked beside
   it under rules. No cards. Stars, when a guest gave a rating, are ink, not gold. */
export default function GuestReviews({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('home.reviews');
  const sample = reviews.length === 0;
  if (sample && process.env.NODE_ENV === 'production') return null;
  const [first, ...rest] = sample ? SAMPLES : reviews;

  return (
    <section className="wd-section" aria-labelledby="reviews-title">
      <div className="wd-wrap">
        <div className="wd-head">
          <h2 id="reviews-title" className="h-section">{t('title')}</h2>
          {sample
            ? <p className="!text-wd-trogon !text-sm font-medium">{t('preview')}</p>
            : <p>{t('lede')}</p>}
        </div>
        <div className="grid gap-12 border-t border-[var(--wd-line-strong)] pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Quote r={first} featured />
          </div>
          {rest.length > 0 && (
            <ul className="space-y-10 border-t border-[var(--wd-line)] pt-10 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              {rest.map((r, i) => (
                <li key={`${r.name}-${i}`} className={i > 0 ? 'border-t border-[var(--wd-line)] pt-10' : ''}>
                  <Quote r={r} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
