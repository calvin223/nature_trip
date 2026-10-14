import { createTranslator } from 'next-intl';
import { overlayEntry } from '@/i18n/content';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import { loadMessages, type Messages } from '@/messages';
import type { Trip } from './data';
import { findPhoto, photoName } from './photos';
import { findPlace, type PlacePhoto } from './placePhotos';

/* One photograph per "Scenery along the way" item on each trip page, in the same order as
   `sceneryHighlights` in lib/data.ts. `place:<slug>` is a credited Wikimedia Commons photo from
   lib/placePhotos.ts; a bare slug is one of the client's own photos in lib/photos.ts.
   `where` is shown as "Photographed at …" when the photo is an example from somewhere else
   (trips whose parks and bases are set at booking), so it never claims to be the exact place;
   its wording is in messages/<locale>/tripDetail.json → scenery.where. */
type Entry = { key: string; where?: keyof Messages['tripDetail']['scenery']['where'] };

const SCENERY: Record<string, Entry[]> = {
  'western-ghats-endemics': [
    { key: 'place:thattekad' },
    { key: 'place:pampadum-shola' },
    { key: 'place:eravikulam' },
    { key: 'place:chinnar' },
    { key: 'place:valparai' },
    { key: 'place:ooty', where: 'kettiValley' },
    { key: 'place:mukurthi' },
  ],
  'central-india-big-cats': [
    { key: 'place:ci-meadow', where: 'kanha' },
    { key: 'place:ci-waterhole', where: 'sondarLake' },
    { key: 'place:ci-rocky-edge', where: 'bandhavgarh' },
    { key: 'place:ci-village', where: 'kanhaVillage' },
  ],
  'monsoon-rainforest-nights': [
    { key: 'place:mo-waterfall', where: 'jogFalls' },
    { key: 'place:mo-spice', where: 'cardamomHills' },
    { key: 'place:mo-stream', where: 'wayanad' },
  ],
  'himalaya-birds-mountain-wildlife': [
    { key: 'place:hi-views', where: 'kausani' },
    { key: 'place:hi-ridge', where: 'cranksRidge' },
    { key: 'place:hi-forest', where: 'sandakphu' },
    { key: 'place:hi-village', where: 'binsar' },
    { key: 'place:hi-highforest', where: 'singalila' },
  ],
};

export interface SceneryPhoto {
  src: string;
  thumb: string;
  thumbW: number;
  w: number;
  alt: string;
  /** Where an example photo was taken. */
  where?: string;
  /** "Author, licence" for third-party photos; the client's own photos need none. */
  credit?: string;
}

function resolve({ key }: Entry, tripId: string, locale: Locale): Omit<SceneryPhoto, 'where'> {
  if (key.startsWith('place:')) {
    const p = findPlace(key.slice(6));
    if (!p) throw new Error(`lib/sceneryPhotos: "${key}" for ${tripId} not found in lib/placePhotos.ts`);
    const alt = overlayEntry<PlacePhoto>(locale, 'places', p.slug)?.alt ?? p.alt;
    return { src: p.src, thumb: p.thumb, thumbW: 800, w: p.w, alt, credit: `${p.credit.author}, ${p.credit.licence}` };
  }
  const p = findPhoto(key);
  if (!p) throw new Error(`lib/sceneryPhotos: "${key}" for ${tripId} not found in lib/photos.ts`);
  // Client thumbnails are 480 or 640 px on the long side.
  return { src: p.src, thumb: p.thumb, thumbW: p.w >= p.h ? 480 : Math.round((480 * p.w) / p.h), w: p.w, alt: photoName(p, locale) };
}

/** The scenery photos for a trip, in `locale`, failing the build if the list and the data drift apart. */
export function sceneryFor(trip: Trip, locale: Locale = DEFAULT_LOCALE): SceneryPhoto[] {
  const entries = SCENERY[trip.id];
  if (!entries || entries.length !== trip.sceneryHighlights.length) {
    throw new Error(`lib/sceneryPhotos: ${trip.id} has ${trip.sceneryHighlights.length} scenery items but ${entries?.length ?? 0} photos`);
  }
  const t = createTranslator({ locale, messages: loadMessages(locale), namespace: 'tripDetail.scenery.where' });
  return entries.map((e) => ({ ...resolve(e, trip.id, locale), where: e.where && t(e.where) }));
}
