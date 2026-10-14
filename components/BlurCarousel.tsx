'use client';

/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */
import { useTranslations } from 'next-intl';
import { useRef, useState, type PointerEvent } from 'react';

export interface BlurSlide {
  src: string;
  srcSet?: string;
  alt: string;
}

/* Adapted from Originkit's Blur Carousel: stacked photos crossfade; hovering a side blurs that
   edge and lights its arrow, and pressing tilts the frame toward it (see .blur-carousel in
   globals.css). Changed for this site: it is controlled (index / onIndexChange) so the page can
   show the active slide's details (and drive autoplay from outside), each arrow is a real button
   covering half the photo, the frame is fluid instead of fixed pixels, and a sideways swipe changes
   slide (touch-action: pan-y keeps vertical page scroll with the browser). */

const TILT = 10; // degrees the frame leans toward a pressed arrow
const PRESS_SHIFT = 6; // px
const PRESS_SCALE = 0.965;
const SWIPE_PX = 40;

export default function BlurCarousel({
  slides,
  index,
  onIndexChange,
  sizes,
  label,
  className = '',
}: {
  slides: BlurSlide[];
  index: number;
  onIndexChange: (index: number) => void;
  sizes: string;
  label: string;
  className?: string;
}) {
  const t = useTranslations('common.gallery');
  const n = slides.length;
  const [hover, setHover] = useState(0); // -1 previous side, 1 next side
  const [press, setPress] = useState(0);
  const go = (dir: number) => onIndexChange((((index + dir) % n) + n) % n);
  const swipe = useRef({ x: 0, y: 0, done: false });

  const onDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, done: false };
  };
  const onUp = (e: PointerEvent) => {
    const dx = e.clientX - swipe.current.x;
    if (n < 2 || Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(e.clientY - swipe.current.y)) return;
    swipe.current.done = true; // the click that follows this pointerup must not also step
    go(dx < 0 ? 1 : -1);
  };

  return (
    <div className={`blur-carousel ${className}`} role="group" aria-roledescription={t('carousel')} aria-label={label}>
      <div
        className="blur-carousel__frame"
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={
          press ? { transform: `translateX(${press * PRESS_SHIFT}px) rotateY(${press * TILT}deg) scale(${PRESS_SCALE})` } : undefined
        }
      >
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            srcSet={s.srcSet}
            sizes={sizes}
            alt={s.alt}
            aria-hidden={i !== index || undefined}
            data-active={i === index || undefined}
            draggable={false}
            decoding="async"
            className="blur-carousel__img"
          />
        ))}
        {n > 1 &&
          [-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir < 0 ? t('previous') : t('next')}
              data-side={dir < 0 ? 'prev' : 'next'}
              data-hover={hover === dir || undefined}
              className="blur-carousel__side"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(dir)}
              onPointerLeave={() => {
                setHover(0);
                setPress(0);
              }}
              onPointerDown={() => setPress(dir)}
              onPointerUp={() => setPress(0)}
              onPointerCancel={() => setPress(0)}
              onClick={() => {
                if (swipe.current.done) swipe.current.done = false;
                else go(dir);
              }}
            >
              <span className="blur-carousel__blur" aria-hidden="true" />
              <svg
                className="blur-carousel__arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points={dir < 0 ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
              </svg>
            </button>
          ))}
      </div>
    </div>
  );
}
