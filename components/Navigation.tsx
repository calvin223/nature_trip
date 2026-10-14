'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LeafMark from './LeafMark';

const PRIMARY = [
  { href: '/trips/', label: 'Trips' },
  { href: '/experts/', label: 'Naturalists' },
  { href: '/species/', label: 'Species' },
  { href: '/when-to-visit/', label: 'When to Visit' },
  { href: '/practical/', label: 'Plan & Prepare' },
  { href: '/faq/', label: 'FAQ' },
];
const SECONDARY = [
  { href: '/about/', label: 'About the Western Ghats' },
  { href: '/schools/', label: 'Custom Groups & Schools' },
];

export default function Navigation() {
  const pathname = usePathname() ?? '/';
  /* The menu is open for the path it was opened on, so navigating closes it without an effect. */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '') || (href !== '/' && pathname.startsWith(href));

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site-nav no-print">
      <nav className="wd-wrap flex items-center justify-between h-16 md:h-[72px]" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Wildora Expeditions — home">
          <LeafMark className="w-8 h-8 transition-transform duration-500 group-hover:rotate-[-12deg]" id="wdnav" />
          <span className="leading-none">
            <span className="block font-display text-[1.35rem] font-semibold tracking-wide text-white">Wildora</span>
            <span className="block text-[0.6rem] uppercase tracking-[0.32em] text-wd-lime mt-0.5">Expeditions</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {PRIMARY.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={isActive(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact/" className="btn btn-primary !py-2.5 !px-5 text-sm">Plan a Trip</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpenOn(open ? null : pathname)}
          className="lg:hidden relative w-11 h-11 grid place-items-center rounded-full border border-white/20 bg-black/20 text-white"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[#06120b]/97 border-t border-[var(--wd-line)] overflow-y-auto fade-up">
          <div className="wd-wrap py-6 flex flex-col gap-1">
            {[...PRIMARY, ...SECONDARY].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpenOn(null)}
                className={`font-display text-2xl py-3 border-b border-white/5 ${isActive(l.href) ? 'text-wd-lime' : 'text-white'}`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact/" onClick={() => setOpenOn(null)} className="btn btn-primary btn-lg mt-6">Plan a Trip</Link>
          </div>
        </div>
      )}
    </header>
  );
}
