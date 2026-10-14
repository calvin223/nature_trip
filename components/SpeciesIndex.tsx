'use client';
/* eslint-disable @next/next/no-img-element -- static export with images.unoptimized: plain <img> with img() adds the basePath, as across the site. */

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { img } from '@/lib/photos';
import type { SpeciesFacts } from '@/lib/speciesFacts';
import FilterTabs from './FilterTabs';
import SpeciesCaption, { captionsToggle } from './SpeciesCaption';

export type SpeciesGroup = 'birds' | 'mammals' | 'reptilesFrogs';

export interface IndexSpecies {
  slug: string;
  name: string;
  latin: string;
  group: SpeciesGroup;
  /** Where on our routes, from the itineraries. */
  where: string;
  endemic: boolean;
  src: string;
  thumb: string;
  w: number;
  h: number;
  /** Blur placeholder data URL (from lib/placeholders), resolved on the server. */
  blur?: string;
  /** Notes for the full-screen view (lib/speciesFacts), resolved on the server. */
  facts?: SpeciesFacts;
}

/* Filterable species index. Filtering re-flows the grid with a critically damped spring
   (no bounce), so tiles glide to their new places; reduced-motion users get an instant swap.
   Lightbox: a flick follows through on the drawer curve; arrow keys and buttons change photo
   instantly (keyboard actions repeat too often to animate).
   Selecting a photo opens it full screen with the species notes. */
export default function SpeciesIndex({ species, groups }: { species: IndexSpecies[]; groups: SpeciesGroup[] }) {
  const t = useTranslations('home.speciesIndex');
  const tg = useTranslations('common.gallery');
  const tl = useTranslations('common.lightbox');
  const [group, setGroup] = useState<'all' | SpeciesGroup>('all');
  const [open, setOpen] = useState(-1);
  const visible = group === 'all' ? species : species.filter((s) => s.group === group);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', bounce: 0, duration: 0.35 }}>
      <FilterTabs
        className="mb-8"
        label={t('filterLabel')}
        value={group}
        onChange={(g) => setGroup(g as 'all' | SpeciesGroup)}
        tabs={(['all', ...groups] as const).map((g) => ({ value: g, label: t(`groups.${g}`) }))}
      />

      <motion.ul layout className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((s, i) => (
            <motion.li
              key={s.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full text-left cursor-zoom-in transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
                aria-label={tg('enlarge', { name: s.name })}
              >
                <span
                  className="block aspect-square overflow-hidden rounded-xl bg-wd-deep"
                  style={s.blur ? { backgroundImage: `url(${s.blur})`, backgroundSize: 'cover' } : undefined}
                >
                  <img
                    src={img(s.thumb)}
                    srcSet={`${img(s.thumb)} 480w, ${img(s.src)} ${s.w}w`}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-wd-ink">{s.name}</span>
                  {s.endemic && <span className="chip chip-sun text-xs shrink-0">{t('endemic')}</span>}
                </span>
                <span className="block font-display italic text-wd-muted">{s.latin}</span>
                <span className="block text-xs text-wd-lime mt-0.5">{s.where}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox
        open={open >= 0}
        index={Math.max(open, 0)}
        close={() => setOpen(-1)}
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
        slides={visible.map((s) => ({
          src: img(s.src),
          width: s.w,
          height: s.h,
          alt: s.name,
          title: s.name,
          description: <SpeciesCaption facts={s.facts} seenOn={s.where} />,
        }))}
      />
    </MotionConfig>
  );
}
