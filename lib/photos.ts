import { overlayEntry } from '@/i18n/content';
import type { Locale } from '@/i18n/locales';
import type { PlacePhoto } from './placePhotos';

export interface Photo {
  category: string;
  slug: string;
  name: string;
  src: string;
  thumb: string;
  w: number;
  h: number;
  /* Landscape re-crop for the wide trip card/hero frames, where a portrait
     original would otherwise be cropped down to the subject's body. */
  wide?: string;
  /* Set only for photos that are not the Wildora team's own (Wikimedia Commons, open licences):
     shown with the photo's notes and on /credits/. */
  credit?: PlacePhoto['credit'];
}

/* Every photo lives at /photos/<category>/<slug>.webp, with a small copy in thumb/ (see THUMB_WIDTH). */
const photo = (category: string, slug: string, name: string, w: number, h: number, extra: Pick<Photo, 'wide' | 'credit'> = {}): Photo => ({
  category,
  slug,
  name,
  src: `/photos/${category}/${slug}.webp`,
  thumb: `/photos/${category}/thumb/${slug}.webp`,
  w,
  h,
  ...extra,
});

export const photos: Photo[] = [
  photo('amphibians', 'common-indian-toad', "Common Indian Toad", 1600, 1063),
  photo('amphibians', 'green-frog', "Green Frog", 1600, 1200),
  photo('amphibians', 'painted-frog', "Painted Frog", 1600, 1200),
  photo('birds', 'bar-headed-goose', "Bar-headed Goose", 1600, 1063),
  photo('birds', 'blue-bearded-bee-eater', "Blue-bearded Bee-eater", 1600, 1063),
  photo('birds', 'blue-tailed-bee-eater', "Blue-tailed Bee-eater", 1600, 1200),
  photo('birds', 'collared-dove', "Collared Dove", 1600, 1200),
  photo('birds', 'dusky-eagle-owl', "Dusky Eagle-Owl", 1067, 1600),
  photo('birds', 'himalayan-whistling-thrush', "Blue Whistling Thrush", 1600, 1200),
  photo('birds', 'hoopoe', "Hoopoe", 1587, 1058),
  photo('birds', 'indian-roller', "Indian Roller", 1600, 1200),
  photo('birds', 'white-throated-kingfisher', "White-throated Kingfisher", 1600, 1200),
  photo('birds', 'legge-s-hawk-eagle', "Legge's Hawk-Eagle", 1600, 1200),
  photo('birds', 'lesser-yellownape-woodpecker', "Lesser Yellownape Woodpecker", 1600, 1063),
  photo('birds', 'montagu-s-harrier', "Montagu's Harrier", 1600, 1200),
  photo('birds', 'mottled-wood-owl', "Mottled Wood-Owl", 1067, 1600),
  photo('birds', 'osprey', "Osprey", 1600, 1067),
  photo('birds', 'indian-paradise-flycatcher', "Indian Paradise Flycatcher", 800, 651),
  photo('birds', 'indian-peafowl', "Indian Peafowl", 1600, 1200),
  photo('birds', 'pied-cuckoo', "Pied Cuckoo", 1600, 1200),
  photo('birds', 'plain-prinia', "Plain Prinia", 1600, 1200),
  photo('birds', 'purple-heron', "Purple Heron", 1600, 1200),
  photo('birds', 'red-whiskered-bulbul', "Red-whiskered Bulbul", 1600, 1200),
  photo('birds', 'indian-rock-eagle-owl', "Indian Rock Eagle-Owl", 1600, 1063),
  photo('birds', 'sri-lanka-bay-owl', "Sri Lanka Bay Owl", 1067, 1600),
  photo('birds', 'woolly-necked-stork', "Woolly-necked Stork", 1600, 1065),
  photo('butterflies', 'baronet', "Baronet", 1600, 1200),
  photo('butterflies', 'common-map', "Common Map", 1600, 1065),
  photo('butterflies', 'crimson-tip', "Crimson Tip", 1600, 1200),
  photo('butterflies', 'large-salmon-arab', "Large Salmon Arab", 1600, 1142),
  photo('butterflies', 'common-leopard-butterfly', "Common Leopard Butterfly", 1600, 1143),
  photo('butterflies', 'southern-birdwing', "Southern Birdwing", 1280, 960),
  photo('butterflies', 'tawny-coster', "Tawny Coster", 1600, 1200),
  photo('butterflies', 'yellow-pansy', "Yellow Pansy", 1464, 976),
  photo('mammals', 'black-faced-langur', "Black-faced Langur", 1416, 1062),
  photo('mammals', 'blackbuck', "Blackbuck", 1600, 1065),
  photo('mammals', 'chital-herd', "Chital Herd", 1600, 1063),
  photo('mammals', 'asian-elephant', "Asian Elephant", 1600, 1063),
  photo('mammals', 'asian-elephant-tusker', "Asian Elephant Tusker", 1600, 1200),
  photo('mammals', 'nilgiri-tahr', "Nilgiri Tahr (Male)", 1600, 1043),
  photo('mammals', 'indian-gaur', "Indian Gaur", 1600, 1200),
  photo('mammals', 'indian-giant-squirrel', "Indian Giant Squirrel", 1600, 1067),
  photo('mammals', 'indian-leopard', "Indian Leopard", 1600, 1200),
  photo('mammals', 'lion-tailed-macaque', "Lion-tailed Macaque", 1067, 1600, { wide: '/photos/mammals/lion-tailed-macaque-wide.webp' }),
  photo('mammals', 'slender-loris', "Slender Loris", 1600, 1025),
  photo('mammals', 'sloth-bear', "Sloth Bear", 720, 456),
  photo('mammals', 'smooth-coated-otter', "Smooth-coated Otter", 1600, 1063),
  photo('mammals', 'stripe-necked-mongoose', "Stripe-necked Mongoose", 1600, 1065),
  photo('mammals', 'bengal-tiger-on-the-move', "Bengal Tiger on the Move", 1600, 1067),
  photo('mammals', 'tiger-cub-resting', "Young Tiger Resting", 1600, 1067),
  photo('mammals', 'tiger-cub', "Tiger Cub", 1600, 1067),
  photo('mammals', 'tigress-with-cubs', "Tigress with Cubs", 1600, 1067),
  photo('mammals', 'bengal-tiger', "Bengal Tiger", 1063, 1600),
  photo('moths', 'atlas-moth', "Atlas Moth", 1600, 1067),
  photo('moths', 'indian-moon-moth', "Indian Moon Moth", 1502, 1127),
  photo('plants-habitats', 'bamboo-forest', "Bamboo Forest", 1600, 1200),
  photo('plants-habitats', 'dry-deciduous-forest', "Dry Deciduous Forest", 1600, 1200),
  photo('plants-habitats', 'indian-coral-tree', "Indian Coral Tree", 1280, 960),
  photo('plants-habitats', 'evergreen-forest', "Evergreen Forest", 1600, 1200),
  photo('plants-habitats', 'flame-of-the-forest', "Flame of the Forest", 1600, 1200),
  photo('plants-habitats', 'glory-lily', "Glory Lily", 1600, 1200),
  photo('plants-habitats', 'grassland-shola-mosaic', "Grassland & Shola Mosaic", 1280, 960),
  photo('plants-habitats', 'montane-shola-forest', "Montane Shola Forest", 1600, 1200),
  photo('plants-habitats', 'nilgiri-rhododendron', "Nilgiri Rhododendron", 1600, 1071),
  photo('reptiles', 'bronze-backed-tree-snake', "Bronze-backed Tree Snake", 1600, 1065),
  photo('reptiles', 'indian-chameleon', "Indian Chameleon", 1067, 1600),
  photo('reptiles', 'common-skink', "Common Skink", 1280, 960),
  photo('reptiles', 'monitor-lizard', "Monitor Lizard", 1600, 1067),
  photo('reptiles', 'indian-star-tortoise', "Indian Star Tortoise", 1280, 960),
  /* Invertebrates — kept together and ordered by name so the gallery reads as one block. */
  photo('invertebrates', 'giant-wood-spider', "Giant Wood Spider", 1600, 1200),
  photo('invertebrates', 'indian-red-scorpion', "Indian Red Scorpion", 1600, 1200),
  photo('invertebrates', 'man-faced-stink-bug', "Man-faced Stink Bug", 1600, 1200),
  photo('amphibians', 'bronze-frog', "Bronze Frog", 1600, 1067),
  photo('amphibians', 'golden-backed-frog', "Golden-backed Frog", 1600, 1067),
  photo('birds', 'broad-tailed-grassbird', "Broad-tailed Grassbird", 1600, 1067),
  photo('birds', 'flame-throated-bulbul', "Flame-throated Bulbul", 1600, 1067),
  photo('birds', 'great-cormorant', "Great Cormorant", 1600, 1067),
  photo('birds', 'great-indian-hornbill', "Great Indian Hornbill", 1600, 1067),
  photo('birds', 'malabar-grey-hornbill', "Malabar Grey Hornbill", 1067, 1600),
  photo('birds', 'malabar-parakeet', "Malabar Parakeet", 1600, 1067),
  photo('birds', 'malabar-trogon', "Malabar Trogon (Male)", 1600, 1067),
  photo('birds', 'malabar-whistling-thrush', "Malabar Whistling Thrush", 1600, 1067),
  photo('birds', 'nilgiri-flycatcher', "Nilgiri Flycatcher (Male)", 1600, 1067),
  photo('birds', 'nilgiri-pipit', "Nilgiri Pipit", 1600, 1067),
  photo('birds', 'nilgiri-wood-pigeon', "Nilgiri Wood Pigeon", 1600, 1067),
  photo('birds', 'white-bellied-treepie', "White-bellied Treepie", 1067, 1600),
  photo('birds', 'white-bellied-woodpecker', "White-bellied Woodpecker", 1600, 1063),
  photo('birds', 'white-cheeked-barbet', "White-cheeked Barbet", 1600, 1067),
  photo('birds', 'yellow-throated-bulbul', "Yellow-throated Bulbul", 1600, 1067),
  photo('mammals', 'asian-elephant-herd', "Asian Elephant Herd", 1600, 1067),
  photo('mammals', 'indian-wild-dog', "Indian Wild Dog (Dhole)", 1600, 1067),
  photo('mammals', 'jungle-cat', "Jungle Cat", 1600, 1067),
  photo('mammals', 'nilgiri-tahr-female', "Nilgiri Tahr (Female)", 1600, 1067),
  photo('mammals', 'rhesus-macaque', "Rhesus Macaque", 1067, 1600),
  photo('mammals', 'ruddy-mongoose', "Ruddy Mongoose", 1600, 1067),
  photo('reptiles', 'anaimalai-spiny-lizard', "Anaimalai Spiny Lizard", 1600, 1067),
  photo('reptiles', 'forest-calotes', "Forest Calotes", 1600, 1067),
  photo('reptiles', 'green-calotes', "Green Calotes", 1600, 1067),
  photo('reptiles', 'hump-nosed-pit-viper', "Hump-nosed Pit Viper", 1600, 1067),
  photo('reptiles', 'large-scaled-green-lizard', "Large-scaled Green Lizard", 1600, 1067),
  photo('reptiles', 'large-scaled-pit-viper', "Large-scaled Pit Viper", 1600, 1067),
  photo('reptiles', 'malabar-pit-viper', "Malabar Pit Viper", 1600, 1067),
  photo('reptiles', 'saw-scaled-viper', "Saw-scaled Viper", 1600, 1067),
];


/* Photo category ids, for the species page's #cat-<category> anchors. */
export const photoCategories = [...new Set(photos.map((p) => p.category))];

/* Species-page tabs. Every photo category maps to exactly one tab so no photo is orphaned. */
export const speciesTabs = ['All', 'Birds', 'Mammals', 'Reptiles', 'Amphibians', 'Butterflies & Moths', 'Invertebrates', 'Flora'] as const;

const photoCategoryToTab: Record<string, string> = {
  birds: 'Birds',
  mammals: 'Mammals',
  reptiles: 'Reptiles',
  amphibians: 'Amphibians',
  butterflies: 'Butterflies & Moths',
  moths: 'Butterflies & Moths',
  invertebrates: 'Invertebrates',
  'plants-habitats': 'Flora',
};

export function tabForPhotoCategory(categoryId: string): string | undefined {
  return photoCategoryToTab[categoryId];
}

export function photosForTab(tab: string): Photo[] {
  if (tab === 'All') return photos;
  return photos.filter((p) => photoCategoryToTab[p.category] === tab);
}

/* data.ts species categories are singular labels; map them onto the same tabs. */
export function speciesMatchesTab(speciesCategory: string, tab: string): boolean {
  if (tab === 'All') return true;
  if (tab === 'Butterflies & Moths') return speciesCategory === 'Butterflies' || speciesCategory === 'Moths';
  return speciesCategory === tab;
}

export function findPhoto(slug: string): Photo | undefined {
  return photos.find((p) => p.slug === slug);
}

/** findPhoto for a slug the code names directly: fails the build if the photo has gone missing. */
export function photoOrThrow(slug: string): Photo {
  const p = findPhoto(slug);
  if (!p) throw new Error(`lib/photos: photo "${slug}" not found`);
  return p;
}

/* GitHub Pages serves the site under /nature_trip; <img> src needs the prefix explicitly. */
export const BASE_PATH = '/nature_trip';
export const img = (path: string) => `${BASE_PATH}${path}`;

/** "Author, licence" for a credited photo, else undefined. */
export const creditText = (p: Photo): string | undefined => p.credit && `${p.credit.author}, ${p.credit.licence}`;

/** A photo's caption name in `locale` where translated (content/<locale>/photos.json, keyed by slug). */
export const photoName = (p: Photo, locale: Locale): string => overlayEntry<Photo>(locale, 'photos', p.slug)?.name ?? p.name;

/** Every thumbnail is at least 480 px wide (portraits 480 × 720), so srcsets can name one width. */
export const THUMB_WIDTH = 480;

/* "What you might see" strip on each trip page: only species the trip's itinerary, highlights or
   target list name. A trip with fewer than four matching photos shows no strip. */
export const tripSpeciesPhotoSlugs: Record<string, string[]> = {
  'western-ghats-endemics': [
    'lion-tailed-macaque', 'nilgiri-tahr', 'malabar-trogon', 'nilgiri-flycatcher', 'nilgiri-pipit', 'nilgiri-wood-pigeon',
    'great-indian-hornbill', 'indian-giant-squirrel', 'indian-star-tortoise', 'indian-gaur', 'asian-elephant-herd',
  ],
  'monsoon-rainforest-nights': [
    'golden-backed-frog', 'bronze-frog', 'malabar-pit-viper', 'large-scaled-pit-viper', 'hump-nosed-pit-viper',
    'bronze-backed-tree-snake', 'forest-calotes', 'southern-birdwing',
  ],
  'central-india-big-cats': [
    'bengal-tiger', 'tigress-with-cubs', 'indian-leopard', 'indian-wild-dog', 'chital-herd', 'mottled-wood-owl', 'indian-rock-eagle-owl',
  ],
};

/* Representative photo for each trip card / trip page hero. */
export const tripPhotoSlugs: Record<string, string> = {
  'central-india-big-cats': 'tigress-with-cubs',
  'monsoon-rainforest-nights': 'golden-backed-frog',
  'himalaya-birds-mountain-wildlife': 'himalayan-whistling-thrush',
  'western-ghats-endemics': 'lion-tailed-macaque',
};

/** A trip's representative photo, if it has one. */
export const tripPhoto = (tripId: string): Photo | undefined => {
  const slug = tripPhotoSlugs[tripId];
  return slug ? findPhoto(slug) : undefined;
};
