import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { img } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import HeroImage from '@/components/HeroImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experts.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/experts/') };
}

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(-2)
    .join('');
}

export default async function ExpertsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'experts' });
  const { experts } = getContent(locale);
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow text-center">
          <h1 className="h-display mb-5">
            {t.rich('hero.title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
          </h1>
          <p className="lede">{t('hero.lede')}</p>
        </div>
      </section>

      <section className="wd-section !pt-0">
        <div className="wd-wrap">
          <div className="grid gap-8 md:gap-10">
            {experts.map((expert, index) => {
              const flip = index % 2 === 1;
              return (
                <article
                  key={expert.id}
                  className={`glass card-3d overflow-hidden grid md:items-stretch ${
                    flip ? 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
                  }`}
                  aria-labelledby={`expert-${expert.id}`}
                >
                  <div className={`relative aspect-square md:aspect-auto md:min-h-[26rem] bg-wd-deep ${flip ? 'md:order-2' : ''}`}>
                    {expert.imageUrl ? (
                      <HeroImage
                        src={img(expert.imageUrl)}
                        alt={t('card.portraitAlt', { name: expert.name })}
                        width={600}
                        height={600}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-wd-forest to-wd-deep font-display text-6xl text-wd-lime"
                        aria-hidden="true"
                      >
                        {initials(expert.name)}
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent ${
                        flip ? 'md:bg-gradient-to-r' : 'md:bg-gradient-to-l'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-5">
                    <div>
                      <h2 id={`expert-${expert.id}`} className="font-display text-2xl md:text-3xl font-semibold text-wd-ink leading-tight">
                        {expert.name}
                      </h2>
                      <p className="mt-2 text-wd-lime font-semibold leading-snug">{expert.qualifications}</p>
                    </div>

                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--wd-line)] bg-wd-deep p-4">
                        <dt className="text-sm font-semibold text-wd-muted mb-1.5">{t('card.specialism')}</dt>
                        <dd className="text-sm text-wd-ink leading-relaxed">{expert.specialization}</dd>
                      </div>
                      <div className="rounded-xl border border-[var(--wd-line)] bg-wd-deep p-4">
                        <dt className="text-sm font-semibold text-wd-muted mb-1.5">{t('card.experience')}</dt>
                        <dd className="text-sm text-wd-ink leading-relaxed">{expert.experience}</dd>
                      </div>
                    </dl>

                    <hr className="divider" />

                    <p className="text-wd-muted leading-relaxed">{expert.bio}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('why.title')}</h2>
          </div>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {(t.raw('why.items') as { title: string; body: string }[]).map((w) => (
              <article key={w.title} className="border-t border-[var(--wd-line-strong)] pt-5">
                <h3 className="h-card mb-2">{w.title}</h3>
                <p className="text-wd-muted leading-relaxed">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-strong glass-pad text-center">
            <h2 className="h-section mb-4">{t('cta.title')}</h2>
            <p className="lede mb-8 max-w-2xl mx-auto">{t('cta.lede')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink(t('cta.whatsappMessage'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> {t('cta.askWhatsApp')}
              </a>
              <Link href="/trips/" className="btn btn-ghost btn-lg">
                {t('cta.trips')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
