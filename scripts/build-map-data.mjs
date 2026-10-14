#!/usr/bin/env node
/**
 * build-map-data.mjs: precompute Wildora's static SVG map geometry.
 *
 * SOURCE DATA: Natural Earth vector data, version 5.1.2 (git tag v5.1.2, released 2022-05-13).
 * Licence: public domain (https://www.naturalearthdata.com/about/terms-of-use/). No attribution
 * is required; the site credits it anyway.
 *
 *   Base URL (pinned tag, so the build is reproducible):
 *     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/
 *   Files:
 *     ne_10m_admin_0_countries_ind.geojson     admin-0 countries, INDIA POINT OF VIEW (IND POV)
 *     ne_10m_admin_1_states_provinces.geojson  admin-1 states (only India's internal state lines are used)
 *     ne_10m_geography_regions_polys.geojson   physical regions (Western Ghats, Himalayas)
 *     ne_10m_populated_places_simple.geojson   reference city points
 *   The same layers are published as shapefile zips on https://naciscdn.org/naturalearth/10m/
 *   (cultural/ne_10m_admin_0_countries_ind.zip etc.), but naciscdn serves only the latest
 *   release, so the pinned GitHub tag is used and every file is checked against its SHA-256.
 *
 * INDIA BOUNDARY RULE: every national outline comes from the IND POV admin-0 file. The script
 * refuses to run if India's polygon does not contain Gilgit, Muzaffarabad and Aksai Chin (the
 * test that distinguishes the IND POV file from the default de-facto file). Internal state
 * lines come from the admin-1 file but only where two Indian states share an edge, and the
 * Jammu and Kashmir / Ladakh line is dropped because its de-facto version stops at the Line of
 * Control.
 *
 * USAGE
 *   node scripts/build-map-data.mjs                 download (or reuse cache), build, write
 *   node scripts/build-map-data.mjs --source <dir>  use already-downloaded .geojson files
 *   Requires Node >= 22.18 (imports lib/mapData.ts and lib/data.ts with native type stripping).
 *   Downloads are cached in node_modules/.cache/natural-earth-5.1.2/.
 *
 * OUTPUT
 *   lib/geo/<trip-id>.json and lib/geo/india-overview.json: projected, simplified SVG path data,
 *   marker and label positions. Commit them; `next build` never touches the network.
 *   Re-run this script after editing lib/mapData.ts. The components throw if the stored
 *   signature no longer matches the definitions.
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { register } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { geoConicConformal, geoContains, geoDistance, geoPath } from 'd3-geo';
import { topology } from 'topojson-server';
import { feature, mesh } from 'topojson-client';
import { presimplify, simplify, sphericalTriangleArea } from 'topojson-simplify';
import polygonClipping from 'polygon-clipping';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'lib', 'geo');
const NE_VERSION = '5.1.2';
const NE_BASE = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v${NE_VERSION}/geojson`;
const SOURCES = {
  countries: {
    file: 'ne_10m_admin_0_countries_ind.geojson',
    sha256: '3e67a5a6ddeff3247ca8400cd2514fd4a5ac6e5432823b25d610a7028597d45f',
  },
  states: {
    file: 'ne_10m_admin_1_states_provinces.geojson',
    sha256: '22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5',
  },
  regions: {
    file: 'ne_10m_geography_regions_polys.geojson',
    sha256: 'b7b26e50ea917d3696aec87f932def2bf5f890f5770e441d59c162c6f4c92a77',
  },
  places: {
    file: 'ne_10m_populated_places_simple.geojson',
    sha256: 'fd3fa867a320cbd5c5b6bb5bc550afeec2939fb2cef688e508007282a55ac42f',
  },
};

/** Geometry outside this lon/lat box is discarded before topology building. */
const CLIP_BOX = [50, -8, 110, 50];
/** Viewbox width for every map, in SVG user units. */
const WIDTH = 600;
/** Visvalingam tolerance: triangles smaller than this many square units are removed. */
const SIMPLIFY_PX2 = { route: 0.5, region: 0.6, overview: 1.0 };
/** Land parts smaller than this (square units) become island dots. */
const ISLAND_PX2 = 2.5;
/** A gateway is drawn on the map if within this many degrees of the stops' bounding box. */
const GATEWAY_INCLUDE_DEG = 0.45;
/** Mean Earth radius, km (IUGG). */
const EARTH_KM = 6371.0088;

const FONT = {
  stop: { size: 17, weight: 600 },
  gateway: { size: 14.5, weight: 500 },
  city: { size: 13.5, weight: 500 },
  regionTitle: { size: 19, weight: 700 },
  regionSub: { size: 14, weight: 500 },
  pill: { size: 13.5, weight: 700 },
  tipTitle: { size: 15, weight: 700 },
  tipBody: { size: 12.5, weight: 500 },
  scale: { size: 12, weight: 500 },
  overview: { size: 15.5, weight: 700 },
};
const PILL_H = 26;
const BASE_R = 9;
const RING = 4;

// ---------------------------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------------------------

function fail(message) {
  console.error(`\n[build-map-data] ERROR: ${message}\n`);
  process.exit(1);
}

const r1 = (v) => Math.round(v * 10) / 10;

function parseArgs(argv) {
  const args = { source: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--source') args.source = argv[++i] ?? fail('--source needs a directory');
    else fail(`unknown argument ${argv[i]}`);
  }
  return args;
}

async function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function loadSource(key, sourceDir) {
  const { file, sha256: expected } = SOURCES[key];
  const cacheDir = join(ROOT, 'node_modules', '.cache', `natural-earth-${NE_VERSION}`);
  const local = sourceDir ? join(resolve(sourceDir), file) : join(cacheDir, file);
  let buffer;
  if (existsSync(local)) {
    buffer = await readFile(local);
  } else if (sourceDir) {
    fail(`${file} not found in ${sourceDir}`);
  } else {
    const url = `${NE_BASE}/${file}`;
    console.log(`  downloading ${url}`);
    let lastError;
    for (let attempt = 1; attempt <= 3 && !buffer; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        buffer = Buffer.from(await res.arrayBuffer());
      } catch (error) {
        lastError = error;
        console.warn(`  attempt ${attempt} failed: ${error.message}`);
      }
    }
    if (!buffer) fail(`could not download ${url}: ${lastError?.message}`);
    await mkdir(cacheDir, { recursive: true });
    await writeFile(local, buffer);
  }
  const actual = await sha256(buffer);
  if (actual !== expected) {
    fail(`${file} SHA-256 mismatch.\n  expected ${expected}\n  actual   ${actual}\n  Delete ${local} and retry; if Natural Earth ${NE_VERSION} genuinely changed, review the diff before updating the hash.`);
  }
  console.log(`  ok ${file} (${(buffer.length / 1e6).toFixed(1)} MB, sha256 verified)`);
  return JSON.parse(buffer.toString('utf8'));
}

/** Planar signed area of a lon/lat ring; positive = counter-clockwise (y up). */
function ringArea(ring) {
  let a = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/** d3-geo wants exterior rings clockwise and holes counter-clockwise (y up). */
function rewindPolygon(rings) {
  return rings.map((ring, i) => {
    const ccw = ringArea(ring) > 0;
    return (i === 0) === ccw ? ring.slice().reverse() : ring;
  });
}

function toMultiPolygon(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  fail(`unexpected geometry type ${geometry.type}`);
}

function bboxOf(coords) {
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  const walk = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < b[0]) b[0] = c[0];
      if (c[1] < b[1]) b[1] = c[1];
      if (c[0] > b[2]) b[2] = c[0];
      if (c[1] > b[3]) b[3] = c[1];
    } else c.forEach(walk);
  };
  walk(coords);
  return b;
}

const boxesIntersect = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
const boxInside = (a, b) => a[0] >= b[0] && a[2] <= b[2] && a[1] >= b[1] && a[3] <= b[3];

function boxPolygon([w, s, e, n]) {
  return [[[w, s], [e, s], [e, n], [w, n], [w, s]]];
}

/** Clip a multipolygon to a lon/lat box, skipping the work when it is wholly inside. */
function clipToBox(multi, box) {
  const parts = multi.filter((poly) => boxesIntersect(bboxOf(poly[0]), box));
  if (!parts.length) return [];
  if (parts.every((poly) => boxInside(bboxOf(poly[0]), box))) return parts;
  return polygonClipping.intersection(parts, boxPolygon(box));
}

function multiFeature(multi, properties = {}, id) {
  return {
    type: 'Feature',
    id,
    properties,
    geometry: { type: 'MultiPolygon', coordinates: multi.map(rewindPolygon) },
  };
}

function ellipsePolygon({ centre, radiusLon, radiusLat }, steps = 120) {
  const ring = [];
  for (let i = 0; i <= steps; i++) {
    const t = (-2 * Math.PI * i) / steps; // clockwise
    ring.push([centre.lon + radiusLon * Math.cos(t), centre.lat + radiusLat * Math.sin(t)]);
  }
  return [[ring]];
}

function parseDays(days) {
  if (!days) return [];
  const m = days.match(/^(\d+)(?:\s*[–-]\s*(\d+))?$/);
  if (!m) fail(`cannot parse days "${days}"`);
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

// ---------------------------------------------------------------------------------------------
// Text metrics and label placement (all in SVG user units)
// ---------------------------------------------------------------------------------------------

function textWidth(text, { size, weight }) {
  let em = 0;
  for (const ch of text) {
    if ("il.,:;|!'’()[] ".includes(ch)) em += 0.29;
    else if ('fjrtI1'.includes(ch)) em += 0.4;
    else if ('mwMW'.includes(ch)) em += 0.86;
    else if (/[A-Z0-9&]/.test(ch)) em += 0.66;
    else if ('–—·'.includes(ch)) em += 0.56;
    else em += 0.56;
  }
  return em * size * (weight >= 600 ? 1.05 : 1);
}

function distToBox(px, py, b) {
  const dx = Math.max(b.x0 - px, 0, px - b.x1);
  const dy = Math.max(b.y0 - py, 0, py - b.y1);
  return Math.hypot(dx, dy);
}

const overlap = (a, b, pad = 0) =>
  a.x0 < b.x1 + pad && a.x1 > b.x0 - pad && a.y0 < b.y1 + pad && a.y1 > b.y0 - pad;

function segIntersectsBox([x1, y1], [x2, y2], b) {
  // Liang–Barsky clip test.
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const checks = [
    [-dx, x1 - b.x0],
    [dx, b.x1 - x1],
    [-dy, y1 - b.y0],
    [dy, b.y1 - y1],
  ];
  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return true;
}

// Preference order: E, W, NE, SE, NW, SW, N, S (SVG y points down).
const DIRS = [0, 180, -40, 40, -140, 140, -90, 90];
const RINGS = [5, 16, 30, 46, 66, 90];
const BEAM = 80;

/** Every static-valid position for one label, with its standalone cost. */
function labelCandidates(item, { obstacles, segments, width, height, inset, anchors }) {
  const w = textWidth(item.text, item.font) + 2;
  const h = item.font.size * 1.2;
  const out = [];
  for (let ri = 0; ri < RINGS.length; ri++) {
    for (let di = 0; di < DIRS.length; di++) {
      const theta = (DIRS[di] * Math.PI) / 180;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      const gap = RINGS[ri];
      const ax = item.x + c * (item.hw + gap);
      const ay = item.y + s * (item.hh + gap);
      let x0;
      let anchor;
      if (c > 0.3) [x0, anchor] = [ax, 'start'];
      else if (c < -0.3) [x0, anchor] = [ax - w, 'end'];
      else [x0, anchor] = [ax - w / 2, 'middle'];
      let y0;
      if (s > 0.3) y0 = ay;
      else if (s < -0.3) y0 = ay - h;
      else y0 = ay - h / 2;
      const box = { x0, y0, x1: x0 + w, y1: y0 + h };
      if (box.x0 < inset || box.y0 < inset || box.x1 > width - inset || box.y1 > height - inset) continue;
      if (obstacles.some((o) => o.id !== item.id && overlap(o, box, 1.5))) continue;
      const crossings = segments.filter((sg) => sg.owner !== item.id && segIntersectsBox(sg.a, sg.b, box)).length;
      // Ambiguity: a label must sit clearly closer to its own marker than to any other.
      const own = distToBox(item.x, item.y, box);
      const ambiguous = anchors.some((a) => a.id !== item.id && distToBox(a.x, a.y, box) < own + 8);
      let leader = null;
      let leaderHits = 0;
      if (ri > 1) {
        const ex = item.x + c * item.hw;
        const ey = item.y + s * item.hh;
        const lx = Math.min(Math.max(ex, box.x0), box.x1);
        const ly = Math.min(Math.max(ey, box.y0), box.y1);
        leader = [r1(ex), r1(ey), r1(lx), r1(ly)];
        leaderHits = obstacles.filter((o) => o.id !== item.id && segIntersectsBox([ex, ey], [lx, ly], o)).length;
      }
      const cost = ri * 5 + di * 0.5 + crossings * 6 + (ambiguous ? 30 : 0) + leaderHits * 10;
      const tx = anchor === 'start' ? box.x0 : anchor === 'end' ? box.x1 : (box.x0 + box.x1) / 2;
      out.push({ cost, box, leader, label: { x: r1(tx), y: r1((box.y0 + box.y1) / 2), anchor, leader } });
    }
  }
  return out.sort((a, b) => a.cost - b.cost);
}

/**
 * Label placement by beam search: labels may not overlap each other, any obstacle (markers,
 * scale bar, fixed labels) or the frame. Crossing route lines, sitting nearer another marker
 * and long leader lines are penalised. A required label with no valid position fails the build.
 */
function placeLabels(items, { obstacles, segments, width, height, inset = 4, anchors = [] }) {
  const cands = items.map((item) => labelCandidates(item, { obstacles, segments, width, height, inset, anchors }));
  let beam = [{ cost: 0, boxes: [], leaders: [], picks: [] }];
  items.forEach((item, i) => {
    const next = [];
    for (const state of beam) {
      let any = false;
      for (const cand of cands[i]) {
        if (state.boxes.some((b) => overlap(b, cand.box, 2))) continue;
        // A new label must not sit on an earlier leader line, nor its leader cross an earlier label.
        if (state.leaders.some((l) => segIntersectsBox([l[0], l[1]], [l[2], l[3]], cand.box))) continue;
        if (cand.leader && state.boxes.some((b) => segIntersectsBox([cand.leader[0], cand.leader[1]], [cand.leader[2], cand.leader[3]], b))) continue;
        any = true;
        next.push({
          cost: state.cost + cand.cost,
          boxes: [...state.boxes, cand.box],
          leaders: cand.leader ? [...state.leaders, cand.leader] : state.leaders,
          picks: [...state.picks, cand.label],
        });
      }
      if (!any && item.optional) next.push({ ...state, cost: state.cost + 40, picks: [...state.picks, null] });
    }
    if (!next.length) fail(`no collision-free position for label "${item.text}"`);
    next.sort((a, b) => a.cost - b.cost);
    beam = next.slice(0, BEAM);
  });
  const best = beam[0];
  const result = new Map();
  items.forEach((item, i) => {
    if (best.picks[i]) result.set(item.id, best.picks[i]);
    else console.warn(`  note: no room for optional label "${item.text}", omitted`);
  });
  return result;
}

function fixedLabelBox(x, y, anchor, lines) {
  // lines: [{text, font}] stacked, first line centred on y.
  const widths = lines.map((l) => textWidth(l.text, l.font));
  const w = Math.max(...widths) + 2;
  const heights = lines.map((l) => l.font.size * 1.25);
  const h = heights.reduce((a, b) => a + b, 0);
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  const y0 = y - heights[0] / 2 - 0.5;
  return { x0, y0, x1: x0 + w, y1: y0 + h };
}

// ---------------------------------------------------------------------------------------------
// Projection
// ---------------------------------------------------------------------------------------------

/**
 * Lambert conformal conic centred on the box, fitted to WIDTH, with the height clamped to a
 * sensible aspect range by widening the view rather than distorting it.
 */
function makeProjection(box, { minAspect, maxAspect, margin = 0 }) {
  const [w, s, e, n] = box;
  const dLat = n - s;
  const projection = geoConicConformal()
    .rotate([-(w + e) / 2, 0])
    .parallels([s + dLat / 4, n - dLat / 4]);
  const samples = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    samples.push([w + (e - w) * t, s], [w + (e - w) * t, n], [w, s + dLat * t], [e, s + dLat * t]);
  }
  const target = { type: 'MultiPoint', coordinates: samples };
  projection.fitSize([1000, 1000], target);
  let [[x0, y0], [x1, y1]] = geoPath(projection).bounds(target);
  let aspect = (y1 - y0) / (x1 - x0);
  if (aspect < minAspect) {
    const grow = ((x1 - x0) * minAspect - (y1 - y0)) / 2;
    y0 -= grow;
    y1 += grow;
  } else if (aspect > maxAspect) {
    const grow = ((y1 - y0) / maxAspect - (x1 - x0)) / 2;
    x0 -= grow;
    x1 += grow;
  }
  aspect = (y1 - y0) / (x1 - x0);
  const k = (WIDTH - 2 * margin) / (x1 - x0);
  const [tx, ty] = projection.translate();
  projection.scale(projection.scale() * k).translate([(tx - x0) * k + margin, (ty - y0) * k + margin]);
  const height = Math.round((WIDTH - 2 * margin) * aspect + 2 * margin);
  projection.clipExtent([
    [-4, -4],
    [WIDTH + 4, height + 4],
  ]);
  return { projection, width: WIDTH, height };
}

/** Projected units per radian of arc at the map centre (for the simplification threshold). */
function unitsPerRadian(projection, width, height) {
  const a = projection.invert([width / 2, height / 2]);
  const b = projection.invert([width / 2 + 10, height / 2]);
  return 10 / geoDistance(a, b);
}

function scaleBar(projection, width, height) {
  const a = projection.invert([width / 2 - 50, height / 2]);
  const b = projection.invert([width / 2 + 50, height / 2]);
  const kmPerUnit = (geoDistance(a, b) * EARTH_KM) / 100;
  const nice = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  let km = nice[0];
  for (const candidate of nice) if (Math.abs(candidate / kmPerUnit - 95) < Math.abs(km / kmPerUnit - 95)) km = candidate;
  const len = km / kmPerUnit;
  return { x: 16, y: height - 18, len: r1(len), km };
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const nodeMajorMinor = process.versions.node.split('.').map(Number);
if (nodeMajorMinor[0] < 22 || (nodeMajorMinor[0] === 22 && nodeMajorMinor[1] < 18)) {
  fail(`Node ${process.versions.node} cannot import .ts files natively; use Node >= 22.18.`);
}

// Importing .ts files triggers two expected warnings (type stripping, typeless package.json).
process.removeAllListeners('warning');
process.on('warning', (w) => {
  if (w.name === 'ExperimentalWarning' || w.code === 'MODULE_TYPELESS_PACKAGE_JSON') return;
  console.warn(`${w.name}: ${w.message}`);
});

const mapData = await import(pathToFileURL(join(ROOT, 'lib', 'mapData.ts')).href);
const { tripMaps, overviewMap, TRIP_MAP_IDS, mapSignature, stopDetail } = mapData;

// Cross-check the definitions against the trip data (read-only). lib/data.ts uses the
// bundler-style imports Next.js allows ('./site', '@/lib/x'); this resolve hook lets plain
// Node follow them to the .ts files.
{
  const hook = `
    const ROOT = ${JSON.stringify(pathToFileURL(ROOT + '/').href)};
    export async function resolve(specifier, context, next) {
      if (specifier.startsWith('@/')) specifier = new URL(specifier.slice(2), ROOT).href;
      try {
        return await next(specifier, context);
      } catch (error) {
        const relative = specifier.startsWith('.') || specifier.startsWith('file:');
        if (relative && !/\\.[cm]?[jt]sx?$/.test(specifier)) return next(specifier + '.ts', context);
        throw error;
      }
    }
    export async function load(url, context, next) {
      // Declare .ts files as ES modules up front (no typeless-package detection warning).
      if (url.endsWith('.ts')) return next(url, { ...context, format: 'module-typescript' });
      return next(url, context);
    }`;
  register('data:text/javascript,' + encodeURIComponent(hook));
  let trips;
  try {
    ({ trips } = await import(pathToFileURL(join(ROOT, 'lib', 'data.ts')).href));
  } catch (error) {
    fail(`could not import lib/data.ts to cross-check trip ids: ${error.message}`);
  }
  for (const id of TRIP_MAP_IDS) {
    const trip = trips.find((t) => t.id === id);
    if (!trip) fail(`lib/mapData.ts defines a map for "${id}", but lib/data.ts has no trip with that id`);
    const def = tripMaps[id];
    if (def.kind === 'route') {
      const covered = new Set(def.stops.flatMap((s) => parseDays(s.days)));
      const missing = trip.itinerary.map((d) => d.day).filter((d) => !covered.has(d));
      if (missing.length) fail(`${id}: itinerary day(s) ${missing.join(', ')} have no map stop`);
    }
  }
  for (const t of trips) if (!TRIP_MAP_IDS.includes(t.id)) console.warn(`  note: trip "${t.id}" has no map definition`);
}

console.log(`Natural Earth ${NE_VERSION}:`);
const raw = {};
for (const key of Object.keys(SOURCES)) raw[key] = await loadSource(key, args.source);

// --- Countries (IND POV) -----------------------------------------------------------------------
const countryFeatures = [];
let indiaMulti = null;
for (const f of raw.countries.features) {
  const a3 = f.properties.ADM0_A3;
  const multi = clipToBox(toMultiPolygon(f.geometry), CLIP_BOX);
  if (!multi.length) continue;
  if (a3 === 'IND') indiaMulti = multi;
  countryFeatures.push(multiFeature(multi, { a3 }, a3));
}
if (!indiaMulti) fail('India (ADM0_A3 = IND) not found in the countries file');
{
  const india = countryFeatures.find((f) => f.id === 'IND');
  const tests = [
    ['Gilgit', [74.3, 35.9]],
    ['Muzaffarabad', [73.47, 34.37]],
    ['Aksai Chin', [79.3, 35.2]],
    ['Tawang', [91.86, 27.59]],
  ];
  for (const [name, pt] of tests) {
    if (!geoContains(india, pt)) fail(`India polygon does not contain ${name}: this is not the India point-of-view boundary file. Refusing to build.`);
  }
  console.log('  India point-of-view boundary confirmed (Gilgit, Muzaffarabad, Aksai Chin, Tawang inside India)');
}

// --- Internal Indian state lines -------------------------------------------------------------
const stateFeatures = raw.states.features
  .filter((f) => f.properties.adm0_a3 === 'IND')
  .map((f) => multiFeature(toMultiPolygon(f.geometry), { iso: f.properties.iso_3166_2 }, f.properties.iso_3166_2));
if (stateFeatures.length < 30) fail(`only ${stateFeatures.length} Indian admin-1 features found`);
const DROP_PAIRS = new Set(['IN-JK|IN-LA', 'IN-LA|IN-JK']);

// --- Physical regions -------------------------------------------------------------------------
function regionByNames(names) {
  const parts = names.map((name) => {
    const f = raw.regions.features.find((r) => r.properties.NAME === name);
    if (!f) fail(`Natural Earth geography region "${name}" not found`);
    return toMultiPolygon(f.geometry);
  });
  const union = parts.length > 1 ? polygonClipping.union(...parts) : parts[0];
  const clipped = polygonClipping.intersection(union, indiaMulti);
  if (!clipped.length) fail(`region ${names.join(' + ')} does not intersect India`);
  return clipped;
}
const WESTERN_GHATS = ['WESTERN GHATS', 'Southern Ghats'];
const regionGeoms = new Map(); // key -> multipolygon (lon/lat)
regionGeoms.set('westernGhats', regionByNames(WESTERN_GHATS));
for (const id of TRIP_MAP_IDS) {
  const def = tripMaps[id];
  if (def.kind !== 'region') continue;
  if (def.region.kind === 'naturalEarth') regionGeoms.set(id, regionByNames(def.region.features));
  else regionGeoms.set(id, ellipsePolygon(def.region));
}
const regionFeatures = [...regionGeoms].map(([key, multi]) => multiFeature(multi, { key }, key));

// --- Reference cities ---------------------------------------------------------------------------
function city(name) {
  const f = raw.places.features.find((p) => p.properties.adm0_a3 === 'IND' && p.properties.name === name);
  if (!f) fail(`reference city "${name}" not found in Natural Earth populated places (India)`);
  return { name, lon: f.properties.longitude, lat: f.properties.latitude };
}

// --- Topology + simplification weights --------------------------------------------------------
console.log('Building topology…');
const topo = topology({
  countries: { type: 'FeatureCollection', features: countryFeatures },
  states: { type: 'FeatureCollection', features: stateFeatures },
  regions: { type: 'FeatureCollection', features: regionFeatures },
});
const pre = presimplify(topo, sphericalTriangleArea);

/** Base layers shared by every map, projected and simplified for that map's scale. */
function baseLayers(projection, width, height, { regionKeys = [], tolerance }) {
  const k = unitsPerRadian(projection, width, height);
  const t = simplify(pre, tolerance / (k * k));
  const path = geoPath(projection).digits(1);

  // Tiny land parts (from the unsimplified geometry) become dots, so islands such as
  // Lakshadweep stay visible at small scales; the simplified fill drops them.
  const islands = [];
  const isTiny = (poly) => {
    const b = bboxOf(poly[0]);
    return b[2] - b[0] < 0.5 && b[3] - b[1] < 0.5;
  };
  for (const f of countryFeatures) {
    for (const poly of f.geometry.coordinates) {
      if (!isTiny(poly)) continue;
      const g = { type: 'Polygon', coordinates: poly };
      const area = path.area(g);
      if (area <= 0 || area >= ISLAND_PX2) continue;
      const [x, y] = path.centroid(g);
      if (Number.isFinite(x) && !islands.some((i) => Math.hypot(i[0] - x, i[1] - y) < 3)) {
        islands.push([r1(x), r1(y), f.id === 'IND' ? 1 : 0]);
      }
    }
  }
  const keepPart = (poly) => {
    const area = path.area({ type: 'Polygon', coordinates: poly });
    if (area <= 0) return false;
    return area >= ISLAND_PX2 || !isTiny(poly);
  };
  const countries = feature(t, t.objects.countries).features;
  const filtered = (fs) => ({
    type: 'MultiPolygon',
    coordinates: fs.flatMap((f) => toMultiPolygon(f.geometry).filter(keepPart)),
  });
  const land = path(filtered(countries.filter((f) => f.id === 'IND'))) ?? '';
  const neighbours = path(filtered(countries.filter((f) => f.id !== 'IND'))) ?? '';
  const borders = path(mesh(t, t.objects.countries, (a, b) => a !== b)) ?? '';
  const coast = path(mesh(t, t.objects.countries, (a, b) => a === b)) ?? '';
  const states =
    path(
      mesh(t, t.objects.states, (a, b) => a !== b && !DROP_PAIRS.has(`${a.id}|${b.id}`)),
    ) ?? '';
  const regionFs = feature(t, t.objects.regions).features;
  const regions = {};
  for (const key of regionKeys) {
    const f = regionFs.find((r) => r.id === key);
    if (!f) fail(`region ${key} missing from topology`);
    regions[key] = path(f) ?? '';
  }
  return { paths: { neighbours, land, states, borders, coast }, regions, islands, path };
}

function projectPoint(projection, lon, lat) {
  const p = projection([lon, lat]);
  if (!p) fail(`cannot project ${lon}, ${lat}`);
  return p;
}

function inFrame([x, y], width, height, inset) {
  return x >= inset && y >= inset && x <= width - inset && y <= height - inset;
}

function cityLayer(names, projection, width, height) {
  return names.map((name) => {
    const c = city(name);
    const [x, y] = projectPoint(projection, c.lon, c.lat);
    if (!inFrame([x, y], width, height, 6)) fail(`reference city ${name} falls outside the map frame`);
    return { name, x: r1(x), y: r1(y) };
  });
}

// --- Text layouts -----------------------------------------------------------------------------
// Every map carries two label layouts: 'lg' (containers >= 460 px wide) and 'sm' (larger type
// for phones). Both are collision-checked here; the components switch between them with a CSS
// container query and read the font sizes from the JSON, so this table is the single source.
const LAYOUTS = {
  lg: { text: 1, marker: 1, region: 1 },
  sm: { text: 1.45, marker: 1.22, region: 1.3 },
};

function fontsFor(L) {
  const s = (font, k) => ({ size: Math.round(font.size * k * 10) / 10, weight: font.weight });
  return {
    stop: s(FONT.stop, L.text),
    gateway: s(FONT.gateway, L.text),
    city: s(FONT.city, L.text),
    tipTitle: s(FONT.tipTitle, L.text),
    tipBody: s(FONT.tipBody, L.text),
    scale: s(FONT.scale, L.text),
    pill: s(FONT.pill, L.marker),
    regionTitle: s(FONT.regionTitle, L.region),
    regionSub: s(FONT.regionSub, L.region),
    overview: s(FONT.overview, L.region),
    pillH: Math.round(PILL_H * L.marker * 10) / 10,
    baseR: Math.round(BASE_R * L.marker * 10) / 10,
  };
}

/** Font sizes only, as stored in the JSON for the component's CSS variables. */
function fontSizes(F) {
  const out = {};
  for (const [k, v] of Object.entries(F)) out[k] = typeof v === 'number' ? v : v.size;
  return out;
}

const cityObstacle = (c, k = 1) => ({ id: `city:${c.name}`, x0: c.x - 3 * k, y0: c.y - 3 * k, x1: c.x + 3 * k, y1: c.y + 3 * k });
const cityItem = (c, F) => ({ id: `city:${c.name}`, x: c.x, y: c.y, hw: 3, hh: 3, text: c.name, font: F.city, optional: true });

function scaleBox(bar, F) {
  return { id: '__scale', x0: bar.x - 4, y0: bar.y - 10 - F.scale.size * 1.2, x1: Math.max(bar.x + bar.len + 6, bar.x + textWidth(`${bar.km} km`, F.scale) + 6), y1: bar.y + 8 };
}

function checkInFrame(box, width, height, what) {
  if (box.x0 < 4 || box.x1 > width - 4 || box.y0 < 4 || box.y1 > height - 4) fail(`${what} leaves the map frame; move its labelAt in lib/mapData.ts`);
}

// --- Route map ----------------------------------------------------------------------------------
function buildRouteMap(def) {
  const stops = new Map(def.stops.map((s) => [s.id, s]));
  for (const id of def.route) if (!stops.has(id)) fail(`${def.id}: route references unknown stop ${id}`);
  for (const s of def.stops) {
    if (s.spurFrom && !stops.has(s.spurFrom)) fail(`${def.id}: ${s.id} spurs from unknown stop ${s.spurFrom}`);
    if (!s.spurFrom && !def.route.includes(s.id)) fail(`${def.id}: stop ${s.id} is neither on the route nor a spur`);
  }
  for (const g of def.gateways) if (!stops.has(g.connectsTo)) fail(`${def.id}: gateway ${g.id} connects to unknown stop`);

  const sb = bboxOf(def.stops.map((s) => [s.lon, s.lat]));
  const onMapGateways = def.gateways.filter(
    (g) =>
      g.lon >= sb[0] - GATEWAY_INCLUDE_DEG &&
      g.lon <= sb[2] + GATEWAY_INCLUDE_DEG &&
      g.lat >= sb[1] - GATEWAY_INCLUDE_DEG &&
      g.lat <= sb[3] + GATEWAY_INCLUDE_DEG,
  );
  const pts = [...def.stops, ...onMapGateways].map((p) => [p.lon, p.lat]);
  const b = bboxOf(pts);
  const midLat = ((b[1] + b[3]) / 2) * (Math.PI / 180);
  const padLon = def.padDeg / Math.cos(midLat);
  const box = [b[0] - padLon, b[1] - def.padDeg, b[2] + padLon, b[3] + def.padDeg];
  const { projection, width, height } = makeProjection(box, { minAspect: 0.75, maxAspect: 1.35 });
  const base = baseLayers(projection, width, height, {
    regionKeys: def.shadeWesternGhats ? ['westernGhats'] : [],
    tolerance: SIMPLIFY_PX2.route,
  });

  // Stop positions
  const P = new Map();
  for (const s of def.stops) {
    const [x, y] = projectPoint(projection, s.lon, s.lat);
    if (!inFrame([x, y], width, height, 16)) fail(`${def.id}: stop ${s.id} is outside the frame`);
    P.set(s.id, { x, y });
  }

  // Main route and cumulative position (for the staggered marker reveal)
  const routePts = def.route.map((id) => P.get(id));
  let length = 0;
  const along = new Map([[def.route[0], 0]]);
  for (let i = 1; i < routePts.length; i++) {
    length += Math.hypot(routePts[i].x - routePts[i - 1].x, routePts[i].y - routePts[i - 1].y);
    along.set(def.route[i], length);
  }
  const routeD = routePts.map((p, i) => `${i ? 'L' : 'M'}${r1(p.x)},${r1(p.y)}`).join('');
  const segments = [];
  for (let i = 1; i < routePts.length; i++) {
    segments.push({ a: [routePts[i - 1].x, routePts[i - 1].y], b: [routePts[i].x, routePts[i].y], owner: null });
  }
  const spurs = def.stops
    .filter((s) => s.spurFrom)
    .map((s) => {
      const a = P.get(s.spurFrom);
      const c = P.get(s.id);
      segments.push({ a: [a.x, a.y], b: [c.x, c.y], owner: null });
      return { id: s.id, d: `M${r1(a.x)},${r1(a.y)}L${r1(c.x)},${r1(c.y)}` };
    });

  // Gateways: on-map points, or an arrow at the frame edge pointing towards them.
  const gateways = {};
  const legs = [];
  const EDGE = 30;
  for (const g of def.gateways) {
    const s = P.get(g.connectsTo);
    const [gx, gy] = projectPoint(projection, g.lon, g.lat);
    const onMap = onMapGateways.includes(g) && inFrame([gx, gy], width, height, 16);
    let x = gx;
    let y = gy;
    let angle = null;
    if (!onMap) {
      const dx = gx - s.x;
      const dy = gy - s.y;
      let tMax = 1;
      if (dx > 0) tMax = Math.min(tMax, (width - EDGE - s.x) / dx);
      if (dx < 0) tMax = Math.min(tMax, (EDGE - s.x) / dx);
      if (dy > 0) tMax = Math.min(tMax, (height - EDGE - s.y) / dy);
      if (dy < 0) tMax = Math.min(tMax, (EDGE - s.y) / dy);
      x = s.x + dx * tMax;
      y = s.y + dy * tMax;
      angle = r1((Math.atan2(dy, dx) * 180) / Math.PI);
    }
    legs.push({ id: g.id, d: `M${r1(s.x)},${r1(s.y)}L${r1(x)},${r1(y)}`, offMap: !onMap });
    segments.push({ a: [s.x, s.y], b: [x, y], owner: g.id });
    gateways[g.id] = { x: r1(x), y: r1(y), offMap: !onMap, angle };
  }

  const cities = cityLayer(def.referenceCities, projection, width, height);
  const bar = scaleBar(projection, width, height);
  const anchors = [
    ...[...P].map(([id, p]) => ({ id, x: p.x, y: p.y })),
    ...def.gateways.map((g) => ({ id: g.id, x: gateways[g.id].x, y: gateways[g.id].y })),
  ];
  const crowd = (id) => [...P.values()].filter((q) => Math.hypot(q.x - P.get(id).x, q.y - P.get(id).y) < 90).length;

  const layouts = {};
  const fonts = {};
  for (const [name, L] of Object.entries(LAYOUTS)) {
    const F = fontsFor(L);
    fonts[name] = fontSizes(F);
    const ring = RING * L.marker;
    const size = new Map(
      def.stops.map((s) => [
        s.id,
        s.days
          ? { w: Math.max(F.pillH, textWidth(s.days, F.pill) + 14 * L.marker), h: F.pillH }
          : { w: F.baseR * 2, h: F.baseR * 2 },
      ]),
    );
    const markerObstacles = def.stops.map((s) => {
      const p = P.get(s.id);
      const z = size.get(s.id);
      return { id: s.id, x0: p.x - z.w / 2 - ring, y0: p.y - z.h / 2 - ring, x1: p.x + z.w / 2 + ring, y1: p.y + z.h / 2 + ring };
    });
    for (let i = 0; i < markerObstacles.length; i++) {
      for (let j = i + 1; j < markerObstacles.length; j++) {
        if (overlap(markerObstacles[i], markerObstacles[j], -2)) {
          console.warn(`  note [${name}]: markers ${markerObstacles[i].id} and ${markerObstacles[j].id} touch`);
        }
      }
    }
    const gwHalf = 7 * L.marker;
    const gatewayObstacles = def.gateways.map((g) => {
      const p = gateways[g.id];
      return { id: g.id, x0: p.x - gwHalf, y0: p.y - gwHalf, x1: p.x + gwHalf, y1: p.y + gwHalf };
    });
    const obstacles = [...markerObstacles, ...gatewayObstacles, ...cities.map((c) => cityObstacle(c, L.marker)), scaleBox(bar, F)];
    const stopItems = def.stops
      .map((s) => {
        const p = P.get(s.id);
        const z = size.get(s.id);
        return { id: s.id, x: p.x, y: p.y, hw: z.w / 2 + ring, hh: z.h / 2 + ring, text: s.label, font: F.stop };
      })
      .sort((a, c) => crowd(c.id) - crowd(a.id));
    const gatewayItems = def.gateways.map((g) => ({
      id: g.id,
      x: gateways[g.id].x,
      y: gateways[g.id].y,
      hw: gwHalf,
      hh: gwHalf,
      text: g.label,
      font: F.gateway,
    }));
    const labels = placeLabels([...stopItems, ...gatewayItems, ...cities.map((c) => cityItem(c, F))], {
      obstacles,
      segments,
      width,
      height,
      anchors,
    });

    // Tooltips: above the marker, or below when there is no room; kept inside the frame.
    const tips = {};
    const pad = 11 * L.text;
    for (const s of def.stops) {
      const p = P.get(s.id);
      const z = size.get(s.id);
      const w = Math.min(width - 8, Math.max(textWidth(s.name, F.tipTitle), textWidth(stopDetail(s), F.tipBody)) + 2 * pad);
      const t1 = 8 * L.text + F.tipTitle.size;
      const t2 = t1 + F.tipBody.size * 1.45;
      const h = t2 + 10 * L.text;
      let y = p.y - z.h / 2 - ring - 8 - h;
      if (y < 4) y = p.y + z.h / 2 + ring + 8;
      const x = Math.min(Math.max(p.x - w / 2, 4), width - 4 - w);
      tips[s.id] = { x: r1(x), y: r1(y), w: r1(w), h: r1(h), pad: r1(pad), t1: r1(t1), t2: r1(t2) };
    }
    layouts[name] = { size, labels, tips };
  }

  const stopsOut = {};
  for (const s of def.stops) {
    const p = P.get(s.id);
    const frac = s.spurFrom ? Math.min(1, along.get(s.spurFrom) / length + 0.04) : along.get(s.id) / length;
    const per = (name) => {
      const z = layouts[name].size.get(s.id);
      return { w: r1(z.w), h: r1(z.h), label: layouts[name].labels.get(s.id), tip: layouts[name].tips[s.id] };
    };
    stopsOut[s.id] = { x: r1(p.x), y: r1(p.y), delay: Math.round(frac * 1000) / 1000, lg: per('lg'), sm: per('sm') };
  }
  for (const g of def.gateways) {
    gateways[g.id].lg = layouts.lg.labels.get(g.id);
    gateways[g.id].sm = layouts.sm.labels.get(g.id);
  }

  return {
    version: 2,
    id: def.id,
    kind: 'route',
    signature: mapSignature(def),
    naturalEarth: NE_VERSION,
    width,
    height,
    fonts,
    paths: base.paths,
    ghats: base.regions.westernGhats ?? null,
    islands: base.islands,
    route: { d: routeD, length: r1(length) },
    spurs,
    legs,
    stops: stopsOut,
    gateways,
    cities: cities.map((c) => ({
      ...c,
      lg: layouts.lg.labels.get(`city:${c.name}`) ?? null,
      sm: layouts.sm.labels.get(`city:${c.name}`) ?? null,
    })),
    scale: bar,
  };
}

// --- Region map ---------------------------------------------------------------------------------
function buildRegionMap(def) {
  const { projection, width, height } = makeProjection(def.extent, { minAspect: 0.6, maxAspect: 1.4 });
  const keys = [];
  if (def.region.kind === 'naturalEarth') keys.push(def.id);
  if (def.shadeWesternGhats) keys.push('westernGhats');
  const base = baseLayers(projection, width, height, { regionKeys: keys, tolerance: SIMPLIFY_PX2.region });
  // Ellipses are smooth and need no simplification: project directly.
  const region =
    def.region.kind === 'naturalEarth' ? base.regions[def.id] : base.path(multiFeature(regionGeoms.get(def.id)));

  const [lx, ly] = projectPoint(projection, def.labelAt.lon, def.labelAt.lat);
  const cities = cityLayer(def.referenceCities, projection, width, height);
  const bar = scaleBar(projection, width, height);
  const fonts = {};
  const cityLabels = {};
  for (const [name, L] of Object.entries(LAYOUTS)) {
    const F = fontsFor(L);
    fonts[name] = fontSizes(F);
    const lines = [
      { text: def.regionLabel[0], font: F.regionTitle },
      { text: def.regionLabel[1], font: F.regionSub },
    ];
    const labelBox = { id: '__region', ...fixedLabelBox(lx, ly, def.labelAt.anchor, lines) };
    checkInFrame(labelBox, width, height, `${def.id}: region label [${name}]`);
    const sBox = scaleBox(bar, F);
    if (overlap(labelBox, sBox)) fail(`${def.id}: region label [${name}] overlaps the scale bar; move labelAt`);
    cityLabels[name] = placeLabels(
      cities.map((c) => cityItem(c, F)),
      { obstacles: [labelBox, sBox, ...cities.map((c) => cityObstacle(c, L.marker))], segments: [], width, height },
    );
  }
  return {
    version: 2,
    id: def.id,
    kind: 'region',
    signature: mapSignature(def),
    naturalEarth: NE_VERSION,
    width,
    height,
    fonts,
    paths: base.paths,
    ghats: base.regions.westernGhats ?? null,
    islands: base.islands,
    region,
    regionLabel: { x: r1(lx), y: r1(ly), anchor: def.labelAt.anchor },
    cities: cities.map((c) => ({
      ...c,
      lg: cityLabels.lg.get(`city:${c.name}`) ?? null,
      sm: cityLabels.sm.get(`city:${c.name}`) ?? null,
    })),
    scale: bar,
  };
}

// --- India overview -----------------------------------------------------------------------------
function buildOverview() {
  const india = bboxOf(indiaMulti);
  const pad = 0.8;
  const box = [india[0] - pad, india[1] - pad, india[2] + pad, india[3] + pad];
  const { projection, width, height } = makeProjection(box, { minAspect: 0.8, maxAspect: 1.3 });
  const keys = overviewMap.regions
    .map((r) => r.tripId)
    .filter((id) => tripMaps[id].kind === 'region' && tripMaps[id].region.kind === 'naturalEarth');
  const base = baseLayers(projection, width, height, { regionKeys: keys, tolerance: SIMPLIFY_PX2.overview });
  const cities = cityLayer(overviewMap.referenceCities, projection, width, height);
  const bar = scaleBar(projection, width, height);

  const regions = {};
  for (const r of overviewMap.regions) {
    const def = tripMaps[r.tripId];
    let shape = null;
    let route = null;
    if (def.kind === 'route') {
      route = def.route
        .map((id) => def.stops.find((s) => s.id === id))
        .map((s, i) => {
          const [x, y] = projectPoint(projection, s.lon, s.lat);
          return `${i ? 'L' : 'M'}${r1(x)},${r1(y)}`;
        })
        .join('');
    } else if (def.region.kind === 'naturalEarth') {
      shape = base.regions[r.tripId];
    } else {
      shape = base.path(multiFeature(regionGeoms.get(r.tripId)));
    }
    const [lx, ly] = projectPoint(projection, r.labelAt.lon, r.labelAt.lat);
    regions[r.tripId] = { shape, route, label: { x: r1(lx), y: r1(ly), anchor: r.labelAt.anchor }, leader: null };
  }

  const fonts = {};
  const cityLabels = {};
  for (const [name, L] of Object.entries(LAYOUTS)) {
    const F = fontsFor(L);
    fonts[name] = fontSizes(F);
    const fixed = [];
    for (const r of overviewMap.regions) {
      const { label } = regions[r.tripId];
      const lines = [
        { text: r.label[0], font: F.overview },
        { text: r.label[1], font: F.overview },
      ];
      const lb = { id: r.tripId, ...fixedLabelBox(label.x, label.y, label.anchor, lines) };
      checkInFrame(lb, width, height, `overview: label for ${r.tripId} [${name}]`);
      for (const other of fixed) if (overlap(lb, other, 2)) fail(`overview: labels for ${r.tripId} and ${other.id} overlap [${name}]`);
      fixed.push(lb);
      if (r.leaderTo) {
        const [tx, ty] = projectPoint(projection, r.leaderTo.lon, r.leaderTo.lat);
        regions[r.tripId].leader ??= {};
        regions[r.tripId].leader[name] = [r1(Math.min(Math.max(tx, lb.x0), lb.x1)), r1(Math.min(Math.max(ty, lb.y0), lb.y1)), r1(tx), r1(ty)];
      }
    }
    const sBox = scaleBox(bar, F);
    for (const f of fixed) if (overlap(f, sBox)) fail(`overview: label ${f.id} overlaps the scale bar [${name}]`);
    cityLabels[name] = placeLabels(
      cities.map((c) => cityItem(c, F)),
      { obstacles: [...fixed, sBox, ...cities.map((c) => cityObstacle(c, L.marker))], segments: [], width, height },
    );
  }
  return {
    version: 2,
    id: 'india-overview',
    kind: 'overview',
    signature: mapSignature(overviewMap),
    naturalEarth: NE_VERSION,
    width,
    height,
    fonts,
    paths: base.paths,
    islands: base.islands,
    regions,
    cities: cities.map((c) => ({
      ...c,
      lg: cityLabels.lg.get(`city:${c.name}`) ?? null,
      sm: cityLabels.sm.get(`city:${c.name}`) ?? null,
    })),
    scale: bar,
  };
}

// --- Write ----------------------------------------------------------------------------------------
await mkdir(OUT_DIR, { recursive: true });
const outputs = [];
for (const id of TRIP_MAP_IDS) {
  const def = tripMaps[id];
  console.log(`Map ${id}…`);
  outputs.push([`${id}.json`, def.kind === 'route' ? buildRouteMap(def) : buildRegionMap(def)]);
}
console.log('Map india-overview…');
outputs.push(['india-overview.json', buildOverview()]);

const LIMIT = 150 * 1024;
for (const [file, data] of outputs) {
  const text = JSON.stringify(data);
  if (text.length > LIMIT) fail(`${file} is ${(text.length / 1024).toFixed(1)} KB, over the ${LIMIT / 1024} KB budget; raise SIMPLIFY_PX2 for that map kind`);
  await writeFile(join(OUT_DIR, file), text + '\n');
  console.log(`  wrote lib/geo/${file}  ${(text.length / 1024).toFixed(1)} KB  ${data.width}×${data.height}`);
}
console.log('Done.');
