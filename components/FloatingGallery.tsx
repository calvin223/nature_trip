'use client';

/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { useLocale, useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';
import { THUMB_WIDTH, img, photoName, type Photo } from '@/lib/photos';

/* Adapted from Originkit's Floating Gallery. Instead of free-floating cards that overlap, photos
   are packed into masonry columns and each column drifts down on a seamless loop (two copies of
   the column, translateY -50% -> 0, see .float-gallery in globals.css) at its own pace. Keyboard
   focus pauses it; drift={false} or reduced motion gets a still masonry. */

const SPEEDS = [1, 0.8, 1.15, 0.9];
const SECS_PER_RATIO = 9; // seconds to drift one column-width of height
const MIN_RATIO_PER_COL = 4.5; // each column must outgrow the frame, or the loop shows a gap

function subscribe(onChange: () => void) {
  const mqs = ['(min-width: 768px)', '(min-width: 1024px)'].map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener('change', onChange));
  return () => mqs.forEach((m) => m.removeEventListener('change', onChange));
}
function columnCount() {
  if (window.matchMedia('(min-width: 1024px)').matches) return 4;
  return window.matchMedia('(min-width: 768px)').matches ? 3 : 2;
}

export default function FloatingGallery({
  photos,
  onSelect,
  drift = true,
}: {
  photos: Photo[];
  onSelect: (index: number) => void;
  drift?: boolean;
}) {
  const t = useTranslations('common.gallery');
  const locale = useLocale();
  const cols = useSyncExternalStore(subscribe, columnCount, () => 4);

  /* Small groups (5 frogs) are repeated until every column is tall enough to loop. */
  const ratio = (p: Photo) => p.h / p.w;
  const setRatio = photos.reduce((s, p) => s + ratio(p), 0);
  const repeats = !drift ? 1 : setRatio ? Math.ceil((MIN_RATIO_PER_COL * cols) / setRatio) : 0;
  const columns = Array.from({ length: cols }, () => ({ tiles: [] as number[], ratio: 0 }));
  for (let i = 0; i < photos.length * repeats; i++) {
    const col = columns[i % cols];
    col.tiles.push(i);
    col.ratio += ratio(photos[i % photos.length]);
  }

  return (
    <div className={drift ? 'float-gallery' : 'float-gallery float-gallery--still'}>
      {columns.map((col, c) => {
        const dur = (col.ratio * SECS_PER_RATIO) / SPEEDS[c % SPEEDS.length];
        return (
          <div key={c} className="float-gallery__col">
            <div
              className="float-gallery__track"
              style={{ animationDuration: `${dur}s`, animationDelay: `${-dur * ((c * 0.37) % 1)}s` }}
            >
              {(drift ? [0, 1] : [0]).map((copy) =>
                col.tiles.map((i) => {
                  const p = photos[i % photos.length];
                  const name = photoName(p, locale);
                  /* Loop copies and repeats are decorative: hidden from AT, keyboard and reduced motion. */
                  const dup = copy === 1 || i >= photos.length;
                  return (
                    <button
                      key={`${copy}-${i}`}
                      type="button"
                      onClick={() => onSelect(i % photos.length)}
                      aria-label={t('enlarge', { name })}
                      aria-hidden={dup || undefined}
                      tabIndex={dup ? -1 : undefined}
                      data-dup={dup || undefined}
                      className="photo-tile photo-tile--captioned block w-full mb-3 cursor-zoom-in"
                    >
                      <img
                        src={img(p.thumb)}
                        srcSet={`${img(p.thumb)} ${THUMB_WIDTH}w, ${img(p.src)} ${p.w}w`}
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw"
                        alt=""
                        width={p.w}
                        height={p.h}
                        loading="lazy"
                        decoding="async"
                        style={{ aspectRatio: `${p.w} / ${p.h}` }}
                      />
                      <span className="photo-tile__caption text-left">{name}</span>
                    </button>
                  );
                }),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
