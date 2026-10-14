'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Progressive enhancement for the static SVG maps. The map itself is server-rendered markup
 * passed in as children; this wrapper only:
 *  - starts the route draw-in when the map scrolls into view (skipped for reduced motion), and
 *  - highlights a stop (marker, label, tooltip) while any element carrying its
 *    `data-stop` is hovered or focused, including the rows of the stop list.
 * Without JavaScript the map renders fully drawn (see the CSS safety net in shared.tsx).
 */
export default function MapEnhancer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // --- Draw-in on scroll ---------------------------------------------------------------
    let observer: IntersectionObserver | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // If hydration was slow, the CSS safety net has already drawn the route: leave it.
    if (reduced || typeof IntersectionObserver === 'undefined' || performance.now() > 2800) {
      root.dataset.anim = 'off';
    } else {
      root.dataset.anim = 'wait';
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            root.dataset.anim = 'run';
            observer?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(root);
    }

    // --- Hover / focus highlighting --------------------------------------------------------
    let active: string | null = null;
    const setActive = (id: string | null) => {
      if (id === active) return;
      active = id;
      root.querySelectorAll('[data-stop], [data-tip]').forEach((el) => {
        const key = el.getAttribute('data-stop') ?? el.getAttribute('data-tip');
        if (id !== null && key === id) el.setAttribute('data-active', '');
        else el.removeAttribute('data-active');
      });
    };
    const stopOf = (target: EventTarget | null) =>
      target instanceof Element ? (target.closest('[data-stop]')?.getAttribute('data-stop') ?? null) : null;
    const onOver = (event: Event) => setActive(stopOf(event.target));
    const onLeave = () => setActive(null);
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget)) setActive(null);
    };
    root.addEventListener('pointerover', onOver);
    root.addEventListener('focusin', onOver);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusout', onFocusOut);

    return () => {
      observer?.disconnect();
      root.removeEventListener('pointerover', onOver);
      root.removeEventListener('focusin', onOver);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
