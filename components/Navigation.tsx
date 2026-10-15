'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ENABLED_LOCALES, LOCALE_META, LOCALES } from '@/i18n/locales';
import { Link, usePathname } from '@/i18n/navigation';
import type { Messages } from '@/messages';
import { SITE } from '@/lib/site';
import { rememberLocale } from './LanguageSwitcher';
import LeafMark from './LeafMark';

/* Labels are keys into messages/<locale>/common.json → nav. */
type NavKey = keyof Messages['common']['nav'];
interface NavLink {
  href: string;
  label: NavKey;
}
interface NavGroup {
  label: NavKey;
  links: NavLink[];
}

/* Four top-level entries; related pages sit together in dropdowns. Home is the logo. */
const NAV: (NavLink | NavGroup)[] = [
  {
    label: 'trips',
    links: [
      { href: '/trips/', label: 'tripsAll' },
      { href: '/when-to-visit/', label: 'whenToVisit' },
      { href: '/schools/', label: 'customGroups' },
    ],
  },
  { href: '/species/', label: 'species' },
  {
    label: 'about',
    links: [
      { href: '/about/', label: 'aboutIndia' },
      { href: '/experts/', label: 'naturalists' },
    ],
  },
  {
    label: 'travelInfo',
    links: [
      { href: '/practical/', label: 'practical' },
      { href: '/faq/', label: 'faq' },
    ],
  },
];

const isGroup = (item: NavLink | NavGroup): item is NavGroup => 'links' in item;

/* Logo lockup from the brand name, never a message: first word large, the rest as the small caps line. */
const [BRAND_MAIN, ...brandRest] = SITE.name.split(' ');
const BRAND_SUB = brandRest.join(' ');

/* Solid paper bar. On the home page it starts clear over the full-bleed hero photo
   (white text) and turns to paper once the page scrolls. Dropdowns are disclosure buttons
   (click or tap; a mouse also opens them on hover), closed by Escape, a click outside, focus
   leaving, or navigating. */
export default function Navigation() {
  const t = useTranslations('common.nav');
  const tl = useTranslations('common.language');
  const locale = useLocale();
  const pathname = usePathname() ?? '/';
  /* Menu and dropdown are open for the path they were opened on, so navigating closes them
     without an effect. */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [drop, setDrop] = useState<{ label: string; path: string } | null>(null);
  const openDrop = drop?.path === pathname ? drop.label : null;
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef('');
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '') || (href !== '/' && pathname.startsWith(href));
  const overHero = pathname === '/' && !scrolled && !open;

  const show = (label: string | null) => {
    window.clearTimeout(closeTimer.current);
    setDrop(label ? { label, path: pathname } : null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The phone menu is a full-screen sheet: while it is open the page behind it is locked and
     inert (so Tab can't reach links hidden under it), and Escape or widening to the desktop bar
     closes it. */
  useEffect(() => {
    if (!open) return;
    const close = () => setOpenOn(null);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      menuButton.current?.focus();
    };
    const desktop = window.matchMedia('(min-width: 64rem)'); // Tailwind lg, where the menu is hidden
    const behind = ['#main', '.site-footer', '.floating-cta']
      .map((sel) => document.querySelector<HTMLElement>(sel))
      .filter((el): el is HTMLElement => el !== null && !el.inert);
    behind.forEach((el) => { el.inert = true; });
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', close);
    return () => {
      behind.forEach((el) => { el.inert = false; });
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', close);
    };
  }, [open]);

  useEffect(() => {
    if (!openDrop) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.nav-group')) setDrop(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openDrop]);

  const onGroupKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape') return;
    setDrop(null);
    e.currentTarget.querySelector('button')?.focus();
  };
  const onGroupBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDrop(null);
  };

  /* A header dropdown (the NAV groups and the language menu): a disclosure button and its panel. */
  const dropdown = (key: string, trigger: ReactNode, items: ReactNode, opts: { active?: boolean; label?: string; end?: boolean } = {}) => {
    const id = `nav-${key}`;
    const expanded = openDrop === key;
    return (
      <div
        key={key}
        className="nav-group"
        onPointerEnter={(e) => e.pointerType === 'mouse' && show(key)}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          closeTimer.current = window.setTimeout(() => setDrop(null), 150);
        }}
        onKeyDown={onGroupKey}
        onBlur={onGroupBlur}
      >
        <button
          type="button"
          className="nav-link nav-group__trigger"
          aria-expanded={expanded}
          aria-controls={id}
          aria-label={opts.label}
          data-active={opts.active || undefined}
          onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
          /* Hover already opened it for a mouse, so a click only keeps it open; touch and
             keyboard toggle. */
          onClick={() => {
            const mouse = lastPointer.current === 'mouse';
            lastPointer.current = '';
            show(expanded && !mouse ? null : key);
          }}
        >
          {trigger}
          <svg className="nav-group__chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 4.5 6 7.5 9 4.5" />
          </svg>
        </button>
        <div id={id} className={`nav-drop${opts.end ? ' nav-drop--end' : ''}`} data-open={expanded || undefined}>
          <ul className="nav-drop__panel">{items}</ul>
        </div>
      </div>
    );
  };

  return (
    <header className="site-nav no-print" data-over-hero={overHero ? '' : undefined}>
      <nav className="wd-wrap flex items-center justify-between h-16 md:h-[72px]" aria-label={t('label')}>
        <Link href="/" className="flex items-center gap-2.5" aria-label={t('homeLabel')}>
          <LeafMark className="w-8 h-8" id="wdnav" />
          <span className="leading-none">
            <span className="block font-display text-[1.35rem] font-semibold">{BRAND_MAIN}</span>{' '}
            {BRAND_SUB && <span className="block text-[0.6rem] uppercase tracking-[0.3em] opacity-75 mt-0.5">{BRAND_SUB}</span>}
          </span>
        </Link>

        <div className="flex items-center gap-5 lg:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((item) =>
              isGroup(item) ? (
                dropdown(
                  item.label,
                  t(item.label),
                  item.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="nav-drop__link"
                        aria-current={isActive(l.href) ? 'page' : undefined}
                        onClick={() => setDrop(null)}
                      >
                        {t(l.label)}
                      </Link>
                    </li>
                  )),
                  { active: item.links.some((l) => isActive(l.href)) },
                )
              ) : (
                <Link key={item.href} href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined}>
                  {t(item.label)}
                </Link>
              ),
            )}
            <Link href="/contact/" className={`btn ${overHero ? 'btn-light' : 'btn-primary'} !py-2.5 !px-5 text-sm`}>{t('planTrip')}</Link>
          </div>

          {/* Every planned language; those not yet published are listed but not links. */}
          {dropdown(
            'language',
            <>
              <GlobeIcon />
              {locale.toUpperCase()}
            </>,
            LOCALES.map((l) => (
              <li key={l}>
                {ENABLED_LOCALES.includes(l) ? (
                  <Link
                    href={pathname}
                    locale={l}
                    hrefLang={LOCALE_META[l].hreflang}
                    lang={LOCALE_META[l].htmlLang}
                    className="nav-drop__link"
                    aria-current={l === locale ? 'true' : undefined}
                    onClick={() => {
                      rememberLocale(l);
                      setDrop(null);
                    }}
                  >
                    {LOCALE_META[l].name}
                  </Link>
                ) : (
                  <span className="nav-drop__link nav-drop__link--off">
                    <span lang={LOCALE_META[l].htmlLang}>{LOCALE_META[l].name}</span>
                    <span className="text-xs">{tl('soon')}</span>
                  </span>
                )}
              </li>
            )),
            /* Starts with the visible code, so speech users can say what they see. */
            { label: `${locale.toUpperCase()} – ${tl('button', { language: LOCALE_META[locale].name })}`, end: true },
          )}

          <button
            ref={menuButton}
            type="button"
            onClick={() => {
              setDrop(null);
              setOpenOn(open ? null : pathname);
            }}
            className="lg:hidden relative w-11 h-11 grid place-items-center"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="menu-icon" data-open={open || undefined} aria-hidden="true">
              <svg className="menu-icon__bars" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              <svg className="menu-icon__close" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>
      </nav>

      {/* Always mounted so it can animate out; hidden (visibility) when closed, which also takes it
          out of the tab order and the accessibility tree. */}
      <div
        id="mobile-menu"
        className="mobile-menu lg:hidden fixed inset-x-0 top-16 md:top-[72px] bottom-0 bg-wd-night border-t border-[var(--wd-line)] overflow-y-auto overscroll-contain"
        data-open={open || undefined}
      >
        <div className="wd-wrap pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col">
          {NAV.map((item) =>
            isGroup(item) ? (
              <section key={item.label} className="py-4 border-b border-[var(--wd-line)]">
                <h2 className="mobile-menu__heading">{t(item.label)}</h2>
                <ul>
                  {item.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpenOn(null)}
                        className={`block font-display text-xl py-2 ${isActive(l.href) ? 'text-wd-lime' : 'text-wd-ink'}`}
                      >
                        {t(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenOn(null)}
                className={`block font-display text-xl py-5 border-b border-[var(--wd-line)] ${isActive(item.href) ? 'text-wd-lime' : 'text-wd-ink'}`}
              >
                {t(item.label)}
              </Link>
            ),
          )}
          <Link href="/contact/" onClick={() => setOpenOn(null)} className="btn btn-primary btn-lg mt-6">{t('planTrip')}</Link>
        </div>
      </div>
    </header>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}
