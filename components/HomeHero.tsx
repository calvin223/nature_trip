'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { findPhoto, img } from '@/lib/photos';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from './FloatingCTA';

/* Hero: the curated full-bleed wildlife loop, set in a window that floats in the 3D forest
   and tilts with the pointer, with field photos orbiting it at different depths. */
const SLIDE_SLUGS = [
  'tigress-with-cubs',
  'asiatic-lion',
  'one-horned-rhinoceros',
  'malabar-trogon',
  'indian-leopard',
  'lion-tailed-macaque',
  'blackbuck',
  'nilgiri-tahr-male',
];

const SLIDES = SLIDE_SLUGS.map((slug) => findPhoto(slug))
  .filter((p): p is NonNullable<typeof p> => !!p)
  .map((p) => ({ src: img(p.wide ?? p.src), alt: p.name }));

export type OrbitPhoto = { src: string; alt: string; caption?: string; credit?: string };

const DEFAULT_ORBIT: OrbitPhoto[] = ['malabar-grey-hornbill', 'painted-frog', 'southern-birdwing']
  .map((slug) => findPhoto(slug))
  .filter((p): p is NonNullable<typeof p> => !!p)
  .map((p) => ({ src: img(p.thumb), alt: p.name, caption: p.name }));

/* Kept clear of the headline and buttons (left/centre of the window). */
const ORBIT_POS = [
  { cls: 'right-[-1.25rem] top-[10%] w-40 h-52', depth: '70px', r: '5deg', dur: '7s', delay: '0s' },
  { cls: 'left-[-2.5rem] top-[-2.25rem] w-36 h-28', depth: '45px', r: '-4deg', dur: '8.5s', delay: '-2s' },
  { cls: 'right-[-2rem] bottom-[26%] w-44 h-32', depth: '100px', r: '-3deg', dur: '6.5s', delay: '-4s' },
];

const INTERVAL_MS = 8000;

const STATS: [string, string][] = [
  ['4', 'doctorate-holding naturalists'],
  ['30+', 'years in the field (lead naturalist)'],
  ['10–12', 'guests at most per group'],
];

export default function HomeHero({ orbit = DEFAULT_ORBIT }: { orbit?: OrbitPhoto[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex((prev) => (prev + 1) % SLIDES.length), INTERVAL_MS);
  }, []);
  const goTo = useCallback((i: number) => { setIndex(i); start(); }, [start]);

  useEffect(() => {
    if (SLIDES.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [start]);

  return (
    <section className="hero3d" data-no-float>
      <div className="wd-wrap relative">
        <div className="hero3d-window">
          {SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              className={`hero-slide${i === index ? ' hero-slide--active' : ''}`}
            />
          ))}

          {/* Scrims for legibility over any photo */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#04100a]/95 via-[#04100a]/25 to-[#04100a]/10" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#04100a]/85 via-[#04100a]/25 to-transparent" />

          <div className="hidden sm:flex absolute right-5 md:right-7 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3" role="tablist" aria-label="Featured wildlife photos">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo: ${slide.alt}`}
                onClick={() => goTo(i)}
                className={`w-1.5 rounded-full transition-all duration-500 ${i === index ? 'h-7 bg-wd-lime shadow-[0_0_12px_rgba(154,209,75,0.8)]' : 'h-1.5 bg-white/45 hover:bg-white/80'}`}
              />
            ))}
          </div>

          <div className="relative z-10 h-full flex items-end md:items-center">
            <div className="px-6 sm:px-10 md:px-14 pb-10 md:pb-0 max-w-3xl fade-up">
              <span className="chip mb-6 backdrop-blur-sm !bg-black/30">
                <span className="w-1.5 h-1.5 rounded-full bg-wd-lime animate-pulse" />
                Western Ghats · Small groups · Naturalist-led
              </span>
              <h1 className="h-display text-glow mb-5">
                India&apos;s wild places, guided by <span className="accent-text">the naturalists who study them</span>
              </h1>
              <p className="text-base md:text-xl text-white/85 max-w-xl mb-8 leading-relaxed text-glow">
                Rainforest endemics, shola grasslands, monsoon frogs and tiger country, at a gentle pace with time to look, listen and rest.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/trips/" className="btn btn-primary btn-lg">See trips &amp; dates</Link>
                <a href={waLink("Hello Wildora! I'd like help choosing a nature trip.")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg backdrop-blur-sm">
                  <WhatsAppIcon /> Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Field photos orbiting the window at different depths (desktop) */}
        {orbit.slice(0, 3).map((p, i) => (
          <figure
            key={p.src}
            className={`hero3d-orbit hidden lg:block ${ORBIT_POS[i].cls}`}
            style={{ '--depth': ORBIT_POS[i].depth, '--r': ORBIT_POS[i].r, '--dur': ORBIT_POS[i].dur, '--delay': ORBIT_POS[i].delay } as React.CSSProperties}
          >
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            {p.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white bg-gradient-to-t from-black/85 to-transparent">
                {p.caption}
                {p.credit && <span className="block text-[0.55rem] font-normal text-white/70">Photo: {p.credit}</span>}
              </figcaption>
            )}
          </figure>
        ))}

        <div className="glass mt-5 md:mt-6 px-5 md:px-8 py-4 grid grid-cols-3 gap-3 md:gap-6">
          {STATS.map(([n, l]) => (
            <div key={l} className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2.5">
              <span className="font-display text-xl md:text-3xl font-semibold accent-text">{n}</span>
              <span className="text-[0.7rem] md:text-sm text-wd-muted leading-snug">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
