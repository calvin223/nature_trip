import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { waLink } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'schools.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/schools/') };
}

type Note = { title: string; body: string };

/** Columns of short titled notes, each ruled above: the page's one repeating pattern. */
function Notes({ items, cols }: { items: Note[]; cols: string }) {
  return (
    <div className={`grid gap-x-10 gap-y-10 ${cols}`}>
      {items.map((g) => (
        <article key={g.title} className="border-t border-[var(--wd-line-strong)] pt-5">
          <h3 className="h-card">{g.title}</h3>
          <p className="mt-2 leading-relaxed text-wd-muted">{g.body}</p>
        </article>
      ))}
    </div>
  );
}

function Actions() {
  const t = useTranslations('schools.actions');
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a href={waLink(t('whatsappMessage'))} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
        <WhatsAppIcon /> {t('whatsapp')}
      </a>
      <Link href="/contact/" className="btn btn-ghost btn-lg">{t('enquiry')}</Link>
    </div>
  );
}

export default async function CustomGroupsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'schools' });
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl">
            <h1 className="h-display mb-5">{t('hero.title')}</h1>
            <p className="lede">{t('hero.lede')}</p>
            <Actions />
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('groupTypes.title')}</h2>
            <p>{t('groupTypes.intro')}</p>
          </div>
          <Notes items={t.raw('groupTypes.items') as Note[]} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('customise.title')}</h2>
            <p>{t('customise.intro')}</p>
          </div>
          <dl className="border-b border-[var(--wd-line)]">
            {(t.raw('customise.options') as { term: string; detail: string }[]).map(({ term, detail }) => (
              <div key={term} className="grid gap-2 border-t border-[var(--wd-line)] py-6 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-10">
                <dt className="font-semibold text-wd-ink">{term}</dt>
                <dd className="max-w-[65ch] leading-relaxed text-wd-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="h-section">{t('sampleDay.title')}</h2>
            <p className="lede mt-4">{t('sampleDay.lede')}</p>
          </div>
          <table className="w-full text-left">
            <caption className="sr-only-wd">{t('sampleDay.caption')}</caption>
            <thead className="sr-only-wd">
              <tr>
                <th scope="col">{t('sampleDay.timeHeader')}</th>
                <th scope="col">{t('sampleDay.whatHeader')}</th>
              </tr>
            </thead>
            <tbody>
              {(t.raw('sampleDay.rows') as { time: string; what: string }[]).map(({ time, what }) => (
                <tr key={time} className="border-t border-[var(--wd-line)] last:border-b">
                  <th scope="row" className="w-36 py-4 pr-6 align-top font-semibold text-wd-ink whitespace-nowrap tabular-nums">{time}</th>
                  <td className="py-4 leading-relaxed text-wd-muted">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('academic.title')}</h2>
            <p>
              {t.rich('academic.intro', {
                link: (chunks) => <Link href="/experts/" className="link-arrow">{chunks}</Link>,
              })}
            </p>
          </div>
          <Notes items={t.raw('academic.items') as Note[]} cols="md:grid-cols-3" />
        </div>
      </section>

      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('safety.title')}</h2>
            <p>{t('safety.intro')}</p>
          </div>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            <article className="border-t border-[var(--wd-line-strong)] pt-5">
              <h3 className="h-card">{t('safety.arrangeTitle')}</h3>
              <ul className="mt-4 space-y-2.5">
                {(t.raw('safety.logistics') as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-3 leading-relaxed text-wd-muted">
                    <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 flex-none bg-wd-faint" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="border-t border-[var(--wd-line-strong)] pt-5">
              <h3 className="h-card">{t('safety.healthTitle')}</h3>
              <p className="mt-1 text-sm font-semibold text-wd-trogon">{t('safety.healthRequired')}</p>
              <p className="mt-3 leading-relaxed text-wd-muted">{t('safety.healthBody')}</p>
              <Link href="/practical/#health" className="link-arrow mt-4 text-sm">{t('safety.healthLink')}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h2 className="h-section">{t('cta.title')}</h2>
          <p className="lede mt-4 max-w-2xl mx-auto">{t('cta.lede')}</p>
          <div className="flex justify-center">
            <Actions />
          </div>
        </div>
      </section>
    </>
  );
}
