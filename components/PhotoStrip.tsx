'use client';
/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export interface StripPhoto {
  /** Already basePath-prefixed. */
  src: string;
  thumb: string;
  name: string;
  blur?: string;
}

/* Swipeable photo strip (Embla): drag or flick with momentum, or use the arrow buttons.
   Free scrolling with trimmed snaps, so a flick carries and settles naturally. */
export default function PhotoStrip({ photos, label, prevLabel, nextLabel }: { photos: StripPhoto[]; label: string; prevLabel: string; nextLabel: string }) {
  const tg = useTranslations('common.gallery');
  const [viewport, api] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const first = requestAnimationFrame(update); // initial state, once Embla has measured
    api.on('select', update).on('reInit', update).on('scroll', update);
    return () => {
      cancelAnimationFrame(first);
      api.off('select', update).off('reInit', update).off('scroll', update);
    };
  }, [api, update]);

  const arrow = 'grid h-11 w-11 place-items-center rounded-full border border-[var(--wd-line-strong)] text-wd-ink transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-wd-deep active:scale-[0.97] disabled:opacity-35 disabled:pointer-events-none';

  return (
    <div role="region" aria-roledescription={tg('carousel')} aria-label={label}>
      <div className="overflow-hidden" ref={viewport}>
        <ul className="flex gap-4 touch-pan-y">
          {photos.map((p) => (
            <li key={p.src} className="min-w-0 shrink-0 basis-[68%] sm:basis-[40%] lg:basis-[23%]">
              <figure className="m-0">
                <span
                  className="block aspect-[4/5] overflow-hidden rounded-xl bg-wd-deep"
                  style={p.blur ? { backgroundImage: `url(${p.blur})`, backgroundSize: 'cover' } : undefined}
                >
                  <img
                    src={p.thumb}
                    srcSet={`${p.thumb} 480w, ${p.src} 1600w`}
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 68vw"
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover select-none"
                  />
                </span>
                <figcaption className="mt-2.5 text-sm font-medium text-wd-ink">{p.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="button" className={arrow} onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label={prevLabel}>
          <Chevron flip />
        </button>
        <button type="button" className={arrow} onClick={() => api?.scrollNext()} disabled={!canNext} aria-label={nextLabel}>
          <Chevron />
        </button>
      </div>
    </div>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={flip ? 'h-4 w-4 rotate-180' : 'h-4 w-4'} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}
