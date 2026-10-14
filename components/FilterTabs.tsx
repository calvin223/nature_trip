'use client';

import { useLayoutEffect, useRef } from 'react';

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

/* Underline tabs for filtering a collection. One underline slides from the old tab to the new
   one (CSS transform transition on a 1px bar scaled to the tab's width, so it stays put inside
   the sticky bar); reduced-motion users get an instant move. */
export default function FilterTabs({
  tabs,
  value,
  onChange,
  label,
  className = '',
}: {
  tabs: FilterTab[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;
    const place = () => {
      const on = root.querySelector<HTMLElement>('.tab[aria-pressed="true"]');
      if (on) bar.style.transform = `translateX(${on.offsetLeft}px) scaleX(${on.offsetWidth})`;
    };
    place();
    /* Slide only after the first placement, so the bar doesn't sweep in on page load. */
    const raf = requestAnimationFrame(() => bar.setAttribute('data-ready', ''));
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [value]);

  return (
    <div ref={rootRef} className={`tabs ${className}`} role="group" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          className="tab"
          aria-pressed={t.value === value}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {t.count !== undefined && <span className="tab__count">{t.count}</span>}
        </button>
      ))}
      <span ref={barRef} className="tab__bar" aria-hidden="true" />
    </div>
  );
}
