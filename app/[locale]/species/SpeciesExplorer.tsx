'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type FocusEvent } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import type { Species } from '@/lib/data';
import BlurCarousel from '@/components/BlurCarousel';
import FilterTabs from '@/components/FilterTabs';
import FloatingGallery from '@/components/FloatingGallery';
import SpeciesCaption, { captionsToggle } from '@/components/SpeciesCaption';
import { factsFor } from '@/lib/speciesFacts';
import {
  img,
  photoCategories,
  photoName,
  photosForTab,
  speciesMatchesTab,
  speciesTabs,
  tabForPhotoCategory,
  thumbWidth,
  type Photo,
} from '@/lib/photos';

/* Focus species are "species we plan routes around", each shown with its field photo (resolved by
   species/page.tsx on the server, so the content sets never reach this client bundle). */
export type FocusSpecies = Species & { photo: Photo };

type Tab = (typeof speciesTabs)[number];

const TAB_COUNTS: Record<string, number> = Object.fromEntries(speciesTabs.map((t) => [t, photosForTab(t).length]));

/* Filter tabs, a focus-species carousel and a field gallery. Selecting a photo opens it full screen
   with the species notes (yet-another-react-lightbox: swipe, arrow keys, Escape; the notes
   can be hidden with the caption toggle; focus returns to the page). */
export default function SpeciesExplorer({
  seenOn,
  focusSpecies,
}: {
  seenOn: Record<string, string>;
  focusSpecies: FocusSpecies[];
}) {
  const t = useTranslations('species');
  const tl = useTranslations('common.lightbox');
  const locale = useLocale();
  /* Tab values stay English (they are the filter keys); only their labels are translated. */
  const tabLabel = (tab: string) => t(`tabs.${tab as Tab}`);
  const [selected, setSelected] = useState<string>('All');
  const [active, setActive] = useState(-1);
  const [switched, setSwitched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Switching from deep in a long group to a short one would leave an empty screen, so return to
     the tabs. Instantly, in the same frame as the swap: the new group fades in (.wd-swap) over
     the jump, where a long smooth scroll would lurch as the shorter page clamps it mid-way. */
  const pickTab = (tab: string) => {
    setSelected(tab);
    setSwitched(true);
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  /* Keyed on the tab: remounts the carousel (back to its first species) and the gallery (drift
     restarts at the new pace), and replays the fade. Not on first load. */
  const swap = switched ? 'wd-swap' : undefined;

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

  return (
    <div ref={rootRef} className="scroll-mt-16 md:scroll-mt-[72px]">
      {/* Anchor targets for /species/#cat-<category>, clear of the fixed nav. */}
      {photoCategories.map((c) => (
        <span key={c.id} id={`cat-${c.id}`} className="block scroll-mt-28" aria-hidden="true" />
      ))}

      {/* Sticks under the main nav on the same translucent paper, so the filter stays at hand. */}
      <div className="sticky top-16 md:top-[72px] z-40 mb-8 bg-wd-night">
        <FilterTabs
          className="tabs--center"
          label={t('filter.label')}
          value={selected}
          onChange={pickTab}
          tabs={speciesTabs.map((tab) => ({ value: tab, label: tabLabel(tab), count: TAB_COUNTS[tab] }))}
        />
      </div>

      {cards.length > 0 && (
        <div key={`focus-${selected}`} className={`mb-10 ${swap ?? ''}`}>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-wd-ink mb-5">{t('focus.title')}</h2>
          <FocusCarousel list={cards} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h2 className="h-section">{selected === 'All' ? t('gallery.allTitle') : tabLabel(selected)}</h2>
        </div>
        <p className="text-sm text-wd-muted" aria-live="polite">
          {t('gallery.count', { count: gallery.length })}
        </p>
      </div>

      {/* Only the full collection drifts; a filtered group sits still so it's easy to scan. */}
      <div key={`gallery-${selected}`} className={swap}>
        <FloatingGallery photos={gallery} onSelect={setActive} drift={selected === 'All'} />
      </div>

      <Lightbox
        open={active >= 0}
        index={Math.max(active, 0)}
        close={() => setActive(-1)}
        plugins={[Captions]}
        animation={{ fade: 200, swipe: 300, navigation: 0, easing: { fade: 'ease', swipe: 'cubic-bezier(0.32, 0.72, 0, 1)', navigation: 'ease' } }}
        captions={{ showToggle: true, descriptionTextAlign: 'start' }}
        render={{ buttonCaptions: captionsToggle }}
        labels={{
          Close: tl('close'),
          Previous: tl('previous'),
          Next: tl('next'),
          Lightbox: tl('dialog'),
          Carousel: tl('carousel'),
          'Photo gallery': tl('gallery'),
          Slide: tl('slide'),
          '{index} of {total}': tl('slideOf', { index: '{index}', total: '{total}' }),
          Caption: tl('caption'),
          'Show captions': tl('showCaptions'),
          'Hide captions': tl('hideCaptions'),
        }}
        slides={gallery.map((p) => ({
          src: img(p.src),
          width: p.w,
          height: p.h,
          alt: photoName(p, locale),
          title: photoName(p, locale),
          description: <SpeciesCaption facts={factsFor(p.slug, locale)} seenOn={seenOn[p.slug]} />,
        }))}
      />
    </div>
  );
}

/* Photo on the left, its details on the right; autoplay, the arrows and the dots all move both.
   Autoplay is the active dot's fill (.focus__dot, 5 s linear): when it completes, the next species
   shows. Hovering or focusing anywhere pauses the fill, and so the timer, exactly where it is; the
   pause button beside the dots holds it until pressed again (touch has no hover to rely on); reduced
   motion has no fill and so no autoplay (and no button). Changes are announced only while paused. */
function FocusCarousel({ list }: { list: FocusSpecies[] }) {
  const t = useTranslations('species');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // hover or focus
  const [stopped, setStopped] = useState(false); // the pause button
  const held = paused || stopped;

  return (
    <div
      className="grid gap-6 md:grid-cols-12 md:gap-10 md:items-center"
      data-paused={held || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e: FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <BlurCarousel
        className="md:col-span-7"
        label={t('focus.title')}
        slides={list.map(({ photo: p, commonName }) => ({
          src: img(p.thumb),
          srcSet: `${img(p.thumb)} ${thumbWidth(p)}w, ${img(p.src)} ${p.w}w`,
          alt: commonName,
        }))}
        sizes="(min-width: 1280px) 700px, (min-width: 768px) 56vw, 100vw"
        index={index}
        onIndexChange={setIndex}
      />

      <div className="md:col-span-5">
        {/* All details share one grid cell, so the block is as tall as the longest and the page
            below never jumps as they change. */}
        <div className="grid" aria-live={held ? 'polite' : 'off'}>
          {list.map((sp, i) => (
            <div key={sp.id} className="focus__detail" data-active={i === index || undefined} inert={i !== index}>
              <p className="focus__tags">
                <span>{t(`categories.${sp.category}`)}</span>
                {sp.endemic && <span className="text-wd-sun">{t('focus.endemic')}</span>}
                {sp.threatened && <span className="text-wd-trogon">{t('focus.threatened')}</span>}
              </p>
              <h3 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight text-wd-ink">{sp.commonName}</h3>
              <p className="mt-1 italic text-wd-faint">{sp.scientificName}</p>
              <div className="focus__row mt-5">
                <p className="focus__label">{t('focus.habitat')}</p>
                <p>{sp.habitat}</p>
              </div>
              <div className="focus__row">
                <p className="focus__label">{t('focus.fieldNote')}</p>
                <p>{sp.fieldNote}</p>
              </div>
            </div>
          ))}
        </div>

        {list.length > 1 && (
          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm tabular-nums text-wd-faint">
              {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
            <div className="flex">
              {list.map((sp, i) => (
                <button
                  key={sp.id}
                  type="button"
                  className="focus__dot"
                  aria-label={t('focus.show', { name: sp.commonName })}
                  aria-current={i === index || undefined}
                  onClick={() => setIndex(i)}
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'wd-dot-fill') setIndex((i + 1) % list.length);
                  }}
                />
              ))}
            </div>
            {/* Resuming clears the hover/focus pause too, so the press shows at once (the next
                pointerenter or focus pauses again as usual). */}
            <button
              type="button"
              className="focus__toggle"
              aria-label={stopped ? t('focus.resume') : t('focus.pause')}
              onClick={() => {
                setStopped(!stopped);
                setPaused(false);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={stopped ? 'M8 5v14l11-7z' : 'M7 5h3v14H7zM14 5h3v14h-3z'} />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
