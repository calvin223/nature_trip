'use client';
/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */

import { useEffect, useRef, useState } from 'react';

export interface RouteStop {
  label: string;
  title: string;
  body: string;
  /** Already basePath-prefixed. */
  src: string;
  thumb: string;
  alt: string;
  caption: string;
  /** The photo credit as shown on it, e.g. "Photo: Name, licence" (already translated: this component has no messages). */
  credit: string;
  blur?: string;
}

/* The route told by scrolling. On wide screens a sticky photograph of the place sits beside the
   stops and cross-fades (opacity only) to whichever stop crosses the middle of the screen. On
   phones each stop simply carries its own photograph. */
export default function RouteStory({ stops }: { stops: RouteStop[] }) {
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
  const on = stops[active];

  return (
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16">
      <div className="route-stage-col hidden lg:block">
        <div className="route-stage" aria-hidden="true">
          {stops.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt=""
              decoding="async"
              style={bg(s.blur)}
              data-on={i === active ? '' : undefined}
            />
          ))}
          <div className="photo-scrim z-10 flex items-end justify-between gap-6">
            <p className="photo-label">
              <span className="block text-white/80">{on?.label}</span>
              <span className="block text-base">{on?.caption}</span>
            </p>
            <p className="shrink-0 text-right text-[0.7rem] text-white/70">{on?.credit}</p>
          </div>
        </div>
      </div>

      <ol className="lg:py-[10vh]">
        {stops.map((s, i) => (
          <li
            key={s.label}
            ref={(el) => { items.current[i] = el; }}
            data-i={i}
            data-on={i === active ? '' : undefined}
            className="route-stop mb-10 lg:mb-0"
          >
            <figure className="lg:hidden mb-5">
              <img
                src={s.thumb}
                srcSet={`${s.thumb} 800w, ${s.src} 1440w`}
                sizes="100vw"
                alt={s.alt}
                loading="lazy"
                decoding="async"
                style={bg(s.blur)}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 text-xs text-wd-faint">
                <span>{s.caption}</span>
                <span>{s.credit}</span>
              </figcaption>
            </figure>
            <p className="text-sm font-semibold text-wd-lime">{s.label}</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold text-wd-ink">{s.title}</h2>
            <p className="mt-3 max-w-md leading-relaxed text-wd-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
