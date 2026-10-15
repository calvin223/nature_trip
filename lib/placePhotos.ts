/* Landscape photographs from Wikimedia Commons under CC0 / CC BY / CC BY-SA: the places on the
   Western Ghats Endemics route, and example scenery for the other trips. Credit them wherever they
   are shown (the trip page itineraries do, on each photo) and on /credits/. Chosen and licence-checked 2026-10-14; replace with the client's own
   photos when they arrive (CLIENT_QUESTIONS.md item 30).
   Captions, alt text and `credit.changes` are English; translations overlay them from
   content/<locale>/places.json by slug (findPlace with a locale, or localize() from i18n/content). */

import { localize } from '@/i18n/content';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

export interface PlacePhoto {
  slug: string;
  /** Short caption: what and where. */
  caption: string;
  alt: string;
  /** 1440 px wide; `thumb` is 800 px. */
  src: string;
  thumb: string;
  w: number;
  h: number;
  credit: {
    author: string;
    source: string;
    sourceUrl: string;
    licence: string;
    licenceUrl: string;
    /** Changes made to the original (shown on /credits/, required by CC BY-SA). */
    changes: string;
  };
}

const BY_SA_4 = { licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const BY_2 = { licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/' };
const BY_4 = { licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/' };
const BY_3 = { licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' };
const BY_SA_3 = { licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' };
const CC0 = { licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };
const RESIZED = 'resized and converted to WebP';
const CROPPED = 'cropped at the edges, resized and converted to WebP';
const commons = (file: string) => ({ source: 'Wikimedia Commons', sourceUrl: `https://commons.wikimedia.org/wiki/File:${file}` });

const place = (slug: string, w: number, h: number, p: Omit<PlacePhoto, 'slug' | 'src' | 'thumb' | 'w' | 'h'>): PlacePhoto => ({
  slug,
  src: `/photos/places/${slug}.webp`,
  thumb: `/photos/places/thumb/${slug}.webp`,
  w,
  h,
  ...p,
});

export const placePhotos: PlacePhoto[] = [
  place('thattekad', 1440, 810, {
    caption: 'The Periyar River at Thattekad',
    alt: 'Still water on the Periyar River at Thattekad, reflecting lowland evergreen forest, with a cluster of boulders',
    credit: { author: 'Kandukuru Nagarjun', ...commons('Periyar_at_Thattekkad_(52051862814).jpg'), ...BY_2, changes: RESIZED },
  }),
  place('pampadum-shola', 1440, 960, {
    caption: 'Shola and grassland, Pampadum Shola National Park',
    alt: 'Patches of shola forest and a grassy valley floor below forested hills in Pampadum Shola National Park',
    credit: { author: 'Rainer Halama', ...commons('Pampadum_Shola_National_Park-WUS07337.jpg'), ...BY_SA_4, changes: RESIZED },
  }),
  place('eravikulam', 1440, 960, {
    caption: 'Montane grassland below Anamudi, Eravikulam National Park',
    alt: 'Montane grassland in Eravikulam National Park, with the rock slopes of the Anamudi massif and a misty valley beyond',
    credit: { author: 'Davidvraju', ...commons('Landscape-2Eravikulam_NP.jpg'), ...CC0, changes: RESIZED },
  }),
  place('chinnar', 1440, 962, {
    caption: 'Rain-shadow scrub, Chinnar Wildlife Sanctuary',
    alt: 'Dry scrub forest of Chinnar Wildlife Sanctuary rolling up to a bare granite dome under monsoon clouds',
    credit: { author: 'Vengolis', ...commons('Chinnar5177.jpg'), ...BY_SA_4, changes: RESIZED },
  }),
  place('valparai', 1440, 900, {
    caption: 'Morning mist over the Valparai plateau',
    alt: 'Early-morning mist over tea estates and forested hills of the Valparai plateau, seen from Sheikalmudi',
    credit: { author: 'Timothy A. Gonsalves', ...commons('SE_Morning_View_Sheikalmudi_Feb26_A7CR_10377.jpg'), ...BY_SA_4, changes: RESIZED },
  }),
  place('ooty', 1440, 960, {
    caption: 'The Ketti Valley, just outside Ooty',
    alt: 'Tea terraces and vegetable fields in the Ketti Valley outside Ooty, with the blue Nilgiri ranges in the haze beyond',
    credit: { author: 'Timothy A. Gonsalves', ...commons('Vegetables_Tea_Fields_Nilgiris_Nov25_A7CR_09820-4_HDR1.jpg'), ...BY_SA_4, changes: RESIZED },
  }),
  place('mukurthi', 1440, 1068, {
    caption: 'Nilgiri tahr country, Mukurthi National Park',
    alt: 'Golden grassland ridges, cliffs and strips of shola forest in Mukurthi National Park',
    credit: {
      author: 'A. J. T. Johnsingh, WWF-India and NCF',
      ...commons('Tahr_habitat_in_Mukurthy_National_Park,_AJT_Johnsingh.DSCN3954.jpg'),
      ...BY_SA_4,
      changes: CROPPED,
    },
  }),
  place('bandipur', 1440, 950, {
    caption: 'Dry deciduous forest, Bandipur Tiger Reserve',
    alt: 'Open dry deciduous woodland of Bandipur National Park in fresh green leaf',
    credit: { author: 'Shiva Prasad Patro', ...commons('Bandipur_Forest.jpg'), ...BY_SA_4, changes: CROPPED },
  }),
];

/* Example scenery for trips whose bases are set at booking (their trip page itineraries).
   Chosen and licence-checked 2026-10-14. */
export const exampleScenery: PlacePhoto[] = [
  place('ci-meadow', 1440, 810, {
    caption: 'Meadow at dawn, Kanha Tiger Reserve, Madhya Pradesh',
    alt: 'An open grassland meadow at dawn, framed by bare trees, with forested hills beyond',
    credit: { author: 'Kandukuru Nagarjun', ...commons('Landscape_at_dawn_(51083881847).jpg'), ...BY_2, changes: RESIZED },
  }),
  place('ci-waterhole', 1440, 810, {
    caption: 'Sondar Lake, Kanha Tiger Reserve, Madhya Pradesh',
    alt: 'Still water reflecting a line of sal forest, with dry grass along the shore',
    credit: { author: 'Kandukuru Nagarjun', ...commons('Trees_at_Sounder_lake_(50998865604).jpg'), ...BY_2, changes: RESIZED },
  }),
  place('ci-rocky-edge', 1440, 669, {
    caption: 'Sandstone hills, Bandhavgarh Tiger Reserve, Madhya Pradesh',
    alt: 'Forested sandstone cliffs above a dry meadow in Bandhavgarh',
    credit: { author: 'JP Bennett', ...commons('Hilly_terrain_of_Bandhavgarh_National_Park_Madhya_Pradesh_India.jpg'), ...BY_2, changes: CROPPED },
  }),
  place('ci-village', 1440, 960, {
    caption: 'A buffer-zone village at Kanha Tiger Reserve, Madhya Pradesh',
    alt: 'A dirt lane past village houses and tall trees in morning mist',
    credit: { author: 'Ujwala Dahake', ...commons('Morning_view_in_buffer_zone_of_Kanha_National_Park.jpg'), ...CC0, changes: RESIZED },
  }),
  place('mo-waterfall', 1440, 784, {
    caption: 'Jog Falls in July, Shivamogga district, Karnataka',
    alt: 'Jog Falls in full monsoon flow, framed by wet green forest',
    credit: { author: 'lensnmatter', ...commons('Joga_in_July^_Shimoga_-_Flickr_-_lensnmatter.jpg'), ...CC0, changes: RESIZED },
  }),
  place('mo-spice', 1440, 953, {
    caption: 'Cardamom under shade trees in the Cardamom Hills, Kerala',
    alt: 'Cardamom plants growing in the shade of tall forest trees',
    credit: { author: 'Ziegler175', ...commons('KardamomHillsKardamom.jpg'), ...BY_SA_3, changes: RESIZED },
  }),
  place('mo-stream', 1440, 1080, {
    caption: 'A rainforest stream near Kalpetta, Wayanad, Kerala',
    alt: 'Water rushing over boulders through wet evergreen forest',
    credit: { author: 'Lipikahalder1', ...commons('Water_Gushing_Down_A_Stream_(72903101).jpeg'), ...BY_3, changes: RESIZED },
  }),
  place('hi-views', 1440, 964, {
    caption: 'Trisul and Nanda Devi from Kausani, Uttarakhand',
    alt: 'Snow peaks of Trisul and Nanda Devi above layered, forested foothill ridges, seen from Kausani',
    credit: { author: 'sanjoy (Flickr user)', ...commons('Trisul,_Nanda_Devi_and_Himalayan_range_from_Kausani,_Uttarakhand.jpg'), ...BY_2, changes: RESIZED },
  }),
  place('hi-ridge', 1440, 960, {
    caption: "Crank's Ridge, Kasar Devi, near Almora, Uttarakhand",
    alt: 'A footpath along a pine-covered ridge crest near Almora',
    credit: { author: 'Alexkom000', ...commons("2024-03-19_Crank's_Ridge_1.jpg"), ...BY_4, changes: RESIZED },
  }),
  place('hi-forest', 1440, 960, {
    caption: 'Rhododendrons in bloom on the trail to Sandakphu, Darjeeling hills',
    alt: 'Two large rhododendron trees in full red bloom at the edge of a Himalayan forest',
    credit: { author: 'Abhijit Kar Gupta', ...commons('Rhododendron_in_full_bloom!_(8620051426).jpg'), ...BY_2, changes: RESIZED },
  }),
  place('hi-village', 1440, 960, {
    caption: 'Terraced fields in a village inside Binsar Wildlife Sanctuary, Uttarakhand',
    alt: 'A footpath through terraced wheat fields to a stone-and-slate Kumaoni house, with hills in the haze',
    credit: { author: 'Rajborah123', ...commons('Terrace_farming_in_a_small_himalayan_village(binsar_wild_life_sanctury).jpg'), ...BY_SA_4, changes: RESIZED },
  }),
  place('hi-highforest', 1440, 960, {
    caption: 'Fir forest near the treeline, Singalila National Park, Darjeeling hills',
    alt: 'High-altitude fir forest fading into mist above rhododendron scrub',
    credit: { author: 'Alexkom000', ...commons('2024-03-10_Singalila_National_Park_8.jpg'), ...BY_4, changes: RESIZED },
  }),
];

export function findPlace(slug: string, locale: Locale = DEFAULT_LOCALE): PlacePhoto | undefined {
  const p = placePhotos.find((x) => x.slug === slug) ?? exampleScenery.find((x) => x.slug === slug);
  return p && localize(locale, 'places', [p], (x) => x.slug)[0];
}
