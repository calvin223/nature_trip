import Link from 'next/link';
import { SITE, waLink } from '@/lib/site';
import LeafMark from './LeafMark';
import { WhatsAppIcon } from './FloatingCTA';

const COLS = [
  {
    title: 'Explore',
    links: [
      { href: '/trips/', label: 'Trips & departures' },
      { href: '/experts/', label: 'Our naturalists' },
      { href: '/species/', label: 'Species gallery' },
      { href: '/when-to-visit/', label: 'When to visit' },
      { href: '/about/', label: 'About the Western Ghats' },
    ],
  },
  {
    title: 'Before you travel',
    links: [
      { href: '/practical/', label: 'Plan & prepare' },
      { href: '/faq/', label: 'FAQ' },
      { href: '/schools/', label: 'Custom groups & schools' },
      { href: '/credits/', label: 'Photo & map credits' },
    ],
  },
];

export default function Footer() {
  const social = [
    SITE.social.facebook && { name: 'Facebook', url: SITE.social.facebook },
    SITE.social.instagram && { name: 'Instagram', url: SITE.social.instagram },
  ].filter(Boolean) as { name: string; url: string }[];

  return (
    <footer className="site-footer no-print mt-10 border-t border-[var(--wd-line)] bg-[#050f09]/92">
      <div className="wd-wrap py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LeafMark className="w-9 h-9" id="wdfoot" />
            <span className="font-display text-2xl font-semibold text-white">Wildora Expeditions</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-wd-muted max-w-sm">
            Small-group nature journeys in the Western Ghats and beyond, guided by doctorate-holding naturalists. Walk slowly, look closely, travel lightly.
          </p>
          {social.length > 0 && (
            <div className="mt-5 flex gap-3">
              {social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="chip">{s.name}</a>
              ))}
            </div>
          )}
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-sans font-semibold uppercase tracking-[0.18em] text-wd-lime mb-4">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-wd-muted hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-sans font-semibold uppercase tracking-[0.18em] text-wd-lime mb-4">Talk to us</h3>
          <a href={waLink("Hello Wildora! I'd like to plan a nature trip.")} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full sm:w-auto">
            <WhatsAppIcon /> {SITE.whatsapp.display}
          </a>
          {SITE.email && (
            <p className="mt-4 text-sm">
              <a href={`mailto:${SITE.email}`} className="text-wd-muted hover:text-white underline underline-offset-4">{SITE.email}</a>
            </p>
          )}
          <p className="mt-4 text-sm text-wd-faint leading-relaxed">
            Messages are answered by our team in India (IST, UTC+5:30).
          </p>
          <Link href="/contact/" className="link-arrow text-sm mt-3">Send an enquiry</Link>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="wd-wrap py-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-xs text-wd-faint">
          <p>&copy; {new Date().getFullYear()} Wildora Expeditions. Ethical, low-impact wildlife travel.</p>
          <p>Wildlife sightings are never guaranteed: nature keeps its own schedule.</p>
        </div>
      </div>
    </footer>
  );
}
