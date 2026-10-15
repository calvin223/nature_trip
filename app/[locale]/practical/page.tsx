import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { alternates } from '@/i18n/metadata';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import PageNav from '@/components/PageNav';
import { getContent } from '@/lib/content';
import { healthAndSafety as englishHealth, type Trip } from '@/lib/data';
import { waLink } from '@/lib/site';
import { groupFaqs } from '../faq/faq-utils';
import { gradeText } from '../trips/tripFit';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'practical.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/practical/') };
}

/* The three health items that are conditions of booking (owner brief, points 6-7).
   Matched by English title (lib/data.ts), so a reorder cannot move the "Required" mark onto
   the wrong item, and a rename fails the build instead of silently losing the emphasis.
   Indexes, so they pick the same items out of a translation. */
const REQUIRED_MATCHERS = [/insurance/i, /allerg/i, /medical condition/i];
const REQUIRED_INDEXES = REQUIRED_MATCHERS.map((re) => {
  const i = englishHealth.findIndex((h) => re.test(h.title));
  if (i < 0) {
    throw new Error(`app/practical: no healthAndSafety item title matches ${re}; update REQUIRED_MATCHERS to match lib/data.ts`);
  }
  return i;
});

/* Each grade's place on a three-step scale, and the colour of its filled steps. */
const LEVELS = [
  { level: 'Easy', steps: 1, tone: 'text-wd-ink', fill: 'bg-wd-fern' },
  { level: 'Moderate', steps: 2, tone: 'text-wd-sun', fill: 'bg-[var(--wd-sun-soft)]' },
  { level: 'Challenging', steps: 3, tone: 'text-wd-trogon', fill: 'bg-wd-trogon' },
] as const satisfies readonly { level: Trip['difficulty']; steps: number; tone: string; fill: string }[];
const PACKING_LISTS = ['essential', 'extras'] as const;

/* The page follows the order a guest acts in: enquire, book, prepare, travel. Ids keep the old
   anchors working: #health (trip pages, custom groups), #difficulty and #packing (trip pages). */
type StageKey = 'enquire' | 'book' | 'leave' | 'trip';
const STAGES: { key: StageKey; id: string; icon: ReactNode }[] = [
  { key: 'enquire', id: 'enquire', icon: <path d="M4 5h16v11H9l-5 4V5Z" /> },
  { key: 'book', id: 'health', icon: <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Zm-3 9 2.2 2.2L15.5 10" /> },
  { key: 'leave', id: 'before', icon: <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 7h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Zm3 6h8" /> },
  { key: 'trip', id: 'on-trip', icon: <path d="M6.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm11 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM10 16.5h4M5 13.5 7 5h3l1 8M19 13.5 17 5h-3l-1 8" /> },
];

/** One stage on the trail: its marker and heading on the left (sticky on wide screens), the content on the right. */
function Stage({ id, icon, title, intro, children }: { id: string; icon: ReactNode; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={id} className="trail__stage" aria-labelledby={`${id}-title`}>
      <div className="trail__head">
        <span className="trail__marker" aria-hidden="true">
          {/* Sized here as well as in CSS, so a missing stylesheet cannot blow the icon up to the column width. */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </span>
        <div>
          <h2 id={`${id}-title`} className="h-section">{title}</h2>
          <p className="mt-3 max-w-md leading-relaxed text-wd-muted">{intro}</p>
        </div>
      </div>
      <div className="trail__body">{children}</div>
    </section>
  );
}

/** A short titled note: the page's text block inside a stage. */
function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="h-card">{title}</h3>
      <p className="mt-2 leading-relaxed text-wd-muted">{children}</p>
    </div>
  );
}

export default async function PracticalPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'practical' });
  const difficulty = await getTranslations({ locale, namespace: 'tripDetail.difficulty' });
  const { trips, guestResponsibilities, healthAndSafety } = getContent(locale);
  const requiredHealth = REQUIRED_INDEXES.map((i) => healthAndSafety[i]);
  const otherHealth = healthAndSafety.filter((_, i) => !REQUIRED_INDEXES.includes(i));
  const faqGroups = groupFaqs(locale);
  const faqTotal = faqGroups.reduce((n, g) => n + g.items.length, 0);

  const content: Record<StageKey, ReactNode> = {
    enquire: (
      <>
        <div id="difficulty" className="grid gap-x-10 gap-y-10 md:grid-cols-3">
          {LEVELS.map((g) => {
            const graded = trips.filter((tr) => tr.difficulty === g.level);
            const label = difficulty(g.level);
            return (
              <article key={g.level}>
                <span className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={`h-1.5 w-8 rounded-full ${s <= g.steps ? g.fill : 'bg-wd-canopy'}`} />
                  ))}
                </span>
                <h3 className={`h-card mt-4 ${g.tone}`}>{label}</h3>
                <p className="mt-2 leading-relaxed text-wd-muted">{gradeText(g.level, locale)}</p>
                {graded.length > 0 ? (
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {graded.map((tr) => (
                      <li key={tr.id}>
                        <Link href={`/trips/${tr.id}/`} className="font-medium text-wd-ink underline decoration-[var(--wd-line-strong)] underline-offset-4 hover:text-wd-lime hover:decoration-current">
                          {tr.title}
                        </Link>
                        <span className="text-wd-faint">, {tr.duration}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-wd-faint">{t('difficulty.none', { grade: label })}</p>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-wd-deep p-5 sm:flex-row sm:items-center sm:p-6">
          <p className="max-w-xl text-wd-ink">{t('health.notSure')}</p>
          <a href={waLink(t('health.whatsappMessage'))} target="_blank" rel="noopener noreferrer" className="btn btn-wa self-start sm:ml-auto sm:self-center no-print">
            <WhatsAppIcon /> {t('health.ask')}
          </a>
        </div>
      </>
    ),
    book: (
      <dl className="border-b border-[var(--wd-line)]">
        {requiredHealth.map((item) => (
          <div key={item.title} className="grid gap-2 border-t border-[var(--wd-line)] py-6 first:pt-0 first:border-t-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-8">
            <dt>
              <span className="h-card">{item.title}</span>
              <span className="mt-1 block text-sm font-semibold text-wd-trogon">{t('health.required')}</span>
            </dt>
            <dd className="leading-relaxed text-wd-muted">{item.detail}</dd>
          </div>
        ))}
      </dl>
    ),
    leave: (
      <>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {guestResponsibilities.map((item) => (
            <Note key={item.title} title={item.title}>{item.detail}</Note>
          ))}
        </div>
        <div id="packing" className="mt-12 border-t border-[var(--wd-line-strong)] pt-8">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-wd-ink">{t('packing.title')}</h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-wd-muted">
            {t.rich('packing.intro', { link: (chunks) => <Link href="/trips/" className="link-arrow">{chunks}</Link> })}
          </p>
          <p className="mt-1 text-sm text-wd-faint no-print">{t('packing.hint')}</p>
          <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {PACKING_LISTS.map((list) => (
              <fieldset key={list}>
                <legend className="h-card">{t(`packing.${list}.title`)}</legend>
                <ul className="mt-3">
                  {(t.raw(`packing.${list}.items`) as string[]).map((item) => (
                    <li key={item}>
                      <label className="pack-item">
                        <input type="checkbox" />
                        <span>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ))}
          </div>
        </div>
      </>
    ),
    trip: (
      <>
        <h3 className="h-card">{t('included.title')}</h3>
        {/* One trip open at a time (details sharing a name); the first starts open. All print open. */}
        <div className="mt-3 border-t border-[var(--wd-line)]">
          {trips.map((tr, i) => (
            <details key={tr.id} name="included" open={i === 0} className="wd-acc">
              <summary>{tr.title}</summary>
              <div>
                <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                  {tr.included.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-[0.7rem] h-px w-2.5 flex-none bg-wd-faint" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/trips/${tr.id}/`} className="link-arrow mt-4 text-sm no-print">{t('included.seeTrip')}</Link>
              </div>
            </details>
          ))}
        </div>
        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {otherHealth.map((item) => (
            <Note key={item.title} title={item.title}>{item.detail}</Note>
          ))}
          <div>
            <h3 className="h-card">{t('included.notIncluded')}</h3>
            <p className="mt-2 leading-relaxed text-wd-muted">
              {t.rich('included.notIncludedBody', { link: (chunks) => <a href="#before" className="link-arrow">{chunks}</a> })}
            </p>
          </div>
        </div>
      </>
    ),
  };

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h1 className="h-display mb-5">{t('head.title')}</h1>
            <p className="lede max-w-2xl">{t('head.lede')}</p>
          </div>

          <aside className="rounded-2xl bg-wd-deep p-6 sm:p-7" aria-labelledby="essentials-title">
            <h2 id="essentials-title" className="h-card">{t('essentials.title')}</h2>
            <ul className="mt-4 space-y-2.5">
              {requiredHealth.map((item) => (
                <li key={item.title} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="h-1.5 w-1.5 flex-none -translate-y-0.5 rounded-full bg-wd-trogon" />
                  <span className="font-medium text-wd-ink">{item.title}</span>
                </li>
              ))}
            </ul>
            <a href="#health" className="link-arrow mt-5 text-sm">{t('essentials.link')}</a>
          </aside>
        </div>
      </section>

      <PageNav
        title={t('nav.title')}
        links={[...STAGES.map((s) => ({ href: `#${s.id}`, label: t(`nav.${s.key}`) })), { href: '#faq', label: t('nav.faq') }]}
      />

      <div className="wd-wrap trail">
        {STAGES.map((s) => (
          <Stage key={s.key} id={s.id} icon={s.icon} title={t(`stages.${s.key}.title`)} intro={t(`stages.${s.key}.intro`)}>
            {content[s.key]}
          </Stage>
        ))}
      </div>

      {/* The full list lives on /faq/ */}
      <section id="faq" className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('faq.title')}</h2>
            <p>
              {t.rich('faq.intro', {
                answers: faqTotal,
                topics: faqGroups.length,
                link: (chunks) => <Link href="/faq/" className="link-arrow">{chunks}</Link>,
              })}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {faqGroups.map((g) => (
              <li key={g.slug}>
                <Link href={`/faq/#${g.slug}`} className="text-wd-muted hover:text-wd-ink">
                  {g.label} <span className="text-wd-faint tabular-nums">{g.items.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
