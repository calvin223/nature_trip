import { createTranslator } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { loadMessages, type Messages } from '@/messages';
import type { Trip } from './data';
import { img } from './photos';
import { findPlace } from './placePhotos';
import { blurUrl } from './placeholders';

/* The photographs in each trip page's itinerary (RouteStory). Each stop is a landscape photo from
   lib/placePhotos.ts, shown from day `from` until the next stop's day, so the picture changes as the
   route moves on. `where` marks an example photo from somewhere else (trips whose parks and bases
   are set at booking): it is captioned "Photographed at …", so it never claims to be the exact
   place; its wording is in messages/<locale>/tripDetail.json → itinerary.where. */
type Stop = { from: number; slug: string; where?: keyof Messages['tripDetail']['itinerary']['where'] };

const ROUTE: Record<string, Stop[]> = {
  'western-ghats-endemics': [
    { from: 1, slug: 'thattekad' },
    { from: 3, slug: 'pampadum-shola' },
    { from: 4, slug: 'eravikulam' },
    { from: 5, slug: 'chinnar' },
    { from: 6, slug: 'valparai' },
    { from: 8, slug: 'ooty' },
    { from: 9, slug: 'mukurthi' },
    { from: 10, slug: 'bandipur' },
  ],
  'central-india-big-cats': [
    { from: 1, slug: 'ci-meadow', where: 'kanha' },
    { from: 3, slug: 'ci-waterhole', where: 'sondarLake' },
    { from: 4, slug: 'ci-village', where: 'kanhaVillage' },
    { from: 5, slug: 'ci-rocky-edge', where: 'bandhavgarh' },
  ],
  'monsoon-rainforest-nights': [
    { from: 1, slug: 'mo-spice', where: 'cardamomHills' },
    { from: 2, slug: 'mo-stream', where: 'wayanad' },
    { from: 3, slug: 'mo-waterfall', where: 'jogFalls' },
  ],
  'himalaya-birds-mountain-wildlife': [
    { from: 1, slug: 'hi-views', where: 'kausani' },
    { from: 2, slug: 'hi-forest', where: 'sandakphu' },
    { from: 3, slug: 'hi-ridge', where: 'cranksRidge' },
    { from: 4, slug: 'hi-village', where: 'binsar' },
    { from: 5, slug: 'hi-highforest', where: 'singalila' },
  ],
};

export interface RoutePhoto {
  /** Already basePath-prefixed. */
  src: string;
  thumb: string;
  alt: string;
  caption: string;
  /** "Photo: Name, licence" */
  credit: string;
  blur?: string;
}

export interface RouteDay {
  /** "Day 3" */
  label: string;
  title: string;
  body: string;
  /** Index into the photos. */
  photo: number;
}

/** The itinerary of `trip` (already in `locale`) with its photos, translated, ready for RouteStory.
    Fails the build if a photo is missing or the first day has none. */
export function routeFor(trip: Trip, locale: Locale): { photos: RoutePhoto[]; days: RouteDay[] } {
  const stops = ROUTE[trip.id];
  if (!stops || stops[0].from > Math.min(...trip.itinerary.map((d) => d.day))) {
    throw new Error(`lib/routePhotos: ${trip.id} has no route photo for its first day`);
  }
  const t = createTranslator({ locale, messages: loadMessages(locale), namespace: 'tripDetail.itinerary' });
  return {
    photos: stops.map(({ slug, where }) => {
      const p = findPlace(slug, locale);
      if (!p) throw new Error(`lib/routePhotos: "${slug}" for ${trip.id} not found in lib/placePhotos.ts`);
      return {
        src: img(p.src),
        thumb: img(p.thumb),
        alt: p.alt,
        caption: where ? t('photographedAt', { where: t(`where.${where}`) }) : p.caption,
        credit: t('credit', { credit: `${p.credit.author}, ${p.credit.licence}` }),
        blur: blurUrl(p.src),
      };
    }),
    days: trip.itinerary.map((d) => ({
      label: t('day', { day: d.day }),
      title: d.title,
      body: d.description,
      photo: stops.findLastIndex((s) => s.from <= d.day),
    })),
  };
}
