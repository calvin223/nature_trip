/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { alternates } from '@/i18n/metadata';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import type { Messages } from '@/messages';
import { img, photoName, photoOrThrow } from '@/lib/photos';
import { blurStyle } from '@/lib/placeholders';
import { waLink } from '@/lib/site';
import HeroImage from '@/components/HeroImage';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'schools.meta' });
  return { title: t('title'), description: t('description'), alternates: alternates(locale, '/schools/') };
}

type GroupKey = keyof Messages['schools']['groupTypes']['items'];

/* Each kind of group led by one of the team's own field-course photos (public/photos/field, built
   by scripts/build-images.mjs): people having the sort of day the entry describes. Home and About
   reuse some of them; the two under Academic options below (lecture, shore-notes) are not repeated
   here, so this page never shows a photo twice. */
const GROUPS: { key: GroupKey; photo: string; widths: number[] }[] = [
  { key: 'families', photo: 'mangrove-boat', widths: [700, 1200] },
  { key: 'friends', photo: 'shared-lunch', widths: [700, 1200] },
  { key: 'clubs', photo: 'lake-birding', widths: [700, 1200] },
  { key: 'companies', photo: 'shola-walk', widths: [800, 1400, 2400] },
  { key: 'international', photo: 'roadside-birding', widths: [800, 1400, 2400] },
  { key: 'schools', photo: 'forest-notes', widths: [700, 1200] },
];
const fieldSrc = (name: string, w: number) => `/photos/field/${name}-${w}.webp`;

const HERO_PHOTO = 'chital-herd';

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
  const hero = photoOrThrow(HERO_PHOTO);

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
          <div>
            <h1 className="h-display mb-5">{t('hero.title')}</h1>
            <p className="lede max-w-xl">{t('hero.lede')}</p>
            <Actions />
          </div>
          <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-2xl bg-wd-deep" style={blurStyle(hero.src)}>
            <HeroImage src={img(hero.src)} alt={photoName(hero, locale)} decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="photo-scrim">
              <span className="photo-label">{photoName(hero, locale)}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Photo-led, so a grid of entries is allowed here (DESIGN.md: cards only where a photo leads).
          Phones get a thumbnail beside the text, so six groups stay a short scroll. */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('groupTypes.title')}</h2>
            <p>{t('groupTypes.intro')}</p>
          </div>
          <ul className="grid gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
            {GROUPS.map(({ key, photo, widths }) => {
              return (
                <li key={key} className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-4 sm:block">
                  <figure className="relative m-0 aspect-square overflow-hidden rounded-xl bg-wd-deep sm:aspect-[4/3]" style={blurStyle(fieldSrc(photo, widths[0]))}>
                    <img
                      src={img(fieldSrc(photo, widths[1]))}
                      srcSet={widths.map((w) => `${img(fieldSrc(photo, w))} ${w}w`).join(', ')}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 6rem"
                      alt={t(`groupTypes.items.${key}.photo.alt`)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <figcaption className="photo-scrim hidden sm:block" aria-hidden="true">
                      <span className="photo-label">{t(`groupTypes.items.${key}.photo.caption`)}</span>
                    </figcaption>
                  </figure>
                  <div className="sm:mt-4">
                    <h3 className="h-card">{t(`groupTypes.items.${key}.title`)}</h3>
                    <p className="mt-1.5 leading-relaxed text-wd-muted">{t(`groupTypes.items.${key}.body`)}</p>
                    {key === 'schools' && <a href="#academic" className="link-arrow mt-2 text-sm">{t('groupTypes.academicLink')}</a>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* The page's one bold element: the six slots hung off a thin rail of the day's light, dawn to after dark. */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head">
            <h2 className="h-section">{t('sampleDay.title')}</h2>
            <p>{t('sampleDay.lede')}</p>
          </div>
          <ol className="day-band" aria-label={t('sampleDay.caption')}>
            {(t.raw('sampleDay.rows') as { time: string; what: string }[]).map(({ time, what }) => (
              <li key={time} className="day-band__slot">
                <strong className="day-band__time">{time}</strong>
                <span className="day-band__what">{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* A planning sheet: the heading beside ruled rows, each term left and its options flowing as one
          line of text right (.opt-list), in the same rows as Academic options below. */}
      <section className="wd-section bg-wd-deep">
        <div className="wd-wrap grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="h-section">{t('customise.title')}</h2>
            <p className="mt-4 leading-relaxed text-wd-muted">{t('customise.intro')}</p>
          </div>
          <dl className="border-b border-[var(--wd-line-strong)]">
            {(t.raw('customise.options') as { term: string; items: string[]; note?: string }[]).map(({ term, items, note }) => (
              <div key={term} className="grid gap-1.5 border-t border-[var(--wd-line-strong)] py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-semibold text-wd-ink">{term}</dt>
                <dd>
                  <ul className="opt-list">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {note && <p className="mt-2 text-sm text-wd-muted">{note}</p>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="academic" className="wd-section scroll-mt-24">
        <div className="wd-wrap grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="h-section">{t('academic.title')}</h2>
            <p className="mt-4 leading-relaxed text-wd-muted">
              {t.rich('academic.intro', {
                link: (chunks) => <Link href="/experts/" className="link-arrow">{chunks}</Link>,
              })}
            </p>
          </div>
          <dl className="border-b border-[var(--wd-line)]">
            {(t.raw('academic.items') as { title: string; body: string }[]).map(({ title, body }) => (
              <div key={title} className="grid gap-1 border-t border-[var(--wd-line)] py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-semibold text-wd-ink">{title}</dt>
                <dd className="leading-relaxed text-wd-muted">{body}</dd>
              </div>
            ))}
          </dl>
          {/* The team's own photos from past university field courses (scripts/build-images.mjs). */}
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {(['lecture', 'shore-notes'] as const).map((name) => (
              <li key={name}>
                <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-xl bg-wd-deep" style={blurStyle(fieldSrc(name, 1200))}>
                  <img
                    src={img(fieldSrc(name, 1200))}
                    srcSet={`${img(fieldSrc(name, 700))} 700w, ${img(fieldSrc(name, 1200))} 1200w`}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    alt={t(`academic.photos.${name}.alt`)}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <figcaption className="photo-scrim">
                    <span className="photo-label">{t(`academic.photos.${name}.caption`)}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The ask, and the one booking condition every group must meet; the detail lives on Practical info. */}
      <section className="wd-section">
        <div className="wd-wrap">
          <div className="glass glass-strong glass-pad grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div>
              <h2 className="h-section">{t('cta.title')}</h2>
              <p className="lede mt-4 max-w-2xl">{t('cta.lede')}</p>
              <Actions />
            </div>
            <div className="lg:border-l lg:border-[var(--wd-line)] lg:pl-10">
              <h3 className="h-card">{t('cta.healthTitle')}</h3>
              <p className="mt-1 text-sm font-semibold text-wd-trogon">{t('cta.healthRequired')}</p>
              <p className="mt-3 text-sm leading-relaxed text-wd-muted">{t('cta.healthBody')}</p>
              <Link href="/practical/#health" className="link-arrow mt-4 text-sm">{t('cta.healthLink')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
