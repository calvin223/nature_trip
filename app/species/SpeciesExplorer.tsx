'use client';

/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { useEffect, useRef, useState } from 'react';
import { species } from '@/lib/data';
import {
  findPhoto,
  img,
  photoCategories,
  photosForTab,
  speciesMatchesTab,
  speciesTabs,
  tabForPhotoCategory,
  type Photo,
} from '@/lib/photos';

/* species-card id -> field photo slug, where our archive has a matching shot */
const speciesPhotoSlugs: Record<string, string> = {
  'bengal-tiger': 'bengal-tiger',
  'asiatic-lion': 'asiatic-lion',
  'great-hornbill': 'great-indian-hornbill',
  'southern-birdwing': 'southern-birdwing',
  'rhododendron': 'nilgiri-rhododendron',
};

/* Species cards are "species we plan routes around". No trip visits Gir, the Asiatic lion's
   only wild range, so a card for it would advertise a route we do not run. */
const OFF_ROUTE = new Set(['asiatic-lion']);
const focusSpecies = species.filter((s) => !OFF_ROUTE.has(s.id));

const TAB_COUNTS: Record<string, number> = Object.fromEntries(speciesTabs.map((t) => [t, photosForTab(t).length]));

/* Thumbnails are 480 or 640 px on the long side (VERIFIED 2026-10-03 across all photos), so the
   480-px-long-side width used here is a lower bound: the browser never stretches a thumbnail. */
function thumbWidth(p: Photo): number {
  return p.w >= p.h ? 480 : Math.round((480 * p.w) / p.h);
}

/* Dynamic content note: ForestFX scans for `.reveal` and floaters once per route, so tiles that
   appear after a tab switch would never be revealed. Nothing that changes with the tab carries
   `reveal`, and the whole explorer is `data-no-float` (it also holds a sticky bar). */
export default function SpeciesExplorer() {
  const [selected, setSelected] = useState<string>('All');
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  /* Home page deep-links in as /species/#cat-birds: open that tab. */
  useEffect(() => {
    const applyHash = () => {
      const match = /^#cat-(.+)$/.exec(window.location.hash);
      const tab = match ? tabForPhotoCategory(match[1]) : undefined;
      if (tab) setSelected(tab);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const cards = focusSpecies.filter((s) => speciesMatchesTab(s.category, selected));
  const gallery = photosForTab(selected);
  const current = active === null ? null : gallery[active] ?? null;

  const openAt = (i: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setActive(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) =>
    setActive((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length));

  return (
    <div data-no-float>
      {/* Anchor targets for /species/#cat-<category>, clear of the fixed nav. */}
      {photoCategories.map((c) => (
        <span key={c.id} id={`cat-${c.id}`} className="block scroll-mt-28" aria-hidden="true" />
      ))}

      <div className="sticky top-[4.5rem] md:top-[5rem] z-40 mb-10">
        <div
          className="glass glass-strong !rounded-full p-1.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter by group"
        >
          {speciesTabs.map((tab) => {
            const on = selected === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(tab)}
                className={`flex-none inline-flex items-center gap-2 !rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  on ? 'bg-wd-lime text-wd-night' : 'text-wd-muted hover:text-white hover:bg-wd-lime/10'
                }`}
              >
                {tab}
                <span className={`text-xs tabular-nums ${on ? 'text-wd-night/70' : 'text-wd-faint'}`}>{TAB_COUNTS[tab]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {cards.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-6">Focus species</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((sp) => {
              const p = findPhoto(speciesPhotoSlugs[sp.id]);
              return (
                <article key={sp.id} className="glass card-3d overflow-hidden flex flex-col">
                  {p && (
                    <div className="relative h-48 bg-wd-deep">
                      <img
                        src={img(p.thumb)}
                        srcSet={`${img(p.thumb)} ${thumbWidth(p)}w, ${img(p.src)} ${p.w}w`}
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                        alt={sp.commonName}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="glass-pad flex flex-col gap-3 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="chip">{sp.category}</span>
                      {sp.endemic && <span className="chip chip-sun">Endemic</span>}
                      {sp.threatened && <span className="chip chip-trogon">Threatened</span>}
                    </div>
                    <div>
                      <h3 className="h-card">{sp.commonName}</h3>
                      <p className="text-sm italic text-wd-faint">{sp.scientificName}</p>
                    </div>
                    <p className="text-sm text-wd-muted">
                      <span className="font-semibold text-wd-ink">Habitat: </span>
                      {sp.habitat}
                    </p>
                    <p className="text-sm text-wd-muted rounded-lg bg-black/25 border border-[var(--wd-line)] p-3 mt-auto">
                      <span className="font-semibold text-wd-ink">Field note: </span>
                      {sp.fieldNote}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow">Field gallery</p>
          <h2 className="h-section">{selected === 'All' ? 'Field photographs' : selected}</h2>
        </div>
        <p className="text-sm text-wd-muted" aria-live="polite">
          {gallery.length} photograph{gallery.length === 1 ? '' : 's'}. Select one to enlarge it.
        </p>
      </div>

      <div ref={galleryRef} className="columns-2 md:columns-3 lg:columns-4 gap-3">
        {gallery.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={(e) => openAt(i, e.currentTarget)}
            aria-label={`Enlarge photo: ${p.name}`}
            className="photo-tile photo-tile--captioned block w-full mb-3 break-inside-avoid cursor-zoom-in"
          >
            <img
              src={img(p.thumb)}
              srcSet={`${img(p.thumb)} ${thumbWidth(p)}w, ${img(p.src)} ${p.w}w`}
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw"
              alt={p.name}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
            />
            <span className="photo-tile__caption text-left">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Lightbox: native modal dialog, so Escape closes it and the page behind is inert.
          On close, focus returns to the tile of the photo last shown (else the one that opened it). */}
      <dialog
        ref={dialogRef}
        aria-label={current ? `Photo: ${current.name}` : 'Photo viewer'}
        onClose={() => {
          const shown = active === null ? null : galleryRef.current?.querySelectorAll<HTMLButtonElement>(':scope > button')[active];
          setActive(null);
          (shown ?? openerRef.current)?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        }}
        className="m-0 p-0 border-0 w-full h-full max-w-none max-h-none bg-transparent text-wd-ink backdrop:bg-black/85"
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 sm:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="w-full max-w-6xl flex items-center justify-between gap-3">
            <p className="text-sm text-wd-muted tabular-nums">
              {active !== null && `${active + 1} of ${gallery.length}`}
            </p>
            <button type="button" onClick={close} className="btn btn-ghost !px-4 !py-2 text-sm" aria-label="Close photo viewer">
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>

          {current && (
            <figure className="flex flex-col items-center gap-3 min-h-0">
              <img
                key={current.slug}
                src={img(current.src)}
                alt={current.name}
                width={current.w}
                height={current.h}
                className="max-h-[72vh] w-auto h-auto max-w-full object-contain rounded-xl border border-[var(--wd-line)] shadow-2xl"
              />
              <figcaption className="text-center">
                <span className="font-display text-xl text-white">{current.name}</span>
                <span className="block text-xs uppercase tracking-[0.18em] text-wd-lime mt-1">{current.categoryLabel}</span>
              </figcaption>
            </figure>
          )}

          {gallery.length > 1 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} className="btn btn-ghost !px-5 !py-2.5 text-sm">
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" onClick={() => step(1)} className="btn btn-ghost !px-5 !py-2.5 text-sm">
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
