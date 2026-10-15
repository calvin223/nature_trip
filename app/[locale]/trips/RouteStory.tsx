'use client';
/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */

import { useEffect, useRef, useState } from 'react';
import type { RouteDay, RoutePhoto } from '@/lib/routePhotos';

/* The itinerary told by scrolling. On wide screens a sticky photograph of the place sits beside the
   days and cross-fades (opacity only) to the photo of whichever day crosses the middle of the
   screen. Below that (phones, portrait tablets) the days run as a plain list with no photos, each
   joined to the next by a centred arrow whose tail fades in from above; the
   photos are never downloaded there. On paper the list prints without the arrows. The arrow carries
   its own size and stroke as attributes, so it stays a small line even if the stylesheet is late or
   stale (unstyled, an SVG fills its column and paints the arrowhead as a solid black triangle). */
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
        {days.map((d, i) => (
          <li
            key={d.label}
            ref={(el) => { items.current[i] = el; }}
            data-i={i}
            data-on={i === active ? '' : undefined}
            className="route-stop"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-wd-ink">
              <span className="mb-2 block text-sm font-semibold text-wd-lime">{d.label}</span>{' '}
              {d.title}
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-wd-muted">{d.body}</p>
            {i < days.length - 1 && (
              <svg
                className="mx-auto mt-4 mb-4 block text-wd-lime lg:hidden no-print"
                width="16"
                height="30"
                viewBox="0 0 16 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                {/* userSpaceOnUse: a gradient sized to a straight vertical line's own box (zero width) never paints. */}
                <defs>
                  <linearGradient id={`route-tail-${i}`} gradientUnits="userSpaceOnUse" x1="8" y1="2" x2="8" y2="21">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                    <stop offset="1" stopColor="currentColor" />
                  </linearGradient>
                </defs>
                <path d="M8 2v25" stroke={`url(#route-tail-${i})`} />
                <path d="M3.5 22.5 8 27l4.5-4.5" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
