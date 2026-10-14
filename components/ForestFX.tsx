'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* Motion controller for the floating 3D theme.
   - --p (scroll progress), --px/--py (pointer) on <html>: the forest stage and hero tilt read these.
   - .reveal elements fade up as they enter the viewport.
   - Content blocks float at their own depth as you scroll: direct children of
     `.wd-section > .wd-wrap`, children of `.float-grid`, and anything with [data-float].
   - .card-3d tilts towards the pointer with a following glare (fine pointers only).
   Re-scans on every client-side route change. Reduced motion turns all of it off. */

const RATES = [0.05, 0.09, 0.07];

export default function ForestFX() {
  const pathname = usePathname();

  // Global listeners: scroll progress, pointer, card tilt. Set up once.
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

    let raf = 0;
    let px = 0, py = 0;
    const flush = () => {
      raf = 0;
      const max = root.scrollHeight - innerHeight;
      root.style.setProperty('--p', (max > 0 ? Math.min(1, scrollY / max) : 0).toFixed(4));
      root.style.setProperty('--px', px.toFixed(3));
      root.style.setProperty('--py', py.toFixed(3));
      document.querySelector('.site-nav')?.classList.toggle('is-scrolled', scrollY > 24);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(flush); };
    const onMove = (e: PointerEvent) => {
      px = e.clientX / innerWidth - 0.5;
      py = e.clientY / innerHeight - 0.5;
      queue();
    };

    let tilted: HTMLElement | null = null;
    const resetTilt = (el: HTMLElement) => {
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    const onCard = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>('.card-3d') ?? null;
      if (tilted && tilted !== card) resetTilt(tilted);
      tilted = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - y) * 6).toFixed(2)}deg`);
    };

    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    if (fine) {
      addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointermove', onCard, { passive: true });
    }
    flush();
    return () => {
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointermove', onCard);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Per-page: reveal-on-scroll and depth floaters.
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    document.querySelector('.site-nav')?.classList.toggle('is-scrolled', scrollY > 24);

    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    reveals.forEach((el) => io.observe(el));

    if (!CSS.supports('translate', '0 1px')) return () => io.disconnect();

    const floaters = Array.from(
      document.querySelectorAll<HTMLElement>('main .wd-section > .wd-wrap > *, main .float-grid > *, main [data-float]'),
    ).filter((el) => !el.matches('.float-grid, [data-no-float]') && !el.closest('[data-no-float]'));
    const rate = new WeakMap<HTMLElement, number>();
    const shift = new WeakMap<HTMLElement, number>();
    const onScreen = new Set<HTMLElement>();
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target as HTMLElement) : onScreen.delete(e.target as HTMLElement)));
        queue();
      },
      { rootMargin: '25% 0px' },
    );
    floaters.forEach((el) => {
      el.classList.add('float');
      const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      rate.set(el, RATES[idx % RATES.length]);
      io2.observe(el);
    });

    let queued = false;
    function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    const update = () => {
      queued = false;
      const vh = innerHeight;
      const k = innerWidth < 820 ? 0.45 : 1;
      onScreen.forEach((el) => {
        const r = el.getBoundingClientRect();
        const offset = r.top - (shift.get(el) ?? 0) + r.height / 2 - vh / 2; // untransformed centre vs viewport centre
        const y = Math.max(-40, Math.min(40, -offset * (rate.get(el) ?? 0.06) * k));
        shift.set(el, y);
        el.style.translate = `0 ${y.toFixed(1)}px`;
      });
    };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);

    return () => {
      io.disconnect();
      io2.disconnect();
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      floaters.forEach((el) => { el.style.translate = ''; el.classList.remove('float'); });
    };
  }, [pathname]);

  return null;
}
