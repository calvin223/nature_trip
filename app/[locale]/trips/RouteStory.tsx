'use client';
/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */

import { useEffect, useRef, useState } from 'react';
import type { RouteDay, RoutePhoto } from '@/lib/routePhotos';

/* The itinerary told by scrolling. On wide screens a sticky photograph of the place sits beside the
   days and cross-fades (opacity only) to the photo of whichever day crosses the middle of the
   screen. On phones (and on paper) the days run as a list, with each photo above the first day it
   belongs to. */
export default function RouteStory({ photos, days }: { photos: RoutePhoto[]; days: RouteDay[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const bg = (blur?: string) => (blur ? { backgroundImage: `url(${blur})`, backgroundSize: 'cover' } : undefined);
  const on = photos[days[active]?.photo];

  return (
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16">
      <div className="route-stage-col hidden lg:block no-print">
        <div className="route-stage" aria-hidden="true">
          {photos.map((p) => (
            <img
              key={p.src}
              src={p.src}
              alt=""
              loading="lazy"
              decoding="async"
              style={bg(p.blur)}
              data-on={p === on ? '' : undefined}
            />
          ))}
          <div className="photo-scrim z-10 flex items-end justify-between gap-6">
            <p className="photo-label text-base">{on?.caption}</p>
            <p className="shrink-0 text-right text-[0.7rem] text-white/70">{on?.credit}</p>
          </div>
        </div>
      </div>

      <ol className="lg:py-[10vh]">
        {days.map((d, i) => {
          const p = photos[d.photo];
          return (
            <li
              key={d.label}
              ref={(el) => { items.current[i] = el; }}
              data-i={i}
              data-on={i === active ? '' : undefined}
              className="route-stop mb-10 lg:mb-0"
            >
              {(i === 0 || days[i - 1].photo !== d.photo) && (
                <figure className="lg:hidden mb-5 no-print">
                  <img
                    src={p.thumb}
                    srcSet={`${p.thumb} 800w, ${p.src} 1440w`}
                    sizes="100vw"
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    style={bg(p.blur)}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                  <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 text-xs text-wd-faint">
                    <span>{p.caption}</span>
                    <span>{p.credit}</span>
                  </figcaption>
                </figure>
              )}
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-wd-ink">
                <span className="mb-2 block text-sm font-semibold text-wd-lime">{d.label}</span>{' '}
                {d.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-wd-muted">{d.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
