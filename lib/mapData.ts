/**
 * Per-trip map definitions for Wildora Expeditions.
 *
 * Every map on the site is drawn from these definitions plus Natural Earth geometry
 * (public domain). `scripts/build-map-data.mjs` imports this file directly (Node >= 22.18
 * strips the types natively), projects everything and writes `lib/geo/*.json`.
 *
 *   After editing anything in this file, re-run:  node scripts/build-map-data.mjs
 *
 * The map components compare a signature of these definitions with the one stored in the
 * generated JSON and throw at build time if they differ, so a stale map cannot ship silently.
 *
 * Rules for this file:
 *  - No imports, and only erasable TypeScript syntax (no enums, no namespaces), so plain
 *    Node can load it.
 *  - Coordinates are public facts. Each one names its source. Retrieved 2026-10-03:
 *      Wikipedia  = en.wikipedia.org article coordinates (API prop=coordinates), which
 *                   mirror the linked Wikidata item's P625 value.
 *      OSM        = OpenStreetMap, via Nominatim / Overpass (ODbL facts; we store only
 *                   the coordinate, not map tiles or geometry).
 *  - Trips whose itineraries do not name places get an approximate REGION, never invented
 *    parks or towns.
 */

export type TripMapId =
  | 'western-ghats-endemics'
  | 'monsoon-rainforest-nights'
  | 'central-india-big-cats'
  | 'himalaya-birds-mountain-wildlife';

export const TRIP_MAP_IDS: readonly TripMapId[] = [
  'western-ghats-endemics',
  'monsoon-rainforest-nights',
  'central-india-big-cats',
  'himalaya-birds-mountain-wildlife',
];

/** [west longitude, south latitude, east longitude, north latitude], degrees. */
export type LonLatBox = [number, number, number, number];

export interface MapStop {
  id: string;
  /** Itinerary day number(s) shown inside the marker, e.g. '1–2'. Empty for an overnight-only base. */
  days: string;
  /** Full name, used in the stop list, tooltip and screen-reader text. */
  name: string;
  /** Short on-map label. */
  label: string;
  lat: number;
  lon: number;
  /** Where the group sleeps, e.g. 'Overnight Thattekad (2 nights)'. */
  stay: string;
  /** True when the group sleeps at this place (draws the overnight ring). */
  overnight: boolean;
  /** Day visits made from a base are drawn as a dotted spur from that base. */
  spurFrom?: string;
  source: string;
}

export interface MapGateway {
  id: string;
  name: string;
  label: string;
  lat: number;
  lon: number;
  role: 'arrival' | 'departure';
  /** Stop id this gateway is linked to by a dashed transfer line. */
  connectsTo: string;
  source: string;
}

export type MapRegion =
  | {
      /** Union of Natural Earth `geography_regions_polys` features (by NAME), clipped to India. */
      kind: 'naturalEarth';
      features: string[];
    }
  | {
      /** A soft ellipse, used where the region is deliberately approximate. */
      kind: 'ellipse';
      centre: { lat: number; lon: number };
      /** Semi-axes in degrees of longitude and latitude. */
      radiusLon: number;
      radiusLat: number;
    };

export interface RouteMapDef {
  kind: 'route';
  id: TripMapId;
  title: string;
  ariaLabel: string;
  /** Visiting order of the main route line (stop ids). Spur stops are not listed here. */
  route: string[];
  stops: MapStop[];
  gateways: MapGateway[];
  /** Shade the Western Ghats range (Natural Earth) beneath the route. */
  shadeWesternGhats: boolean;
  /** Natural Earth `populated_places_simple` names drawn as muted orientation dots. */
  referenceCities: string[];
  /** Degrees of padding around the plotted points. */
  padDeg: number;
}

export interface RegionMapDef {
  kind: 'region';
  id: TripMapId;
  title: string;
  ariaLabel: string;
  region: MapRegion;
  /** On-map label, two short lines. Must say the region is approximate. */
  regionLabel: [string, string];
  /** Longer sentence for the caption and screen readers. */
  regionNote: string;
  /** Where the region label sits (lon/lat) and which side of that point the text runs. */
  labelAt: { lat: number; lon: number; anchor: 'start' | 'middle' | 'end' };
  shadeWesternGhats: boolean;
  referenceCities: string[];
  extent: LonLatBox;
}

export type TripMapDef = RouteMapDef | RegionMapDef;

const WESTERN_GHATS_FEATURES = ['WESTERN GHATS', 'Southern Ghats'];
const HIMALAYA_FEATURES = ['HIMALAYAS', 'Siwalik Hills'];

export const tripMaps: Record<TripMapId, TripMapDef> = {
  'western-ghats-endemics': {
    kind: 'route',
    id: 'western-ghats-endemics',
    title: 'Western Ghats Endemics Expedition: route map',
    ariaLabel:
      'Map of southern India showing the 10-day Western Ghats Endemics route: Thattekad, Munnar with day visits to Pampadum Shola and Eravikulam, Chinnar, Top Slip, Valparai, Ooty with a day visit to Mukurthi, and Bandipur. Arrival via Kochi airport; departure via Mysuru or Bengaluru airport.',
    route: ['thattekad', 'munnar', 'chinnar', 'topslip', 'valparai', 'ooty', 'bandipur'],
    stops: [
      {
        id: 'thattekad',
        days: '1–2',
        name: 'Thattekad Bird Sanctuary',
        label: 'Thattekad',
        lat: 10.13,
        lon: 76.68,
        stay: 'Overnight Thattekad (2 nights)',
        overnight: true,
        source: 'Wikipedia "Thattekad Bird Sanctuary" (Wikidata Q6772512)',
      },
      {
        id: 'munnar',
        days: '',
        name: 'Munnar',
        label: 'Munnar',
        lat: 10.08917,
        lon: 77.05972,
        stay: 'Overnight base for days 3–4 (2 nights)',
        overnight: true,
        source: 'Wikipedia "Munnar" (Wikidata Q1025124)',
      },
      {
        id: 'pampadum',
        days: '3',
        name: 'Pampadum Shola National Park & Vattavada',
        label: 'Pampadum Shola',
        lat: 10.14389,
        lon: 77.26694,
        stay: 'Day visit; overnight Munnar',
        overnight: false,
        spurFrom: 'munnar',
        source:
          'Wikipedia "Pampadum Shola National Park" (Wikidata Q3330156); Vattavada is 4.5 km NNW at 10.18333, 77.25667 (Wikipedia, Q7917199)',
      },
      {
        id: 'eravikulam',
        days: '4',
        name: 'Eravikulam National Park (Rajamalai)',
        label: 'Eravikulam',
        lat: 10.2,
        lon: 77.083,
        stay: 'Day visit; overnight Munnar',
        overnight: false,
        spurFrom: 'munnar',
        source: 'Wikipedia "Eravikulam National Park" (Wikidata Q1194252)',
      },
      {
        id: 'chinnar',
        days: '5',
        name: 'Chinnar Wildlife Sanctuary',
        label: 'Chinnar',
        lat: 10.3,
        lon: 77.175,
        stay: 'Overnight Chinnar',
        overnight: true,
        source: 'Wikipedia "Chinnar Wildlife Sanctuary" (Wikidata Q3522009)',
      },
      {
        id: 'topslip',
        days: '6',
        name: 'Top Slip, Anamalai Tiger Reserve',
        label: 'Top Slip',
        lat: 10.47102,
        lon: 76.8428,
        stay: 'En route to Valparai',
        overnight: false,
        source:
          'OSM node 7252324542 (Topslip, Anamalai block) via Overpass; Wikipedia has no coordinate for Top Slip',
      },
      {
        id: 'valparai',
        days: '6–7',
        name: 'Valparai',
        label: 'Valparai',
        lat: 10.32756,
        lon: 76.95527,
        stay: 'Overnight Valparai (2 nights)',
        overnight: true,
        source: 'Wikipedia "Valparai" (Wikidata Q282137)',
      },
      {
        id: 'ooty',
        days: '8',
        name: 'Ooty (Udhagamandalam)',
        label: 'Ooty',
        lat: 11.41,
        lon: 76.7,
        stay: 'Overnight Ooty (2 nights)',
        overnight: true,
        source: 'Wikipedia "Ooty" (Wikidata Q9888)',
      },
      {
        id: 'mukurthi',
        days: '9',
        name: 'Mukurthi National Park',
        label: 'Mukurthi',
        lat: 11.26667,
        lon: 76.475,
        stay: 'Day visit; overnight Ooty',
        overnight: false,
        spurFrom: 'ooty',
        source: 'Wikipedia "Mukurthi National Park" (Wikidata Q2985390)',
      },
      {
        id: 'bandipur',
        days: '10',
        name: 'Bandipur Tiger Reserve',
        label: 'Bandipur',
        lat: 11.66167,
        lon: 76.62722,
        stay: 'Final safari, then departure',
        overnight: false,
        source: 'Wikipedia "Bandipur National Park" (Wikidata Q665110; "Bandipur Tiger Reserve" redirects there)',
      },
    ],
    gateways: [
      {
        id: 'cok',
        name: 'Cochin International Airport (COK)',
        label: 'Kochi airport (COK)',
        lat: 10.15333,
        lon: 76.38816,
        role: 'arrival',
        connectsTo: 'thattekad',
        source: 'Wikipedia "Cochin International Airport" (Wikidata Q592172)',
      },
      {
        id: 'mysuru',
        name: 'Mysuru',
        label: 'Mysuru',
        lat: 12.30861,
        lon: 76.65306,
        role: 'departure',
        connectsTo: 'bandipur',
        source: 'Wikipedia "Mysore" (Wikidata Q10086)',
      },
      {
        id: 'blr',
        name: 'Kempegowda International Airport, Bengaluru (BLR)',
        label: 'Bengaluru airport (BLR)',
        lat: 13.19889,
        lon: 77.70556,
        role: 'departure',
        connectsTo: 'bandipur',
        source: 'Wikipedia "Kempegowda International Airport" (Wikidata Q503364)',
      },
    ],
    shadeWesternGhats: true,
    referenceCities: ['Coimbatore'],
    padDeg: 0.22,
  },

  // ASSUMED 2026-10-03: lib/data.ts gives the region only as "Indian rainforests"; the
  // Western Ghats belt is inferred from "spice country" and the team's Western Ghats base.
  // Change `region` here if the trip runs elsewhere.
  'monsoon-rainforest-nights': {
    kind: 'region',
    id: 'monsoon-rainforest-nights',
    title: 'Monsoon Rainforest Nights: region map',
    ariaLabel:
      'Map of western peninsular India with the Western Ghats rainforest belt shaded. The exact rainforest base is set at booking.',
    region: { kind: 'naturalEarth', features: WESTERN_GHATS_FEATURES },
    regionLabel: ['Western Ghats rainforests', 'exact base set at booking'],
    regionNote:
      'Approximate region: the Western Ghats rainforest belt. The exact base and night-walk sites are set at booking.',
    labelAt: { lat: 13.9, lon: 70.4, anchor: 'start' },
    shadeWesternGhats: false,
    referenceCities: ['Mumbai', 'Pune', 'Mangaluru', 'Bengaluru', 'Kochi'],
    extent: [70.6, 8.0, 79.2, 21.4],
  },

  // The ellipse is deliberately approximate: the central Indian highland forests named only
  // as "Central India forests" in lib/data.ts. No parks are named on the map.
  'central-india-big-cats': {
    kind: 'region',
    id: 'central-india-big-cats',
    title: 'Central India Big Cats: region map',
    ariaLabel:
      'Map of central India with an approximate shaded area for the central Indian tiger reserves. The exact parks are set at booking.',
    region: { kind: 'ellipse', centre: { lat: 22.4, lon: 79.8 }, radiusLon: 2.5, radiusLat: 2.4 },
    regionLabel: ['Central Indian tiger reserves', 'exact parks set at booking'],
    regionNote:
      'Approximate region: the central Indian tiger reserves. The exact parks and safari zones are set at booking.',
    labelAt: { lat: 25.35, lon: 79.8, anchor: 'middle' },
    shadeWesternGhats: false,
    referenceCities: ['Nagpur', 'Bhopal', 'Jabalpur', 'Raipur'],
    extent: [74.3, 18.2, 85.3, 26.6],
  },

  'himalaya-birds-mountain-wildlife': {
    kind: 'region',
    id: 'himalaya-birds-mountain-wildlife',
    title: 'Himalaya Birds & Mountain Wildlife: region map',
    ariaLabel:
      'Map of northern India with the Indian Himalaya shaded. The exact route and base are set at booking.',
    region: { kind: 'naturalEarth', features: HIMALAYA_FEATURES },
    regionLabel: ['Indian Himalaya', 'route and base set at booking'],
    regionNote:
      'Approximate region: the Indian Himalaya. The exact route, base and altitude are set at booking.',
    labelAt: { lat: 25.9, lon: 84.2, anchor: 'middle' },
    shadeWesternGhats: false,
    referenceCities: ['New Delhi'],
    // Wide enough to show India's whole northern outline (India point-of-view boundary).
    extent: [71.5, 23.6, 98.2, 38.3],
  },
};

export interface OverviewRegion {
  tripId: TripMapId;
  /** Map label, two short lines. */
  label: [string, string];
  /** Full trip name for the link list. */
  linkText: string;
  /** CSS colour token used for this trip's halo and key. */
  colour: string;
  labelAt: { lat: number; lon: number; anchor: 'start' | 'middle' | 'end' };
  /** Optional leader line from the label to this point, when the label sits away from its region. */
  leaderTo?: { lat: number; lon: number };
}

export const overviewMap = {
  title: 'Wildora trip regions across India',
  ariaLabel:
    'Map of India marking four trip regions: the Western Ghats Endemics route in the far south-west, the Monsoon Rainforest belt along the Western Ghats, the central Indian tiger reserves, and the Indian Himalaya.',
  referenceCities: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru'],
  regions: [
    {
      tripId: 'himalaya-birds-mountain-wildlife',
      label: ['Himalaya', 'Birds'],
      linkText: 'Himalaya Birds & Mountain Wildlife',
      colour: 'var(--wd-sand, #efe6c8)',
      labelAt: { lat: 35.0, lon: 77.8, anchor: 'middle' },
    },
    {
      tripId: 'central-india-big-cats',
      label: ['Central India', 'Big Cats'],
      linkText: 'Central India Big Cats & Forest Safari',
      colour: 'var(--wd-sun, #f2b134)',
      labelAt: { lat: 22.6, lon: 76.6, anchor: 'end' },
    },
    {
      tripId: 'monsoon-rainforest-nights',
      label: ['Monsoon', 'Rainforest'],
      linkText: 'Monsoon Rainforest Nights & Endemics',
      colour: 'var(--wd-fern, #3fa34d)',
      labelAt: { lat: 15.8, lon: 67.9, anchor: 'start' },
    },
    {
      tripId: 'western-ghats-endemics',
      label: ['Western Ghats', 'Endemics'],
      linkText: 'Western Ghats Endemics Expedition',
      colour: 'var(--wd-lime, #9ad14b)',
      labelAt: { lat: 11.6, lon: 80.9, anchor: 'start' },
      leaderTo: { lat: 10.9, lon: 77.0 },
    },
  ] as OverviewRegion[],
};

export function isTripMapId(id: string): id is TripMapId {
  return (TRIP_MAP_IDS as readonly string[]).includes(id);
}

/** 'Days 1–2' / 'Day 3' / 'Base', used by the tooltip, the stop list and the label layout. */
export function stopDays(stop: MapStop): string {
  if (!stop.days) return 'Base';
  return /[–-]/.test(stop.days) ? `Days ${stop.days}` : `Day ${stop.days}`;
}

/** Second tooltip line, e.g. 'Days 1–2 · Overnight Thattekad (2 nights)'. */
export function stopDetail(stop: MapStop): string {
  return stop.days ? `${stopDays(stop)} · ${stop.stay}` : stop.stay;
}

/** OpenStreetMap link-out for a point (opens openstreetmap.org; nothing is embedded). */
export function osmUrl(lat: number, lon: number, zoom = 12): string {
  const la = lat.toFixed(5);
  const lo = lon.toFixed(5);
  return `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=${zoom}/${la}/${lo}`;
}

/** Keys that never change the generated geometry or label layout. */
const UNSIGNED_KEYS = ['title', 'ariaLabel', 'regionNote', 'source', 'linkText'];

/**
 * Signature (FNV-1a, hex) of everything that changes the generated geometry or label layout.
 * The build script stores it in each JSON file; the components recompute and compare it.
 */
export function mapSignature(value: unknown): string {
  const text = JSON.stringify(value, (key, v) => (UNSIGNED_KEYS.includes(key) ? undefined : v));
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
