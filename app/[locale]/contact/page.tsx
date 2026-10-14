import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import ClientMessages from '@/i18n/ClientMessages';
import { alternates } from '@/i18n/metadata';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { getContent } from '@/lib/content';
import { SITE, hasForm, waLink } from '@/lib/site';
import ContactForm, { type TripOption } from './ContactForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/contact/') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  // Only id and title reach the client bundle, not the whole trips data set.
  const tripOptions: TripOption[] = getContent(locale).trips.map((trip) => ({ id: trip.id, title: trip.title }));
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl">
            <h1 className="h-display mb-5">
              {t.rich('head.title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
            </h1>
            <p className="lede">{t('head.lede')}</p>
          </div>
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8 items-start">
            <div id="enquiry" className="glass glass-strong glass-pad scroll-mt-28">
              <h2 className="h-card !text-2xl">{t('enquiryHeading')}</h2>
              <div className="mt-4">
                <ClientMessages namespaces={['contact']}>
                  <ContactForm trips={tripOptions} />
                </ClientMessages>
              </div>
            </div>

            <aside className="space-y-5" aria-label={t('reach.label')}>
              <div className="glass glass-pad card-3d">
                <h2 className="h-card">{t('reach.whatsapp')}</h2>
                <p className="mt-2 font-display text-2xl font-semibold text-wd-ink tracking-wide">
                  {SITE.whatsapp.display}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">{tc('footer.replyHours')}</p>
                <a
                  href={waLink(tc('whatsapp.default'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa mt-5"
                >
                  <WhatsAppIcon /> {t('reach.startChat')}
                </a>
              </div>

              {SITE.email && (
                <div className="glass glass-pad card-3d">
                  <h2 className="h-card">{t('reach.email')}</h2>
                  <a href={`mailto:${SITE.email}`} className="mt-2 inline-block text-wd-lime underline underline-offset-4">
                    {SITE.email}
                  </a>
                </div>
              )}

              <div className="glass glass-pad card-3d">
                <h2 className="h-card">{t('next.heading')}</h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-wd-muted">
                  {[
                    hasForm ? t('next.sendForm') : t('next.sendWhatsApp'),
                    t('next.reply'),
                    t('next.beforeBooking'),
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex-none w-4 font-display text-base font-semibold leading-snug text-wd-lime tabular-nums">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass glass-pad card-3d">
                <h2 className="h-card">{t('before.heading')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">{t('before.body')}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link href="/trips/" className="link-arrow">{t('before.trips')}</Link></li>
                  <li><Link href="/practical/" className="link-arrow">{t('before.practical')}</Link></li>
                  <li><Link href="/faq/" className="link-arrow">{t('before.faq')}</Link></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
