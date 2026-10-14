import { useLocale, useTranslations } from 'next-intl';
import type { LegalDoc, LegalDocId } from '@/content/legal';
import { LOCALE_META } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';

/** A value from SITE.legal, or a visible marker when the owners have not supplied it yet. */
export function Tbc({ value, hint }: { value: string | null; hint: string }) {
  const t = useTranslations('common.legal');
  return value ? <>{value}</> : <span className="tbc">{t('tbc', { hint })}</span>;
}

/* Every legal page, with its label in common.footer.legal (the same list as the footer). */
const PAGES: { id: LegalDocId | 'credits'; href: string }[] = [
  { id: 'notice', href: '/legal/' },
  { id: 'terms', href: '/terms/' },
  { id: 'packageTravel', href: '/package-travel/' },
  { id: 'privacy', href: '/privacy/' },
  { id: 'cookies', href: '/cookies/' },
  { id: 'accessibility', href: '/accessibility/' },
  { id: 'credits', href: '/credits/' },
];

/* Documents are plain semantic markup; the styling of their lists, links and tables lives here. */
const BODY =
  'space-y-3 text-wd-muted leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 ' +
  '[&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-wd-ink [&_strong]:text-wd-ink [&_strong]:font-semibold ' +
  '[&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:text-wd-ink [&_th]:py-2 [&_th]:pr-4 [&_td]:py-2 [&_td]:pr-4 [&_tr]:border-b [&_tr]:border-[var(--wd-line)]';

const quiet = 'underline underline-offset-2 hover:text-wd-ink';

export default function LegalPage({ doc, fallback, current }: { doc: LegalDoc; fallback: boolean; current: LegalDocId }) {
  const t = useTranslations('common');
  const locale = useLocale();
  /* A fallback document is English inside a page in another language: mark its text as English
     (the translated notices, headings and links around it keep the page language). */
  const docLang = fallback ? LOCALE_META.en.htmlLang : undefined;
  /* The ISO date is midnight UTC, so format it in UTC to keep the same calendar day. */
  const updated = new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(doc.updated),
  );

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow">
          <h1 className="h-display mb-4" lang={docLang}>
            {doc.title}
          </h1>
          <p className="lede" lang={docLang}>
            {doc.lede}
          </p>
        </div>
      </section>
      <section className="wd-section--tight">
        <div className="wd-wrap wd-wrap--narrow space-y-6">
          {!SITE.legal.reviewed && (
            <p className="wd-note">
              <span>{t.rich('legal.draftNotice', { siteName: SITE.name, tbc: (chunks) => <span className="tbc">{chunks}</span> })}</span>
            </p>
          )}
          {fallback && (
            <p className="wd-note">
              <span>{t('legal.englishOnly')}</span>
            </p>
          )}

          <nav aria-labelledby="legal-contents" className="glass glass-pad">
            <h2 id="legal-contents" className="h-card mb-3">{t('legal.contents')}</h2>
            <ol className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2" lang={docLang}>
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-wd-muted hover:text-wd-ink underline-offset-2 hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.sections.map((s) => (
            /* scroll-mt keeps the heading clear of the fixed header when reached from the contents. */
            <section key={s.id} id={s.id} className="glass glass-pad scroll-mt-28" lang={docLang}>
              <h2 className="h-card mb-2">{s.title}</h2>
              <div className={BODY}>{s.content}</div>
            </section>
          ))}

          <p className="text-sm text-wd-faint">{t('legal.lastUpdated', { date: updated })}</p>

          <nav aria-labelledby="legal-see-also" className="text-sm text-wd-faint">
            <h2 id="legal-see-also" className="font-semibold text-wd-ink mb-2">{t('legal.seeAlso')}</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {PAGES.filter((p) => p.id !== current).map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className={quiet}>{t(`footer.legal.${p.id}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
