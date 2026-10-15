import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Messages } from '@/messages';
import { SITE, socialLinks, waLink } from '@/lib/site';
import LanguageSwitcher from './LanguageSwitcher';
import LeafMark from './LeafMark';
import { WhatsAppIcon } from './FloatingCTA';

type LinkKey = keyof Messages['common']['footer']['links'];
type LegalKey = keyof Messages['common']['footer']['legal'];

const COLS: { title: 'explore' | 'beforeYouTravel'; links: { href: string; label: LinkKey }[] }[] = [
  {
    title: 'explore',
    links: [
      { href: '/trips/', label: 'trips' },
      { href: '/experts/', label: 'naturalists' },
      { href: '/species/', label: 'species' },
      { href: '/when-to-visit/', label: 'whenToVisit' },
      { href: '/about/', label: 'about' },
    ],
  },
  {
    title: 'beforeYouTravel',
    links: [
      { href: '/practical/', label: 'practical' },
      { href: '/faq/', label: 'faq' },
      { href: '/schools/', label: 'customGroups' },
      { href: '/contact/', label: 'contact' },
    ],
  },
];

/* Every legal page, in the bottom bar where people look for them. */
const LEGAL: { href: string; label: LegalKey }[] = [
  { href: '/legal/', label: 'notice' },
  { href: '/terms/', label: 'terms' },
  { href: '/package-travel/', label: 'packageTravel' },
  { href: '/privacy/', label: 'privacy' },
  { href: '/cookies/', label: 'cookies' },
  { href: '/accessibility/', label: 'accessibility' },
  { href: '/credits/', label: 'credits' },
];

export default function Footer() {
  const t = useTranslations('common.footer');
  const tw = useTranslations('common.whatsapp');
  const social = socialLinks();

  return (
    <footer className="site-footer no-print border-t border-[var(--wd-line)] bg-wd-deep">
      <div className="wd-wrap py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LeafMark className="w-9 h-9" id="wdfoot" />
            <span className="font-display text-2xl font-semibold text-wd-ink">{SITE.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-wd-muted max-w-sm">{t('tagline')}</p>
          {social.length > 0 && (
            <div className="mt-5 flex gap-5">
              {social.map((s) => (
                <a key={s.network} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-wd-ink underline underline-offset-4 decoration-[var(--wd-line-strong)] hover:decoration-current">{s.label}</a>
              ))}
            </div>
          )}
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-lg font-semibold text-wd-ink mb-3">{t(col.title)}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-wd-muted hover:text-wd-ink transition-colors">{t(`links.${l.label}`)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-lg font-semibold text-wd-ink mb-3">{t('talkToUs')}</h3>
          {/* A quiet link, not a green button: the page's own WhatsApp button stays the one call to action. */}
          <a href={waLink(tw('footer'))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-wd-ink underline underline-offset-4 decoration-[var(--wd-line-strong)] hover:decoration-current">
            <WhatsAppIcon className="w-5 h-5 text-[#1a9e4b]" /> {SITE.whatsapp.display}
          </a>
          {SITE.email && (
            <p className="mt-4 text-sm">
              <a href={`mailto:${SITE.email}`} className="text-wd-muted hover:text-wd-ink underline underline-offset-4">{SITE.email}</a>
            </p>
          )}
          <p className="mt-4 text-sm text-wd-muted leading-relaxed">{t('replyHours')}</p>
          <Link href="/contact/" className="link-arrow text-sm mt-3">{t('sendEnquiry')}</Link>
        </div>
      </div>
      <div className="border-t border-[var(--wd-line)]">
        <div className="wd-wrap pt-6 pb-10 flex flex-col gap-4 text-xs text-wd-muted">
          <nav aria-label={t('legalLabel')}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-wd-ink transition-colors">{t(`legal.${l.label}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            <p>{t('noGuarantee')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
