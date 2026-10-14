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

const GRADE_TONE: Record<Trip['difficulty'], string> = { Easy: 'text-wd-ink', Moderate: 'text-wd-sun', Challenging: 'text-wd-trogon' };
const LEVELS = ['Easy', 'Moderate', 'Challenging'] as const;
const PACKING_LISTS = ['essential', 'extras'] as const;

/** A titled row: the term on the left, its detail on the right, ruled above. */
function Row({ title, mark, children }: { title: string; mark?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-[var(--wd-line)] py-6 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-10">
      <dt>
        <span className="font-semibold text-wd-ink">{title}</span>
        {mark && <span className="mt-1 block text-sm font-semibold text-wd-trogon">{mark}</span>}
      </dt>
      <dd className="max-w-[65ch] leading-relaxed text-wd-muted">{children}</dd>
    </div>
  );
}

function SectionHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="wd-head">
      <h2 className="h-section">{title}</h2>
      {children && <p>{children}</p>}
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
  const grades = LEVELS.map((level) => ({ level, label: difficulty(level), tone: GRADE_TONE[level], body: gradeText(level, locale) }));
  const faqGroups = groupFaqs(locale);
  const faqTotal = faqGroups.reduce((n, g) => n + g.items.length, 0);
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
            <ol className="mt-4 space-y-2.5">
              {requiredHealth.map((item, i) => (
                <li key={item.title} className="flex items-baseline gap-3">
                  <span className="w-4 flex-none font-display text-lg font-semibold text-wd-sun tabular-nums">{i + 1}</span>
                  <span className="font-medium text-wd-ink">{item.title}</span>
                </li>
              ))}
            </ol>
            <a href="#health" className="link-arrow mt-5 text-sm">{t('essentials.link')}</a>
          </aside>
        </div>
      </section>

      <PageNav
        title={t('nav.title')}
        links={[
          { href: '#responsibilities', label: t('nav.responsibilities') },
          { href: '#health', label: t('nav.health') },
          { href: '#difficulty', label: t('nav.difficulty') },
          { href: '#packing', label: t('nav.packing') },
          { href: '#included', label: t('nav.included') },
          { href: '#faq', label: t('nav.faq') },
        ]}
      />

      {/* (a) What you are responsible for */}
      <section id="responsibilities" className="wd-section">
        <div className="wd-wrap">
          <SectionHead title={t('responsibilities.title')}>{t('responsibilities.intro')}</SectionHead>
          <dl className="border-b border-[var(--wd-line)]">
            {guestResponsibilities.map((item) => (
              <Row key={item.title} title={item.title}>{item.detail}</Row>
            ))}
          </dl>
        </div>
      </section>

      {/* (b) Health, insurance & medical information */}
      <section id="health" className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <SectionHead title={t('health.title')}>{t('health.intro')}</SectionHead>
          <dl className="border-b border-[var(--wd-line)]">
            {requiredHealth.map((item) => (
              <Row key={item.title} title={item.title} mark={t('health.required')}>{item.detail}</Row>
            ))}
            {otherHealth.map((item) => (
              <Row key={item.title} title={item.title}>{item.detail}</Row>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-wd-muted max-w-xl">{t('health.notSure')}</p>
            <a
              href={waLink(t('health.whatsappMessage'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa self-start sm:ml-auto"
            >
              <WhatsAppIcon /> {t('health.ask')}
            </a>
          </div>
        </div>
      </section>

      {/* (c) Difficulty grades */}
      <section id="difficulty" className="wd-section">
        <div className="wd-wrap">
          <SectionHead title={t('difficulty.title')}>{t('difficulty.intro')}</SectionHead>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
            {grades.map((g) => {
              const graded = trips.filter((t) => t.difficulty === g.level);
              return (
                <article key={g.level} className="border-t border-[var(--wd-line-strong)] pt-5">
                  <h3 className={`h-card ${g.tone}`}>{g.label}</h3>
                  <p className="mt-3 leading-relaxed text-wd-muted">{g.body}</p>
                  {graded.length > 0 ? (
                    <ul className="mt-5 space-y-1.5 text-sm">
                      {graded.map((t) => (
                        <li key={t.id}>
                          <Link href={`/trips/${t.id}/`} className="font-medium text-wd-ink underline decoration-[var(--wd-line-strong)] underline-offset-4 hover:text-wd-lime hover:decoration-current">
                            {t.title}
                          </Link>
                          <span className="text-wd-faint">, {t.duration}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 text-sm text-wd-faint">{t('difficulty.none', { grade: g.label })}</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* (c) Packing */}
      <section id="packing" className="wd-section !pt-0">
        <div className="wd-wrap">
          <SectionHead title={t('packing.title')}>
            {t.rich('packing.intro', { link: (chunks) => <Link href="/trips/" className="link-arrow">{chunks}</Link> })}
          </SectionHead>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {PACKING_LISTS.map((list) => (
              <article key={list} className="border-t border-[var(--wd-line-strong)] pt-5">
                <h3 className="h-card">{t(`packing.${list}.title`)}</h3>
                <ul className="mt-4 space-y-2.5">
                  {(t.raw(`packing.${list}.items`) as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3 leading-relaxed text-wd-muted">
                      <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 flex-none bg-wd-faint" />
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
      <section id="included" className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <SectionHead title={t('included.title')}>{t('included.intro')}</SectionHead>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {trips.map((t) => (
              <article key={t.id} className="flex flex-col border-t border-[var(--wd-line-strong)] pt-5">
                <h3 className="h-card">
                  <Link href={`/trips/${t.id}/`} className="hover:text-wd-lime transition-colors">{t.title}</Link>
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-wd-muted">
                  {t.included.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-[0.6rem] h-px w-2.5 flex-none bg-wd-faint" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-2 border-t border-[var(--wd-line-strong)] pt-6 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-10">
            <h3 className="h-card">{t('included.notIncluded')}</h3>
            <p className="max-w-[65ch] leading-relaxed text-wd-muted">
              {t.rich('included.notIncludedBody', { link: (chunks) => <a href="#responsibilities" className="link-arrow">{chunks}</a> })}
            </p>
          </div>
        </div>
      </section>

      {/* (e) FAQ teaser: the full list lives on /faq/ */}
      <section id="faq" className="wd-section">
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
