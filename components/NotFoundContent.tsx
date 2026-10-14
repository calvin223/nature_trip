/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import en from '@/messages/en';
import { findPhoto, img, photoName } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingCTA';

/* Static (404 pages get no locale param): the default language's title. */
export const notFoundMetadata: Metadata = en.notFound.meta;

const ONWARD = [
  { href: '/experts/', key: 'experts' },
  { href: '/species/', key: 'species' },
  { href: '/when-to-visit/', key: 'whenToVisit' },
  { href: '/contact/', key: 'contact' },
] as const;

/* The 404 body, shared by app/not-found.tsx (the static 404.html) and app/[locale]/not-found.tsx. */
export default function NotFoundContent() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  const owl = findPhoto('mottled-wood-owl');

  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap grid gap-10 lg:grid-cols-[1.25fr_1fr] items-center">
          <div>
            <h1 className="h-display mb-5">
              {t.rich('title', { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
            </h1>
            <p className="lede mb-8 max-w-xl">{t('lede')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn btn-primary btn-lg">
                {t('home')}
              </Link>
              <Link href="/trips/" className="btn btn-ghost btn-lg">
                {t('trips')}
              </Link>
            </div>
          </div>
          {owl && (
            <figure className="photo-tile photo-tile--captioned card-3d aspect-[4/5] max-h-[32rem] w-full max-w-sm mx-auto lg:mr-0" data-float>
              <img src={img(owl.src)} alt={photoName(owl, locale)} width={owl.w} height={owl.h} loading="lazy" decoding="async" />
              <figcaption className="photo-tile__caption">{photoName(owl, locale)}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ONWARD.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="glass glass-pad card-3d flex flex-col gap-1.5"
              >
                <span className="h-card">{t(`onward.${l.key}.title`)}</span>
                <span className="text-sm text-wd-muted">{t(`onward.${l.key}.body`)}</span>
                <span className="link-arrow text-sm mt-2">{t('go')}</span>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center text-wd-muted">
            {t('specific')}{' '}
            <a
              href={waLink(t('whatsappMessage'))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-wd-lime font-semibold hover:text-wd-leaf"
            >
              <WhatsAppIcon className="w-4 h-4" /> {t('askWhatsApp')}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
