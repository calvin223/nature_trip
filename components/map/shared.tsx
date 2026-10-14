import type { CSSProperties, ReactNode } from 'react';

/*
 * Shared pieces for the static SVG maps (TripMap, IndiaOverviewMap).
 * Geometry and label layout are precomputed by scripts/build-map-data.mjs into lib/geo/*.json.
 *
 * Every map carries two collision-checked text layouts: 'lg' for containers at least 460 px
 * wide and 'sm' (larger type, so labels stay legible at 360 px). A CSS container query on
 * .wdm shows one and hides the other. Font sizes come from the JSON (`fonts`).
 */

export type Anchor = 'start' | 'middle' | 'end';
export type LayoutName = 'lg' | 'sm';
export const LAYOUT_NAMES: LayoutName[] = ['lg', 'sm'];

export interface PlacedLabel {
  x: number;
  y: number;
  anchor: Anchor;
  /** [x1, y1, x2, y2] from the marker edge to the label, when the label sits away from it. */
  leader: number[] | null;
}

export interface FontSizes {
  stop: number;
  gateway: number;
  city: number;
  tipTitle: number;
  tipBody: number;
  scale: number;
  pill: number;
  regionTitle: number;
  regionSub: number;
  overview: number;
  pillH: number;
  baseR: number;
}

export interface GeoBase {
  version: number;
  id: string;
  signature: string;
  naturalEarth: string;
  width: number;
  height: number;
  fonts: Record<LayoutName, FontSizes>;
  paths: { neighbours: string; land: string; states: string; borders: string; coast: string };
  /** [x, y, isIndia] dots for islands too small to draw as shapes. */
  islands: number[][];
  cities: ({ name: string; x: number; y: number } & Record<LayoutName, PlacedLabel | null>)[];
  scale: { x: number; y: number; len: number; km: number };
}

export interface StopLayout {
  w: number;
  h: number;
  label: PlacedLabel;
  tip: { x: number; y: number; w: number; h: number; pad: number; t1: number; t2: number };
}

export interface RouteGeo extends GeoBase {
  kind: 'route';
  ghats: string | null;
  route: { d: string; length: number };
  spurs: { id: string; d: string }[];
  legs: { id: string; d: string; offMap: boolean }[];
  stops: Record<string, { x: number; y: number; delay: number } & Record<LayoutName, StopLayout>>;
  gateways: Record<string, { x: number; y: number; offMap: boolean; angle: number | null } & Record<LayoutName, PlacedLabel>>;
}

export interface RegionGeo extends GeoBase {
  kind: 'region';
  ghats: string | null;
  region: string;
  regionLabel: { x: number; y: number; anchor: Anchor };
}

export interface OverviewGeo extends GeoBase {
  kind: 'overview';
  regions: Record<
    string,
    {
      shape: string | null;
      route: string | null;
      label: { x: number; y: number; anchor: Anchor };
      leader: Partial<Record<LayoutName, number[]>> | null;
    }
  >;
}

/** Inline CSS custom properties without fighting React's CSSProperties type. */
export function cssVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}

export function staleError(file: string): Error {
  return new Error(
    `lib/geo/${file}.json is stale: lib/mapData.ts changed since it was generated (or the JSON format moved on). Run "node scripts/build-map-data.mjs" and commit the output.`,
  );
}

/** Version of the JSON format these components read; the build script writes the same number. */
export const GEO_VERSION = 2;

/*
 * Colours follow the site's --wd-* tokens, each with a fallback. --wd-sea is optional.
 * Base-map strokes use non-scaling-stroke so hairlines stay crisp at 360 px and at 1200 px.
 * Text sizes are user units from the JSON: calc(var(--fs-*) * 1px).
 */
export const MAP_CSS = `
.wdm{position:relative;color:var(--wd-ink,#eaf3e3);container-type:inline-size}
.wdm-svg{display:block;width:100%;height:auto;border-radius:14px;background:var(--wd-sea,#06231f)}
.wdm text{font-family:inherit}
.wdm .wdm-sm{display:none}
@container (max-width:459px){.wdm .wdm-sm{display:inline}.wdm .wdm-lg{display:none}}
.wdm-sea{fill:var(--wd-sea,#06231f)}
.wdm-nb{fill:var(--wd-night,#07140d)}
.wdm-land{fill:var(--wd-canopy,#0d2618)}
.wdm-ghats{fill:var(--wd-forest,#134e2e);opacity:.95}
.wdm-states{fill:none;stroke:var(--wd-emerald,#1f7a45);stroke-opacity:.75;stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wdm-border{fill:none;stroke:var(--wd-sand,#efe6c8);stroke-opacity:.55;stroke-width:1;stroke-dasharray:4 2.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wdm-coast{fill:none;stroke:#4fb08c;stroke-opacity:.7;stroke-width:.9;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.wdm-isl{fill:var(--wd-canopy,#0d2618);stroke:#4fb08c;stroke-opacity:.85;stroke-width:.8;vector-effect:non-scaling-stroke}
.wdm-isl-nb{fill:var(--wd-night,#07140d);stroke:#4fb08c;stroke-opacity:.5;stroke-width:.8;vector-effect:non-scaling-stroke}
.wdm-halo{fill:var(--wdm-accent,var(--wd-lime,#9ad14b));opacity:.4}
.wdm-halo-core{fill:var(--wdm-accent,var(--wd-lime,#9ad14b));opacity:.16}
.wdm-lbl,.wdm-lbl-gw,.wdm-lbl-city,.wdm-rl1,.wdm-rl2,.wdm-ov-lbl,.wdm-scale-txt{paint-order:stroke;stroke:var(--wd-night,#07140d);stroke-linejoin:round}
.wdm-lbl{fill:var(--wd-ink,#eaf3e3);font-size:calc(var(--fs-stop) * 1px);font-weight:600;stroke-width:4px}
.wdm-lbl-gw{fill:var(--wd-sand,#efe6c8);font-size:calc(var(--fs-gateway) * 1px);font-weight:500;stroke-width:4px}
.wdm-lbl-city{fill:var(--wd-ink,#eaf3e3);fill-opacity:.72;font-size:calc(var(--fs-city) * 1px);font-style:italic;font-weight:500;stroke-width:3.5px}
.wdm-city{fill:var(--wd-ink,#eaf3e3);fill-opacity:.65;stroke:var(--wd-night,#07140d);stroke-width:1}
.wdm-rl1{fill:var(--wdm-accent,var(--wd-lime,#9ad14b));font-size:calc(var(--fs-regionTitle) * 1px);font-weight:700;stroke-width:4.5px}
.wdm-rl2{fill:var(--wd-ink,#eaf3e3);font-size:calc(var(--fs-regionSub) * 1px);font-weight:500;stroke-width:4px}
.wdm-leader{fill:none;stroke:var(--wd-ink,#eaf3e3);stroke-opacity:.8;stroke-width:1.4}
.wdm-route-glow{fill:none;stroke:var(--wd-lime,#9ad14b);stroke-opacity:.2;stroke-width:11;stroke-linecap:round;stroke-linejoin:round}
.wdm-route-line{fill:none;stroke:var(--wd-lime,#9ad14b);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.wdm-spur{fill:none;stroke:var(--wd-lime,#9ad14b);stroke-width:2.6;stroke-dasharray:.5 6;stroke-linecap:round}
.wdm-leg{fill:none;stroke:var(--wd-sand,#efe6c8);stroke-opacity:.8;stroke-width:1.8;stroke-dasharray:6 5}
.wdm-pill{fill:var(--wd-sun,#f2b134);stroke:var(--wd-night,#07140d);stroke-width:1.5;transition:fill .15s}
.wdm-pill-txt{fill:var(--wd-night,#07140d);font-size:calc(var(--fs-pill) * 1px);font-weight:700;pointer-events:none}
.wdm-ring{fill:none;stroke:var(--wd-lime,#9ad14b);stroke-width:2.2}
.wdm-base{fill:var(--wd-night,#07140d);stroke:var(--wd-sun,#f2b134);stroke-width:2.5;transition:stroke .15s}
.wdm-moon{fill:var(--wd-sun,#f2b134);pointer-events:none}
.wdm-gw{fill:var(--wd-sand,#efe6c8);stroke:var(--wd-night,#07140d);stroke-width:1.5}
.wdm-stop[data-active] .wdm-pill{fill:var(--wd-lime,#9ad14b)}
.wdm-stop[data-active] .wdm-base{stroke:var(--wd-lime,#9ad14b)}
.wdm-stop[data-active] .wdm-lbl{fill:var(--wd-lime,#9ad14b)}
.wdm-tip{opacity:0;transition:opacity .15s ease;pointer-events:none}
.wdm-tip[data-active]{opacity:1}
.wdm-tip-box{fill:var(--wd-night,#07140d);fill-opacity:.95;stroke:var(--wd-lime,#9ad14b);stroke-width:1.5}
.wdm-tip-t{fill:var(--wd-ink,#eaf3e3);font-size:calc(var(--fs-tipTitle) * 1px);font-weight:700}
.wdm-tip-b{fill:var(--wd-sand,#efe6c8);font-size:calc(var(--fs-tipBody) * 1px);font-weight:500}
.wdm-scale-bar{fill:var(--wd-ink,#eaf3e3);fill-opacity:.85}
.wdm-scale-txt{fill:var(--wd-ink,#eaf3e3);fill-opacity:.85;font-size:calc(var(--fs-scale) * 1px);stroke-width:3px}
.wdm-ov-link{cursor:pointer}
.wdm-ov-link .wdm-halo{transition:opacity .2s}
.wdm-ov-link:hover .wdm-halo,.wdm-ov-link[data-active] .wdm-halo{opacity:.8}
.wdm-ov-route{fill:none;stroke:var(--wdm-accent,var(--wd-lime,#9ad14b));stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.wdm-ov-routehalo{fill:none;stroke:var(--wdm-accent,var(--wd-lime,#9ad14b));stroke-width:18;stroke-linecap:round;stroke-linejoin:round;opacity:.45}
.wdm-ov-lbl{fill:var(--wdm-accent,var(--wd-lime,#9ad14b));font-size:calc(var(--fs-overview) * 1px);font-weight:700;stroke-width:4px}
.wdm-ov-leader{stroke:var(--wdm-accent,var(--wd-lime,#9ad14b));stroke-width:1.3;stroke-opacity:.8}
.wdm-ov-dim{opacity:.35}
.wdm-pop{transform-box:fill-box;transform-origin:center}
.wdm-key-route{stroke:var(--wd-lime,#9ad14b)}
.wdm-key-leg{stroke:var(--wd-sand,#efe6c8)}
@keyframes wdm-draw{to{stroke-dashoffset:0}}
@keyframes wdm-pop{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:none}}
@media (scripting:enabled) and (prefers-reduced-motion:no-preference){
  .wdm:not([data-anim="off"]) .wdm-route{stroke-dasharray:var(--wdm-len) var(--wdm-len);stroke-dashoffset:var(--wdm-len)}
  .wdm:not([data-anim="off"]) .wdm-pop{opacity:0}
  .wdm[data-anim="run"] .wdm-route,.wdm:not([data-anim]) .wdm-route{animation:wdm-draw var(--wdm-dur,2.8s) cubic-bezier(.45,0,.3,1) forwards}
  .wdm[data-anim="run"] .wdm-pop,.wdm:not([data-anim]) .wdm-pop{animation:wdm-pop .5s cubic-bezier(.3,1.4,.5,1) forwards;animation-delay:calc(var(--d,0) * var(--wdm-dur,2.8s))}
  /* Safety net: if JavaScript never hydrates, draw anyway after 3 s. */
  .wdm:not([data-anim]) .wdm-route{animation-delay:3s}
  .wdm:not([data-anim]) .wdm-pop{animation-delay:calc(3s + var(--d,0) * var(--wdm-dur,2.8s))}
}
`;

export function MapStyles() {
  return <style>{MAP_CSS}</style>;
}

/** The font-size variables for one layout. */
export function fontVars(f: FontSizes): CSSProperties {
  return cssVars({
    '--fs-stop': f.stop,
    '--fs-gateway': f.gateway,
    '--fs-city': f.city,
    '--fs-tipTitle': f.tipTitle,
    '--fs-tipBody': f.tipBody,
    '--fs-scale': f.scale,
    '--fs-pill': f.pill,
    '--fs-regionTitle': f.regionTitle,
    '--fs-regionSub': f.regionSub,
    '--fs-overview': f.overview,
  });
}

/** Renders `children(layout)` once per text layout; CSS shows the one that fits the container. */
export function Layouts({ geo, children }: { geo: GeoBase; children: (layout: LayoutName) => ReactNode }) {
  return (
    <>
      {LAYOUT_NAMES.map((name) => (
        <g key={name} className={`wdm-${name}`} style={fontVars(geo.fonts[name])}>
          {children(name)}
        </g>
      ))}
    </>
  );
}

/**
 * Sea, land, internal state lines, international borders, coast and island dots.
 * The Western Ghats band (if given) is blurred: Natural Earth draws it as a generalised
 * polygon, so a soft edge is the honest rendering.
 */
export function BaseLayers({ geo, ghats, ghatsFilterId }: { geo: GeoBase; ghats?: string | null; ghatsFilterId?: string }) {
  const { paths } = geo;
  return (
    <g aria-hidden="true">
      <rect className="wdm-sea" width={geo.width} height={geo.height} />
      {paths.neighbours && <path className="wdm-nb" d={paths.neighbours} />}
      <path className="wdm-land" d={paths.land} />
      {ghats && <path className="wdm-ghats" d={ghats} filter={ghatsFilterId ? `url(#${ghatsFilterId})` : undefined} />}
      {paths.states && <path className="wdm-states" d={paths.states} />}
      {paths.borders && <path className="wdm-border" d={paths.borders} />}
      {paths.coast && <path className="wdm-coast" d={paths.coast} />}
      {geo.islands.map(([x, y, india], i) => (
        <circle key={i} className={india ? 'wdm-isl' : 'wdm-isl-nb'} cx={x} cy={y} r={1.3} />
      ))}
    </g>
  );
}

/**
 * A soft, deliberately imprecise area: a blurred fill plus (unless `diffuse`) a faint core.
 * Use `diffuse` for shapes that are pure approximations (the central India ellipse), so no
 * crisp edge suggests a boundary.
 */
export function Halo({ d, filterId, accent, diffuse = false }: { d: string; filterId: string; accent?: string; diffuse?: boolean }) {
  return (
    <g aria-hidden="true" style={accent ? cssVars({ '--wdm-accent': accent }) : undefined}>
      <path className="wdm-halo" d={d} filter={`url(#${filterId})`} />
      {!diffuse && <path className="wdm-halo-core" d={d} />}
    </g>
  );
}

/** Gaussian blur over the whole map area (user space, so thin paths are not clipped). */
export function SoftFilter({ id, blur = 7, width, height }: { id: string; blur?: number; width: number; height: number }) {
  return (
    <filter id={id} filterUnits="userSpaceOnUse" x={-40} y={-40} width={width + 80} height={height + 80}>
      <feGaussianBlur stdDeviation={blur} />
    </filter>
  );
}

export function Label({ label, text, className }: { label: PlacedLabel; text: string; className: string }) {
  return (
    <>
      {label.leader && (
        <line className="wdm-leader" x1={label.leader[0]} y1={label.leader[1]} x2={label.leader[2]} y2={label.leader[3]} />
      )}
      <text className={className} x={label.x} y={label.y} dy="0.35em" textAnchor={label.anchor}>
        {text}
      </text>
    </>
  );
}

/** Reference-city dots and (per layout) their labels. */
export function Cities({ geo, layout }: { geo: GeoBase; layout: LayoutName }) {
  return (
    <g aria-hidden="true">
      {geo.cities.map((c) => {
        const label = c[layout];
        return (
          <g key={c.name}>
            <circle className="wdm-city" cx={c.x} cy={c.y} r={layout === 'sm' ? 3.4 : 2.8} />
            {label && <Label label={label} text={c.name} className="wdm-lbl-city" />}
          </g>
        );
      })}
    </g>
  );
}

export function ScaleBar({ scale }: { scale: GeoBase['scale'] }) {
  const { x, y, len, km } = scale;
  return (
    <g aria-hidden="true">
      <rect className="wdm-scale-bar" x={x} y={y} width={len} height={3} rx={1} />
      <rect className="wdm-scale-bar" x={x} y={y - 4} width={1.5} height={7} />
      <rect className="wdm-scale-bar" x={x + len - 1.5} y={y - 4} width={1.5} height={7} />
      <text className="wdm-scale-txt" x={x} y={y - 8}>
        {km} km
      </text>
    </g>
  );
}

export function Attribution({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-2 text-xs leading-relaxed text-[color:var(--wd-ink,#eaf3e3)]/70">
      {children}
      {children ? ' ' : null}
      Map data:{' '}
      <a
        href="https://www.naturalearthdata.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:text-[color:var(--wd-lime,#9ad14b)]"
      >
        Natural Earth
      </a>{' '}
      (public domain)
    </p>
  );
}
